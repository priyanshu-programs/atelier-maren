"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  const textTitleRef = useRef<HTMLDivElement>(null);
  const textDramaRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useGSAP(() => {
    // Immediately hide text elements (GSAP controls visibility, not HTML)
    gsap.set([textTitleRef.current, textDramaRef.current, pRef.current, ctaRef.current], { opacity: 0 });

    // Delay Hero timeline by 2.6s to sync start with the Preloader's box reveal
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 2.6 });

    // 1. Breathing Video Entrance zooms out slowly along with the box reveal
    tl.fromTo(
      videoWrapperRef.current,
      { scale: 1.15, filter: "brightness(0.6)" },
      { scale: 1.05, filter: "brightness(1)", duration: 2.2, ease: "power4.inOut" },
      0
    );

    // 2. Text Stagger Reveal triggers exactly after the whole preloader is done (at 2.2s)
    tl.fromTo(
      [textTitleRef.current, textDramaRef.current, pRef.current, ctaRef.current],
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
      2.2
    );

    // 3. Scroll Parallax
    gsap.to(videoWrapperRef.current, {
      y: "15%",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(textContentRef.current, {
      y: "-20%",
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: containerRef });

  const maskStyle = isMobile
    ? "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)"
    : "radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)";

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center px-4 sm:px-6 md:px-16 overflow-hidden bg-background"
    >
      {/* Background Video & Canvas overlay */}
      <div
        ref={videoWrapperRef}
        className="absolute w-full h-[120%] -top-[10%] z-0 pointer-events-none origin-center"
        style={{
          WebkitMaskImage: maskStyle,
          maskImage: maskStyle
        }}
      >
        {/* Conditionally render video only on desktop — prevents 3.98 MB download on mobile.
            CSS `hidden sm:block` alone doesn't stop browsers from fetching autoPlay videos. */}
        {!isMobile && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/atelier-hero.mp4" type="video/mp4" />
          </video>
        )}
        <Image
          src="/mobile_hero.png"
          alt="Atelier Maren Hero"
          fill
          priority
          sizes="100vw"
          className={`absolute inset-0 w-full h-full object-cover ${isMobile ? 'block' : 'hidden'}`}
        />
        {/* Subtle overlay for text legibility - hidden on mobile for better image clarity */}
        <div className="absolute inset-0 bg-white/30 z-20 hidden sm:block" />
      </div>

      {/* Floating Foreground Content aligned for parallax */}
      <div
        ref={textContentRef}
        className="relative z-10 max-w-4xl flex flex-col items-center text-center mt-8 sm:mt-12 md:mt-16 pointer-events-auto text-[#1a1a1a]"
      >
        <div className="mb-6 leading-[0.85] flex flex-col items-center pointer-events-none">
          <h1
            ref={textTitleRef}
            className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-6xl tracking-tight"
          >
            Spaces shaped
          </h1>
          <div
            ref={textDramaRef}
            className="font-drama italic font-light text-[3rem] sm:text-5xl md:text-7xl lg:text-[140px] tracking-tight mt-1 sm:mt-2 text-[#2e4036]"
          >
            by light and intention.
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-12 mt-8 sm:mt-12 md:mt-16">
          <p
            ref={pRef}
            className="font-sans text-xs sm:text-sm md:text-base text-[#1a1a1a]/70 max-w-[40ch] sm:max-w-[45ch] leading-relaxed text-center pointer-events-none px-2"
          >
            We create residential interiors that balance refined materiality with
            daily life. Every project begins with listening.
          </p>

          <div ref={ctaRef}>
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
