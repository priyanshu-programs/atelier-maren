"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Background Parallax
    gsap.to(bgRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // SplitText style reveal (using basic lines simulation since SplitText is a premium plugin)
    const lines = gsap.utils.toArray<HTMLElement>(".reveal-line");

    gsap.from(lines, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: textContainerRef.current,
        start: "top 80%",
      },
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[60dvh] sm:min-h-[70dvh] md:min-h-[80dvh] flex items-center justify-center py-20 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden bg-[#1A1A1A] text-white"
    >
      {/* Background Parallax Texture */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] opacity-20 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1595846519845-68e298c2cebc?q=80&w=2000&auto=format&fit=crop')",
        }}
      />

      {/* Heavy gradient to blend edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-transparent to-[#1A1A1A]" />

      <div ref={textContainerRef} className="relative z-10 max-w-4xl w-full text-center">
        <div className="overflow-hidden mb-6">
          <p className="reveal-line font-sans text-xs sm:text-sm md:text-base tracking-widest uppercase text-white/50">
            Most studios focus on: assembling furniture.
          </p>
        </div>

        <div className="flex flex-col items-center leading-[1.1] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl">
          <div className="overflow-hidden pb-4">
            <h2 className="reveal-line font-display font-medium tracking-tight">
              We focus on:
            </h2>
          </div>
          <div className="overflow-hidden pb-4">
            <h2 className="reveal-line font-drama italic text-accent font-light">
              editing space to
            </h2>
          </div>
          <div className="overflow-hidden pb-4">
            <h2 className="reveal-line font-drama italic font-light">
              reveal your life.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
