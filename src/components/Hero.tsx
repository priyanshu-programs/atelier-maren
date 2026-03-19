"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  const textTitleRef = useRef<HTMLDivElement>(null);
  const textDramaRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Breathing Video Entrance
    tl.fromTo(
      videoWrapperRef.current,
      { scale: 1.15, filter: "brightness(0.6)" },
      { scale: 1.05, filter: "brightness(1)", duration: 4, ease: "power2.out" },
      0
    );

    // 2. Text Stagger Reveal
    tl.fromTo(
      [textTitleRef.current, textDramaRef.current, pRef.current, ctaRef.current],
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, delay: 0.2 },
      0.5 // Start text stagger a bit after video starts breathing
    );

    // 3. Mouse Parallax (Magnetic effect)
    const xToVideo = gsap.quickTo(videoWrapperRef.current, "x", { duration: 0.8, ease: "power3" });
    const yToVideo = gsap.quickTo(videoWrapperRef.current, "y", { duration: 0.8, ease: "power3" });

    const xToText = gsap.quickTo(textContentRef.current, "x", { duration: 0.5, ease: "power2" });
    const yToText = gsap.quickTo(textContentRef.current, "y", { duration: 0.5, ease: "power2" });

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize mouse to -1 to 1
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      // Video moves slowly in opposite direction of mouse
      xToVideo(-x * 20);
      yToVideo(-y * 20);

      // Text moves slightly WITH mouse
      xToText(x * 12);
      yToText(y * 12);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center px-4 sm:px-6 md:px-16 overflow-hidden bg-background"
    >
      {/* Background Video & Canvas overlay */}
      <div
        ref={videoWrapperRef}
        className="absolute w-full h-full z-0 pointer-events-none origin-center"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)"
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/atelier-hero.mp4" type="video/mp4" />
        </video>
        {/* Subtle overlay for text legibility */}
        <div className="absolute inset-0 bg-white/30 z-20" />
      </div>

      {/* Floating Foreground Content aligned for parallax */}
      <div
        ref={textContentRef}
        className="relative z-10 max-w-4xl flex flex-col items-center text-center mt-8 sm:mt-12 md:mt-16 pointer-events-auto text-[#1a1a1a]"
      >
        <div className="mb-6 leading-[0.85] flex flex-col items-center pointer-events-none">
          <h1
            ref={textTitleRef}
            className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-6xl tracking-tight opacity-0"
          >
            Spaces shaped
          </h1>
          <div
            ref={textDramaRef}
            className="font-drama italic font-light text-[3rem] sm:text-5xl md:text-7xl lg:text-[140px] tracking-tight mt-1 sm:mt-2 opacity-0 text-[#2e4036]"
          >
            by light and intention.
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-12 mt-8 sm:mt-12 md:mt-16">
          <p
            ref={pRef}
            className="font-sans text-xs sm:text-sm md:text-base text-[#1a1a1a]/70 max-w-[40ch] sm:max-w-[45ch] leading-relaxed opacity-0 text-center pointer-events-none px-2"
          >
            We create residential interiors that balance refined materiality with
            daily life. Every project begins with listening.
          </p>

          <div ref={ctaRef} className="opacity-0">
            <ButtonWithIconDemo
              label="Explore Our Work"
              className="bg-primary text-white font-sans uppercase tracking-widest"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
