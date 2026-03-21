"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";

gsap.registerPlugin(ScrollTrigger);

export default function GetStarted() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingWordsRef = useRef<HTMLSpanElement[]>([]);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Smooth subtle appear animation
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Ambient glow pulses in
      gsap.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 0.6,
          scale: 1,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          },
        }
      );

      // Heading words reveal one by one
      gsap.fromTo(
        headingWordsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 60%",
          },
        }
      );

      // Supporting text fades in
      gsap.fromTo(
        subTextRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 50%",
          },
        }
      );

      // CTA button slides up
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 50%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const headingText = "Begin the narrative of your space.";
  const words = headingText.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-background"
    >
      <div
        ref={cardRef}
        className="relative max-w-6xl mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.4)] text-white"
        style={{ opacity: 0 }}
      >
        {/* Ambient glow effect */}
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(212,203,179,0.15) 0%, rgba(212,203,179,0.05) 40%, transparent 70%)",
            opacity: 0,
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-12 md:px-20 py-20 sm:py-28 md:py-36">
          <h2
            className="font-display font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.1] mb-8 sm:mb-10"
          >
            {words.map((word, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) headingWordsRef.current[i] = el;
                }}
                className="inline-block mr-[0.25em]"
                style={{ opacity: 0 }}
              >
                {/* Make certain words use accent color for contrast */}
                {word === "narrative" || word === "space." ? (
                  <span className="text-accent font-normal">
                    {word}
                  </span>
                ) : (
                  word
                )}
              </span>
            ))}
          </h2>

          {/* Supporting text */}
          <p
            ref={subTextRef}
            className="font-sans text-sm sm:text-base text-white/40 max-w-md mx-auto mb-10 sm:mb-14 leading-relaxed"
            style={{ opacity: 0 }}
          >
            Consultations are strictly limited per quarter to ensure
            uncompromising dedication to each project.
          </p>

          {/* CTA */}
          <div ref={ctaRef} style={{ opacity: 0 }}>
            <ButtonWithIconDemo
              label="Apply for a Consultation"
              className="bg-background text-foreground hover:bg-background hover:text-foreground font-sans uppercase tracking-widest border border-white/10"
              iconClassName="bg-foreground text-background group-hover:bg-foreground group-hover:text-background"
            />
          </div>
        </div>


      </div>
    </section>
  );
}
