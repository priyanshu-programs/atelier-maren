"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const TOTAL_FRAMES = 240;
const MOBILE_FRAME_STEP = 4; // Load every 4th frame on mobile → ~60 frames (saves ~20 requests vs step=3)
const MOBILE_BREAKPOINT = 768;
const MOBILE_BATCH_SIZE = 15; // Smaller batches for faster initial load

function frameUrl(i: number) {
  return `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;
}

/** Build the list of frame indices to load based on device */
function getFrameIndices(isMobile: boolean): number[] {
  const indices: number[] = [];
  for (let i = 0; i < TOTAL_FRAMES; i += isMobile ? MOBILE_FRAME_STEP : 1) {
    indices.push(i);
  }
  return indices;
}

/** Load a single frame image */
function loadFrame(frameIndex: number): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = frameUrl(frameIndex);
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

/** Erase image pixels at the top of the canvas so they fade to transparent */
function applyTopFade(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  const fadeHeight = h * 0.35;
  const grad = ctx.createLinearGradient(0, 0, 0, fadeHeight);
  grad.addColorStop(0, "rgba(0,0,0,1)");
  grad.addColorStop(0.3, "rgba(0,0,0,0.8)");
  grad.addColorStop(0.55, "rgba(0,0,0,0.4)");
  grad.addColorStop(0.8, "rgba(0,0,0,0.1)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, fadeHeight);
  ctx.restore();
}

export default function ExplodingVideo() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnFrameRef = useRef<number>(-1); // Throttle: track last drawn index
  const logicalSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const isMobileRef = useRef(false);
  const [ready, setReady] = useState(false);

  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  // Preload frames — progressive on mobile, parallel on desktop
  useEffect(() => {
    let cancelled = false;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    isMobileRef.current = isMobile;

    const frameIndices = getFrameIndices(isMobile);

    /** Initialize the canvas with the correct dimensions */
    const initCanvas = (firstImg: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = firstImg.naturalWidth;
      const height = firstImg.naturalHeight;

      if (isMobile) {
        // Halve resolution on mobile — CSS handles visual sizing, no need for
        // full-res canvas draws on small screens
        const lw = Math.round(width / 2);
        const lh = Math.round(height / 2);
        canvas.width = lw;
        canvas.height = lh;
        logicalSizeRef.current = { w: lw, h: lh };
      } else {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        // Logical size is the pre-DPR dimensions; ctx.scale handles the rest
        logicalSizeRef.current = { w: width, h: height };
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        }
      }

      // Draw first frame immediately with top fade
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const { w, h } = logicalSizeRef.current;
        ctx.drawImage(firstImg, 0, 0, w, h);
        applyTopFade(ctx, w, h);
      }
    };

    const preload = async () => {
      if (isMobile) {
        // Progressive loading: load first batch, then remaining batches in background
        const firstBatchIndices = frameIndices.slice(0, MOBILE_BATCH_SIZE);
        const firstBatch = await Promise.all(firstBatchIndices.map(loadFrame));
        if (cancelled) return;

        // Initialize array with slots for all frames
        const allFrames = new Array<HTMLImageElement>(frameIndices.length);
        firstBatch.forEach((img, i) => { allFrames[i] = img; });
        framesRef.current = allFrames;

        initCanvas(firstBatch[0]);
        setReady(true); // Sequence is usable now

        // Load remaining batches in the background
        for (let start = MOBILE_BATCH_SIZE; start < frameIndices.length; start += MOBILE_BATCH_SIZE) {
          if (cancelled) return;
          const batchIndices = frameIndices.slice(start, start + MOBILE_BATCH_SIZE);
          const batch = await Promise.all(batchIndices.map(loadFrame));
          if (cancelled) return;
          batch.forEach((img, i) => { allFrames[start + i] = img; });
        }
      } else {
        // Desktop: load all frames in parallel (original behavior)
        const loaded = await Promise.all(frameIndices.map(loadFrame));
        if (cancelled) return;

        framesRef.current = loaded;
        initCanvas(loaded[0]);
        setReady(true);
      }
    };

    preload();

    return () => { cancelled = true; };
  }, []);

  // GSAP scroll-driven frame animation
  useGSAP(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames = framesRef.current;
    const isMobile = isMobileRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: isMobile ? 0.5 : 0.3, // Slightly larger scrub on mobile for smoother feel
      },
    });

    const proxy = { frame: 0 };

    tl.to(proxy, {
      frame: frames.length - 1,
      ease: "none",
      duration: 1,
      snap: { frame: 1 },
      onUpdate: () => {
        const idx = Math.round(proxy.frame);
        // Throttle: skip redraw if same frame as last time
        if (idx === lastDrawnFrameRef.current) return;
        lastDrawnFrameRef.current = idx;

        const img = frames[idx];
        // Guard: frame may not be loaded yet during progressive loading
        if (img) {
          // Use logical dimensions (pre-DPR) — ctx.scale handles DPR on desktop
          const { w, h } = logicalSizeRef.current;
          ctx.clearRect(0, 0, w, h);
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(img, 0, 0, w, h);
          applyTopFade(ctx, w, h);
        }
      },
    }, 0);

    if (isMobile) {
      // Mobile: simple fade + scale text reveals (no SVG filters)
      const applySimpleReveal = (ref: React.RefObject<HTMLDivElement | null>, startEnter: number, startExit: number) => {
        // Entrance
        tl.fromTo(ref.current,
          { opacity: 0, scale: 0.92, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "power3.out" },
          startEnter
        );
        // Exit
        tl.to(ref.current,
          { opacity: 0, scale: 1.05, y: -20, duration: 0.15, ease: "power2.in" },
          startExit
        );
      };

      applySimpleReveal(text1Ref, 0.1, 0.25);
      applySimpleReveal(text2Ref, 0.4, 0.55);
      applySimpleReveal(text3Ref, 0.7, 0.85);
    } else {
      // Desktop: full liquid/ink reveal with SVG filters
      const applyLiquidReveal = (ref: React.RefObject<HTMLDivElement | null>, num: number, startEnter: number, startExit: number) => {
        if (ref.current) {
          gsap.set(ref.current, { filter: `url(#liquid-reveal-${num})` });
        }

        // Entrance Text
        tl.fromTo(ref.current,
          { opacity: 0, scale: 0.92, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "power3.out" },
          startEnter
        );

        // Entrance Distortion
        tl.fromTo(`#displacement-${num}`,
          { attr: { scale: 30 } },
          { attr: { scale: 0 }, duration: 0.25, ease: "power3.out" },
          startEnter
        );

        tl.fromTo(`#blur-${num}`,
          { attr: { stdDeviation: 8 } },
          { attr: { stdDeviation: 0 }, duration: 0.25, ease: "power3.out" },
          startEnter
        );

        // Exit Text
        tl.to(ref.current,
          { opacity: 0, scale: 1.05, y: -20, duration: 0.15, ease: "power2.in" },
          startExit
        );

        // Exit Distortion
        tl.fromTo(`#displacement-${num}`,
          { attr: { scale: 0 } },
          { attr: { scale: 20 }, duration: 0.15, ease: "power2.in" },
          startExit
        );

        tl.fromTo(`#blur-${num}`,
          { attr: { stdDeviation: 0 } },
          { attr: { stdDeviation: 4 }, duration: 0.15, ease: "power2.in" },
          startExit
        );
      };

      applyLiquidReveal(text1Ref, 1, 0.1, 0.25);
      applyLiquidReveal(text2Ref, 2, 0.4, 0.55);
      applyLiquidReveal(text3Ref, 3, 0.7, 0.85);
    }
  }, { scope: containerRef, dependencies: [ready] });

  const isMobile = isMobileRef.current;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[400vh] bg-background mt-16 sm:mt-24 md:mt-32 lg:mt-48"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Canvas with Seamless Background Blend */}
        <div
          className="absolute inset-0 w-full h-full z-0 flex justify-center items-center pointer-events-none transform scale-[1.8] sm:scale-[1.4] md:scale-[0.85]"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.7) 14%, black 20%, black 100%), radial-gradient(ellipse 58% 85% at 50% 50%, black 25%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 68%, transparent 80%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.7) 14%, black 20%, black 100%), radial-gradient(ellipse 58% 85% at 50% 50%, black 25%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 68%, transparent 80%)",
            WebkitMaskComposite: "destination-in",
            maskComposite: "intersect",
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>

        {/* SVG Filters for Liquid Reveal — only rendered on desktop */}
        <svg className="hidden">
          <defs>
            {[1, 2, 3].map((num) => (
              <filter key={num} id={`liquid-reveal-${num}`} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.025"
                  numOctaves="3"
                  result="noise"
                />
                <feDisplacementMap
                  id={`displacement-${num}`}
                  in="SourceGraphic"
                  in2="noise"
                  scale="0"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="displaced"
                />
                <feGaussianBlur
                  id={`blur-${num}`}
                  in="displaced"
                  stdDeviation="0"
                />
              </filter>
            ))}
          </defs>
        </svg>

        {/* Text Overlays - Liquid/Ink Reveal Strategy */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-16 flex flex-col justify-center h-full pointer-events-none text-foreground">

          <div
            ref={text1Ref}
            className="absolute inset-x-0 mx-auto bottom-1/4 max-w-4xl opacity-0 flex flex-col items-center text-center text-white will-change-transform [text-shadow:0_0_20px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.7),0_2px_4px_rgba(0,0,0,0.9)]"
          >

            <div className="flex items-center gap-4 mb-6 opacity-100">
              <div className="w-8 h-[1px] bg-[#D4CBB3]/60"></div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#D4CBB3] text-sm">01</span>
                <span className="font-sans font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[10px] sm:text-[11px] md:text-xs text-white">
                  Spatial Vision
                </span>
              </div>
              <div className="w-8 h-[1px] bg-[#D4CBB3]/60"></div>
            </div>
            <h2 className="font-drama italic font-light text-4xl sm:text-5xl md:text-6xl lg:text-[90px] leading-[0.9] tracking-tight mb-2">
              Intentionally
              <br />
              Placed.
            </h2>
          </div>

          <div
            ref={text2Ref}
            className="absolute inset-x-0 mx-auto top-1/3 max-w-4xl opacity-0 flex flex-col items-center text-center text-white will-change-transform [text-shadow:0_0_20px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.7),0_2px_4px_rgba(0,0,0,0.9)]"
          >

            <div className="flex items-center gap-4 mb-6 opacity-100">
              <div className="w-8 h-[1px] bg-[#D4CBB3]/60"></div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#D4CBB3] text-sm">02</span>
                <span className="font-sans font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[10px] sm:text-[11px] md:text-xs text-white">
                  Material Craft
                </span>
              </div>
              <div className="w-8 h-[1px] bg-[#D4CBB3]/60"></div>
            </div>
            <h2 className="font-drama italic font-light text-4xl sm:text-5xl md:text-6xl lg:text-[90px] leading-[0.9] tracking-tight mb-2">
              Revealed
              <br />
              Over Time.
            </h2>
          </div>

          <div
            ref={text3Ref}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-5xl opacity-0 flex flex-col items-center text-center text-white w-full will-change-transform [text-shadow:0_0_20px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.7),0_2px_4px_rgba(0,0,0,0.9)]"
          >

            <div className="flex items-center gap-4 mb-8 opacity-100">
              <div className="w-8 h-[1px] bg-[#D4CBB3]/60"></div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#D4CBB3] text-sm">03</span>
                <span className="font-sans font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[10px] sm:text-[11px] md:text-xs text-white">
                  Synthesis
                </span>
              </div>
              <div className="w-8 h-[1px] bg-[#D4CBB3]/60"></div>
            </div>
            <h2 className="font-drama italic font-light text-5xl sm:text-6xl md:text-7xl lg:text-[110px] leading-[0.9] tracking-tight mb-2">
              Complete
              <br />
              Harmony.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
