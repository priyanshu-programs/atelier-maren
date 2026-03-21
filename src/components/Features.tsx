"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MousePointer2, Package, Hammer, CheckCircle } from "lucide-react";

// Card 1: The Swatch Fan
const SwatchCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let isHovered = false;

    const ctx = gsap.context(() => {
      const spread = () => {
        gsap.to(".swatch-bottom", { rotateZ: -12, x: -48, y: 16, duration: 0.8, ease: "power3.inOut", overwrite: "auto" });
        gsap.to(".swatch-middle", { rotateZ: -6, x: -24, y: 8, duration: 0.8, ease: "power3.inOut", overwrite: "auto" });
        gsap.to(".swatch-top", { rotateZ: 6, x: 32, y: -8, duration: 0.8, ease: "power3.inOut", overwrite: "auto" });
      };

      const close = () => {
        gsap.to(".swatch-bottom", { rotateZ: 0, x: 0, y: 0, duration: 0.8, ease: "power3.inOut", overwrite: "auto" });
        gsap.to(".swatch-middle", { rotateZ: 0, x: 0, y: 0, duration: 0.8, ease: "power3.inOut", overwrite: "auto" });
        gsap.to(".swatch-top", { rotateZ: 0, x: 0, y: 0, duration: 0.8, ease: "power3.inOut", overwrite: "auto" });
      };

      const runLoop = async () => {
        if (isHovered) return;

        spread();
        await new Promise(r => { timeout = setTimeout(r, 800 + 1500); });
        if (isHovered) return;

        close();
        await new Promise(r => { timeout = setTimeout(r, 800 + 1500); });
        if (isHovered) return;

        runLoop();
      };

      // Start infinite loop initially
      runLoop();

      const onEnter = () => {
        isHovered = true;
        clearTimeout(timeout);
        spread();
      };

      const onLeave = () => {
        isHovered = false;
        clearTimeout(timeout);
        close();

        // Wait for close animation and pause to finish, then restart loop
        timeout = setTimeout(() => {
          runLoop();
        }, 800 + 1500);
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener("mouseenter", onEnter);
        container.addEventListener("mouseleave", onLeave);
        return () => {
          container.removeEventListener("mouseenter", onEnter);
          container.removeEventListener("mouseleave", onLeave);
        };
      }
    }, containerRef);

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[250px] w-full flex items-center justify-center -mt-6">
      <div className="relative w-36 h-48">
        {/* Bottom Swatch */}
        <div
          className="swatch-bottom absolute top-0 left-0 w-full h-full bg-cover bg-center rounded-xl shadow-sm flex items-end p-4 overflow-hidden transform-gpu"
          style={{ backgroundImage: "url('/travertine.jpeg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#E8E4DD]/90 to-transparent" />
          <div className="w-full relative z-10">
            <div className="text-[10px] font-mono text-[#1A1A1A]/70 uppercase tracking-widest mb-1">Stone 02</div>
            <div className="text-sm font-display text-[#1A1A1A] pb-2 border-b border-[#1A1A1A]/20">Travertine</div>
          </div>
        </div>
        {/* Middle Swatch */}
        <div
          className="swatch-middle absolute top-0 left-0 w-full h-full bg-cover bg-center rounded-xl shadow-md z-10 flex items-end p-4 overflow-hidden transform-gpu"
          style={{ backgroundImage: "url('/bleached_oak.jpeg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#D4CBB3]/80 to-transparent" />
          <div className="w-full relative z-10">
            <div className="text-[10px] font-mono text-[#1A1A1A]/70 uppercase tracking-widest mb-1">Wood 01</div>
            <div className="text-sm font-display text-[#1A1A1A] pb-2 border-b border-[#1A1A1A]/20">Bleached Oak</div>
          </div>
        </div>
        {/* Top Swatch */}
        <div
          className="swatch-top absolute top-0 left-0 w-full h-full bg-cover bg-center rounded-xl shadow-xl flex items-end p-4 overflow-hidden z-20 transform-gpu"
          style={{ backgroundImage: "url('/heavy_boucle.jpeg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 to-transparent" />
          <div className="w-full relative z-10">
            <div className="text-[10px] font-mono text-white/70 uppercase tracking-widest mb-1">Textile 01</div>
            <div className="text-sm font-display text-white pb-2 border-b border-white/20">Heavy Bouclé</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Card 2: The Blueprint Draft
const BlueprintCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });

      // Reset
      tl.set(".draft-outer-shape", { strokeDasharray: 632, strokeDashoffset: -632, opacity: 1 });
      tl.set(".draft-room-shape", { strokeDasharray: 312, strokeDashoffset: 312, opacity: 1 });
      tl.set(".draft-line-h", { width: "0%", opacity: 0 });
      tl.set(".draft-line-v", { height: "0%", opacity: 0 });
      tl.set(".draft-measure", { opacity: 0, y: 5 });

      // Animate lines
      tl.to(".draft-outer-shape", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".draft-room-shape", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".draft-line-h", { width: "100%", opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".draft-line-v", { height: "100%", opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0.2)
        // Drop in measurements
        .to(".draft-measure", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.2 }, 0)
        // Fade out slightly faster and hold for less time before fading out
        .to(".draft-outer-shape, .draft-room-shape, .draft-line-h, .draft-line-v, .draft-measure", { opacity: 0, duration: 0.8, ease: "power2.inOut", delay: 1.2 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-full relative min-h-[200px]">
      <div className="relative w-40 h-40 shadow-sm flex items-center justify-center transition-colors duration-700 bg-background/50 backdrop-blur-sm">
        {/* Outer room shape */}
        <svg className="absolute inset-0 w-full h-full z-0 text-foreground/40 pointer-events-none" viewBox="0 0 160 160">
          <rect
            className="draft-outer-shape"
            x="1" y="1" width="158" height="158"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        {/* Inner room shape */}
        <svg className="w-20 h-20 z-10 text-foreground/40" viewBox="0 0 80 80">
          <rect
            className="draft-room-shape"
            x="1" y="1" width="78" height="78"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        {/* Clean Animated measure lines */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] flex justify-center items-center">
          <div className="draft-line-h w-full flex items-center justify-between overflow-hidden">
            <div className="w-[2px] h-2.5 bg-foreground shrink-0" />
            <div className="flex-1 h-[2px] bg-foreground mx-[1px]" />
            <div className="w-[2px] h-2.5 bg-foreground shrink-0" />
          </div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-6 h-[calc(100%-4rem)] flex flex-col justify-center items-center">
          <div className="draft-line-v h-full flex flex-col items-center justify-between overflow-hidden">
            <div className="h-[2px] w-2.5 bg-foreground shrink-0" />
            <div className="flex-1 w-[2px] bg-foreground my-[1px]" />
            <div className="h-[2px] w-2.5 bg-foreground shrink-0" />
          </div>
        </div>

        {/* Measurements */}
        <span className="draft-measure absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-mono font-medium text-foreground/80 tracking-wider">4200mm</span>
        <span className="draft-measure absolute top-1/2 -right-16 -translate-y-1/2 text-[10px] sm:text-xs font-mono font-medium text-foreground/80 tracking-wider rotate-90 origin-center">3600mm</span>
      </div>
    </div>
  );
};

// Card 3: The Seamless Thread
const TimelineCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.set(".progress-line", { scaleX: 0 });
      tl.set(".node", { backgroundColor: "transparent", scale: 1 });
      tl.set(".icon-tl", { opacity: 0.6, scale: 1 });

      tl.to(".progress-line", { scaleX: 1, duration: 4, ease: "power1.inOut", transformOrigin: "left" }, 0)
        .to(".node-1", { backgroundColor: "#2E4036", borderColor: "#2E4036", scale: 1.3, duration: 0.3, ease: "back.out(2)" }, 0)
        .to(".icon-1", { opacity: 1, scale: 1.15, color: "#2E4036", duration: 0.3, ease: "back.out(2)" }, 0)
        .to(".node-1", { scale: 1, duration: 0.2 }, 0.4)
        .to(".icon-1", { scale: 1, duration: 0.2 }, 0.4)
        .to(".node-2", { backgroundColor: "#CC5833", borderColor: "#CC5833", scale: 1.3, duration: 0.3, ease: "back.out(2)" }, 2)
        .to(".icon-2", { opacity: 1, scale: 1.15, color: "#CC5833", duration: 0.3, ease: "back.out(2)" }, 2)
        .to(".node-2", { scale: 1, duration: 0.2 }, 2.4)
        .to(".icon-2", { scale: 1, duration: 0.2 }, 2.4)
        .to(".node-3", { backgroundColor: "#1A1A1A", borderColor: "#1A1A1A", scale: 1.3, duration: 0.3, ease: "back.out(2)" }, 4)
        .to(".icon-3", { opacity: 1, scale: 1.15, color: "#1A1A1A", duration: 0.3, ease: "back.out(2)" }, 4)
        .to(".node-3", { scale: 1, duration: 0.2 }, 4.4)
        .to(".icon-3", { scale: 1, duration: 0.2 }, 4.4);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-[200px] justify-center relative w-full px-4 sm:px-8">
      {/* Base line */}
      <div className="relative w-full h-[2px] bg-foreground/20 my-8">
        {/* Animated progress line */}
        <div className="progress-line absolute top-0 left-0 h-full w-full bg-foreground origin-left" />

        {/* Icons */}
        <Package className="icon-tl icon-1 absolute bottom-5 left-0 -translate-x-1/2 w-8 h-8 text-foreground origin-bottom" strokeWidth={1.5} />
        <Hammer className="icon-tl icon-2 absolute bottom-5 left-1/2 -translate-x-1/2 w-8 h-8 text-foreground origin-bottom" strokeWidth={1.5} />
        <CheckCircle className="icon-tl icon-3 absolute bottom-5 left-full -translate-x-1/2 w-8 h-8 text-foreground origin-bottom" strokeWidth={1.5} />

        {/* Nodes */}
        <div className="node node-1 absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-foreground/30 transition-colors shadow-sm" />
        <div className="node node-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-foreground/30 transition-colors shadow-sm" />
        <div className="node node-3 absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-foreground/30 transition-colors shadow-sm" />
      </div>

      {/* Labels */}
      <div className="relative w-full text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-widest text-foreground/60 mt-4">
        <span className="absolute left-0 -translate-x-1/2 text-center whitespace-nowrap">Source</span>
        <span className="absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap">Build</span>
        <span className="absolute left-full -translate-x-1/2 text-center whitespace-nowrap font-bold text-foreground">Install</span>
      </div>
    </div>
  );
};

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Desktop: Pinned Parallax Drift
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", // Pin when the section reaches the top of the viewport
          end: "+=75%", // Scroll distance for the animation
          pin: true,
          scrub: 1, // Smooth dragging effect
        }
      });

      // Start state: cards are hidden below the section
      gsap.set(".feature-card", { y: "150vh", opacity: 0.1 });

      // End state: they float up with stagger
      tl.to(".feature-card", {
        y: 0,
        opacity: 1,
        stagger: 0.2, // Gives the beautiful overlap parallax feel
        ease: "power2.out", 
        duration: 2 // Relatively speaking for the scrub scrub time
      });
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile: standard staggered fade-up (since big pinned sections can feel clunky on small touch screens)
      gsap.from(".feature-card", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });
    });

    return () => {
      mm.revert(); // Ensure cleanly reverting matchMedia
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-background relative overflow-hidden">
      <div className="min-h-screen py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col justify-center">
        <div className="mb-20">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground max-w-xl">
          A disciplined approach to <span className="italic font-drama">Considered Living</span>.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="feature-card bg-white border border-foreground/5 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] min-h-[380px] md:min-h-[450px]">
          <div>
            <h3 className="font-display font-medium text-xl mb-2 text-[#1A1A1A]">Curated Sourcing</h3>
            <p className="font-sans text-sm text-[#1A1A1A]/70">
              Accessing exclusive artisans and rare materials that can&apos;t be found in any catalog.
            </p>
          </div>
          <SwatchCard />
        </div>

        {/* Card 2 */}
        <div className="feature-card bg-white border border-foreground/5 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] min-h-[350px] md:min-h-[400px] overflow-hidden">
          <div>
            <h3 className="font-display font-medium text-xl mb-2 text-[#1A1A1A]">Refined Precision</h3>
            <p className="font-sans text-sm text-[#1A1A1A]/70 mb-8">
              Every element earns its place. Nothing extra. Nothing missing.
            </p>
          </div>
          <BlueprintCard />
        </div>

        {/* Card 3 */}
        <div className="feature-card bg-white border border-foreground/5 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] min-h-[350px] md:min-h-[400px]">
          <div>
            <h3 className="font-display font-medium text-xl mb-2 text-[#1A1A1A]">Seamless Execution</h3>
            <p className="font-sans text-sm text-[#1A1A1A]/70 mb-8">
              From initial concept to flawless installation — managed to the hour.
            </p>
          </div>
          <TimelineCard />
        </div>
      </div>
      </div>
    </section>
  );
}
