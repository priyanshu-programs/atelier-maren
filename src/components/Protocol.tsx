"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Vignette focal points per step — shifts the lighting feel ── */
const vignetteFocals = [
  "35% 60%",   // Step 1: lower-left — warm, intimate
  "50% 45%",   // Step 2: center — balanced, intentional
  "65% 40%",   // Step 3: upper-right — elevated, resolved
];

const steps = [
  {
    title: "Listening",
    desc: "Understanding how you live, breathe, and move within your home. We don't begin with a mood board. We begin with a conversation.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=80",
  },
  {
    title: "Intentionality",
    desc: "Curating every material and photon of light to serve a specific purpose. Nothing decorative. Everything deliberate.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=80",
  },
  {
    title: "Realization",
    desc: "Bringing the vision to life with uncompromising precision and care. Every seam, every joint, every shadow — verified.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80",
  },
];



export default function Protocol() {
  const containerRef = useRef<HTMLDivElement>(null);
  const kenBurnsTweenRef = useRef<gsap.core.Tween | null>(null);

  /* ── Liquid Reveal helper — same pattern as ExplodingVideo ── */
  const applyLiquidReveal = useCallback(
    (
      el: HTMLElement | null,
      filterId: string,
      trigger: HTMLElement,
      displacementSel: string,
      blurSel: string,
    ) => {
      if (!el) return;

      // Apply the SVG filter to the element
      gsap.set(el, { filter: `url(#${filterId})` });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top 75%",
          end: "bottom 25%",
          scrub: 0.15,
        }
      });

      // ENTRANCE (duration 1)
      tl.fromTo(
        el,
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" },
        0
      )
        .fromTo(
          displacementSel,
          { attr: { scale: 35 } },
          { attr: { scale: 0 }, duration: 1, ease: "power3.out" },
          0
        )
        .fromTo(
          blurSel,
          { attr: { stdDeviation: 10 } },
          { attr: { stdDeviation: 0 }, duration: 1, ease: "power3.out" },
          0
        )
        // EXIT (duration 1.2 at time index 2.5 — leaving a hold in between)
        .to(
          el,
          { opacity: 0, scale: 1.05, y: -25, duration: 1.2, ease: "power2.in" },
          2.5
        )
        .fromTo(
          displacementSel,
          { attr: { scale: 0 } },
          { attr: { scale: 25 }, duration: 1.2, ease: "power2.in" },
          2.5
        )
        .fromTo(
          blurSel,
          { attr: { stdDeviation: 0 } },
          { attr: { stdDeviation: 6 }, duration: 1.2, ease: "power2.in" },
          2.5
        );
    },
    []
  );

  useGSAP(
    () => {
      const textBlocks = gsap.utils.toArray<HTMLElement>(".text-block");
      const bgImages = gsap.utils.toArray<HTMLElement>(".protocol-bg-img");

      const pulses = gsap.utils.toArray<HTMLElement>(".activation-pulse");
      const luminanceFlash = containerRef.current?.querySelector(
        ".luminance-flash"
      ) as HTMLElement | null;
      const vignetteEl = containerRef.current?.querySelector(
        ".step-vignette"
      ) as HTMLElement | null;

      // --- Initialize visual elements ---
      gsap.set(bgImages, { opacity: 0, scale: 1.08, filter: "blur(6px)" });
      gsap.set(bgImages[0], { opacity: 1, scale: 1.0, filter: "blur(0px)" });

      gsap.set(pulses, { opacity: 0, scale: 0.8 });
      if (luminanceFlash) gsap.set(luminanceFlash, { opacity: 0 });

      // --- Start Ken Burns drift on first image ---
      kenBurnsTweenRef.current = gsap.to(bgImages[0], {
        x: 10,
        y: -8,
        scale: 1.03,
        duration: 8,
        ease: "none",
        yoyo: true,
        repeat: -1,
      });

      // --- Set initial vignette focal ---
      if (vignetteEl) {
        vignetteEl.style.background = `radial-gradient(ellipse at ${vignetteFocals[0]}, transparent 30%, rgba(10,10,10,0.35) 100%)`;
      }

      // --- Section header entrance ---
      const sectionHeader =
        containerRef.current?.querySelector(".protocol-header");
      if (sectionHeader) {
        const headerElements = [
          sectionHeader.querySelector("h2"),
          sectionHeader.querySelector("p"),
        ];
        gsap.fromTo(
          headerElements,
          { opacity: 0, y: 50, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionHeader,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );
      }

      // --- Per-step animations ---
      textBlocks.forEach((block, index) => {

        // ── Cinematic image crossfade + Ken Burns + luminance pulse ──
        ScrollTrigger.create({
          trigger: block,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) {
              // Kill previous Ken Burns drift
              if (kenBurnsTweenRef.current) {
                kenBurnsTweenRef.current.kill();
              }

              // ── OUTGOING: blur + scale out + fade ──
              gsap.to(bgImages, {
                opacity: 0,
                scale: 1.05,
                filter: "blur(8px)",
                duration: 0.6,
                ease: "power2.inOut",
                overwrite: "auto",
              });

              // ── INCOMING: settle in from slight zoom, staggered ──
              gsap.fromTo(
                bgImages[index],
                { opacity: 0, scale: 1.08, filter: "blur(4px)", x: 0, y: 0 },
                {
                  opacity: 1,
                  scale: 1.0,
                  filter: "blur(0px)",
                  duration: 1.0,
                  delay: 0.15,
                  ease: "power2.out",
                  overwrite: "auto",
                }
              );

              // ── LUMINANCE PULSE: brief exposure flash ──
              if (luminanceFlash) {
                gsap.fromTo(
                  luminanceFlash,
                  { opacity: 0 },
                  {
                    opacity: 0.06,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                      gsap.to(luminanceFlash, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.out",
                      });
                    },
                  }
                );
              }

              // ── KEN BURNS DRIFT on new active image ──
              kenBurnsTweenRef.current = gsap.to(bgImages[index], {
                x: index % 2 === 0 ? 10 : -10,
                y: index % 2 === 0 ? -8 : 6,
                scale: 1.03,
                duration: 8,
                delay: 1.0,
                ease: "none",
                yoyo: true,
                repeat: -1,
              });

              // ── VIGNETTE FOCAL SHIFT ──
              if (vignetteEl) {
                gsap.to(vignetteEl, {
                  duration: 1.2,
                  ease: "power2.inOut",
                  onUpdate: function () {
                    const progress = this.progress();
                    if (progress > 0.5) {
                      vignetteEl.style.background = `radial-gradient(ellipse at ${vignetteFocals[index]}, transparent 30%, rgba(10,10,10,0.35) 100%)`;
                    }
                  },
                });
              }

              // ── Radial pulse activation (text side) ──
              gsap.fromTo(
                pulses[index],
                { opacity: 0.08, scale: 0.8 },
                {
                  opacity: 0,
                  scale: 1.2,
                  duration: 1.2,
                  ease: "power2.out",
                }
              );
            }
          },
        });


        // --- Liquid reveal on the entire content wrapper ---
        const contentWrapper = block.querySelector(".content-wrapper") as HTMLElement | null;
        applyLiquidReveal(
          contentWrapper,
          `protocol-liquid-${index}`,
          block,
          `#protocol-displacement-${index}`,
          `#protocol-blur-${index}`,
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-background flex flex-col md:flex-row"
    >
      {/* ============ Visual Side (Sticky) — Left on desktop ============ */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen sticky top-0 bg-background overflow-hidden z-0">
        {/* Per-step atmospheric background images */}
        {steps.map((step, i) => (
          <div
            key={`bg-${i}`}
            className="protocol-bg-img absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${step.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Luminance pulse flash — peaks during image transitions */}
        <div
          className="luminance-flash absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(212,203,179,0.8) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)",
          }}
        />

        {/* Per-step shifting vignette overlay */}
        <div className="step-vignette absolute inset-0 z-[1] pointer-events-none transition-none" />

        {/* Lighter gradient overlay — images stay visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/80 z-[2]" />

        {/* Soft radial texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-foreground)_0%,transparent_100%)] opacity-[0.03] pointer-events-none z-[3]" />

        {/* Section Title — pushed to bottom-left */}
        <div className="protocol-header relative z-10 flex flex-col justify-end h-full px-8 sm:px-12 xl:px-16 pb-12 md:pb-20">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-foreground">
            The Protocol
          </h2>
          <p className="font-sans text-lg sm:text-xl text-foreground/50 max-w-sm">
            A methodical, uncompromising approach to crafting personal
            sanctuaries.
          </p>
        </div>
      </div>

      {/* ── SVG Liquid Reveal Filters (same pattern as ExplodingVideo) ── */}
      <svg className="hidden">
        <defs>
          {steps.map((_, i) => (
            <filter
              key={i}
              id={`protocol-liquid-${i}`}
              colorInterpolationFilters="sRGB"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.025"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                id={`protocol-displacement-${i}`}
                in="SourceGraphic"
                in2="noise"
                scale={0}
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              <feGaussianBlur
                id={`protocol-blur-${i}`}
                in="displaced"
                stdDeviation={0}
              />
            </filter>
          ))}
        </defs>
      </svg>

      {/* ============ Text Side (Scrolling) with integrated stepper ============ */}
      <div className="text-side-container w-full md:w-1/2 z-10 bg-background relative overflow-visible">
        <div className="pb-32 md:pb-48">
          <div className="relative">

            {steps.map((step, i) => (
              <div
                key={`text-${i}`}
                className="text-block min-h-[60vh] md:min-h-screen flex items-center relative"
              >

                {/* Radial pulse behind text on activation */}
                <div
                  className="activation-pulse absolute inset-0 pointer-events-none z-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 50%, rgba(212,203,179,0.12) 0%, transparent 70%)",
                  }}
                />

                {/* Text content */}
                <div className="content-wrapper px-6 sm:px-12 xl:px-24 py-12 md:py-24 relative z-10 will-change-transform [text-shadow:0_0_16px_rgba(0,0,0,0.15)]">
                  <div className="step-label font-mono text-xs sm:text-sm tracking-widest text-foreground/60 mb-4 sm:mb-6">
                    STEP_0{i + 1}
                  </div>
                  <h3 className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 leading-tight text-foreground">
                    {step.title}
                  </h3>
                  {/* Accent reveal line */}
                  <div
                    className="accent-reveal-line h-[2px] w-16 sm:w-24 mb-5 sm:mb-7 origin-left"
                    style={{
                      background:
                        "linear-gradient(to right, #D4CBB3, transparent)",
                    }}
                  />
                  <p className="step-desc font-sans text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed max-w-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
