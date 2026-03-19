"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    title: "Listening",
    desc: "Understanding how you live, breathe, and move within your home.",
    animation: "rotating",
  },
  {
    title: "Intentionality",
    desc: "Curating every material and photon of light to serve a specific purpose.",
    animation: "scanning",
  },
  {
    title: "Realization",
    desc: "Bringing the vision to life with uncompromising precision and care.",
    animation: "pulsing",
  },
];

export default function Protocol() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".protocol-card");

    cards.forEach((card, index) => {
      if (index === cards.length - 1) return; // Don't animate the last card out

      gsap.to(card, {
        scale: 0.9,
        opacity: 0.5,
        filter: "blur(20px)",
        scrollTrigger: {
          trigger: cards[index + 1],
          start: "top center",
          end: "top top",
          scrub: true,
        },
      });
    });
  }, { scope: containerRef, dependencies: [] });

  return (
    <section ref={containerRef} className="relative w-full bg-background pb-32">
      <div className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl mb-4">The Protocol</h2>
        <p className="font-sans text-foreground/60 max-w-md">
          A methodical, uncompromising approach to crafting personal sanctuaries.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="protocol-card sticky top-20 sm:top-24 w-full min-h-[auto] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] bg-white border border-foreground/5 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 lg:p-16 flex flex-col md:flex-row justify-between items-start md:items-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] origin-top mb-8 sm:mb-12 md:mb-16"
          >
            <div className="max-w-md z-10 w-full mb-6 sm:mb-8 md:mb-0">
              <div className="font-mono text-xs sm:text-sm tracking-widest text-foreground/40 mb-3 sm:mb-4 md:mb-6">
                STEP_0{i + 1}
              </div>
              <h3 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 md:mb-6">
                {step.title}
              </h3>
              <p className="font-sans text-base sm:text-lg text-foreground/70 leading-relaxed">
                {step.desc}
              </p>
            </div>

            {/* Animation Canvas Wrapper */}
            <div className="w-full md:w-1/2 flex justify-center items-center aspect-square md:aspect-auto md:h-full relative overflow-hidden rounded-2xl bg-background/50 border border-foreground/5 p-8">
              {step.animation === "rotating" && (
                <div className="relative w-48 h-48 animate-spin-slow">
                  <div className="absolute inset-0 border border-current rounded-full opacity-20" />
                  <div className="absolute inset-4 border border-current rounded-full border-dashed opacity-40 animate-spin-slow-reverse" />
                  <div className="absolute inset-12 border border-current rounded-full opacity-60" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-current opacity-20" />
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-current opacity-20" />
                </div>
              )}
              {step.animation === "scanning" && (
                <div className="relative w-full max-w-[200px] h-48 grid grid-cols-4 grid-rows-4 gap-2">
                  {Array.from({ length: 16 }).map((_, j) => (
                    <div key={j} className="bg-foreground/5 rounded-sm" />
                  ))}
                  <div className="absolute left-0 right-0 h-1 bg-accent blur-[2px] animate-scan-y shadow-[0_0_15px_rgba(212,203,179,0.8)]" />
                </div>
              )}
              {step.animation === "pulsing" && (
                <div className="relative w-full max-w-[240px] h-32 flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible stroke-foreground/40 stroke-[2] fill-none" preserveAspectRatio="none">
                    <path
                      d="M0 64 L40 64 L60 20 L80 108 L100 64 L140 64"
                      className="animate-ekg-pulse drop-shadow-[0_0_8px_rgba(26,26,26,0.2)]"
                      style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                    />
                    <path
                      d="M140 64 L180 64 L200 20 L220 108 L240 64 L280 64"
                      className="animate-ekg-pulse drop-shadow-[0_0_8px_rgba(26,26,26,0.2)]"
                      style={{ strokeDasharray: 200, strokeDashoffset: 200, animationDelay: "1s" }}
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
