"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MousePointer2 } from "lucide-react";

// Card 1: Diagnostic Shuffler
const ShufflerCard = () => {
  const [cards, setCards] = useState([
    { id: 1, title: "Material Selection", desc: "Curated organic textures." },
    { id: 2, title: "Spatial Planning", desc: "Fluid movement and flow." },
    { id: 3, title: "Light Curation", desc: "Crafting shadows and warmth." },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prevItems) => {
        const newItems = [...prevItems];
        const last = newItems.pop();
        if (last) newItems.unshift(last);
        return newItems;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[250px] w-full flex items-center justify-center -mt-6">
      {cards.map((card, index) => {
        const isFront = index === 0;
        const transformY = index * 15;
        const scale = 1 - index * 0.05;
        const zIndex = 30 - index;
        const opacity = 1 - index * 0.2;

        return (
          <div
            key={card.id}
            className="absolute top-0 w-full bg-white border border-foreground/10 rounded-[2rem] p-6 shadow-sm transition-all duration-700"
            style={{
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: `translateY(${transformY}px) scale(${scale})`,
              zIndex,
              opacity,
            }}
          >
            <div className="text-xs font-mono text-foreground/50 mb-4">
              Step 0{card.id}
            </div>
            <h4 className="font-display font-medium text-xl mb-1 text-foreground">
              {card.title}
            </h4>
            <p className="font-sans text-sm text-foreground/70">{card.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

// Card 2: Telemetry Typewriter
const TypewriterCard = () => {
  const text = "Every element earns its place. Nothing extra. Nothing missing.";
  const [displayedText, setDisplayedText] = useState("");
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        // Reset after a pause
        setTimeout(() => {
          setDisplayedText("");
          i = 0;
        }, 3000);
      }
    }, 100);

    gsap.to(cursorRef.current, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.5,
      ease: "steps(1)",
    });

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="font-mono text-sm leading-relaxed text-foreground min-h-[120px]">
        {displayedText}
        <span ref={cursorRef} className="inline-block w-2 bg-accent ml-1 h-4 align-middle">
          &nbsp;
        </span>
      </div>
      <div className="flex items-center gap-2 mt-8">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">
          Live Studio Feed
        </span>
      </div>
    </div>
  );
};

// Card 3: Cursor Protocol Scheduler
const SchedulerCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const targetDayRef = useRef<HTMLDivElement>(null);
  const saveBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      // Reset
      tl.set(cursorRef.current, { x: -20, y: 120, opacity: 0 });
      tl.set(targetDayRef.current, { backgroundColor: "transparent", color: "#1A1A1A" });
      tl.set(saveBtnRef.current, { scale: 1 });

      // Enter
      tl.to(cursorRef.current, { x: 30, y: 40, opacity: 1, duration: 1, ease: "power2.out" })
        .to(cursorRef.current, { x: 90, y: 15, duration: 1, ease: "power2.inOut" })
        // Click Day
        .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
        .to(targetDayRef.current, { backgroundColor: "#D4CBB3", color: "#1A1A1A", duration: 0.1 }, "<")
        .to(cursorRef.current, { scale: 1, duration: 0.1 })
        // Move to Save
        .to(cursorRef.current, { x: 180, y: 80, duration: 1, ease: "power2.inOut", delay: 0.3 })
        // Click Save
        .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
        .to(saveBtnRef.current, { scale: 0.95, duration: 0.1 }, "<")
        .to(cursorRef.current, { scale: 1, duration: 0.1 })
        .to(saveBtnRef.current, { scale: 1, duration: 0.1 }, "<")
        // Exit
        .to(cursorRef.current, { x: 250, y: 120, opacity: 0, duration: 1, ease: "power2.in" });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[200px] border border-foreground/10 rounded-xl p-4 bg-background overflow-hidden flex flex-col justify-between">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            ref={i === 2 ? targetDayRef : null}
            className="aspect-square flex items-center justify-center text-xs font-mono rounded-md border border-foreground/5"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button ref={saveBtnRef} className="bg-foreground text-background font-sans text-[10px] uppercase tracking-widest px-4 py-2 rounded-full">
          Confirm
        </button>
      </div>

      {/* Animated Cursor */}
      <div ref={cursorRef} className="absolute top-0 left-0 w-6 h-6 z-10 pointer-events-none drop-shadow-md text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          <path d="m13 13 6 6" />
        </svg>
      </div>
    </div>
  );
};

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 w-full max-w-7xl mx-auto bg-background">
      <div className="mb-20">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground max-w-xl">
          A disciplined approach to elegant living.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="feature-card bg-white border border-foreground/5 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] min-h-[380px] md:min-h-[450px]">
          <div>
            <h3 className="font-display font-medium text-xl mb-2">Curated Sourcing</h3>
            <p className="font-sans text-sm text-foreground/60">
              Accessing exclusive artisans and rare materials.
            </p>
          </div>
          <ShufflerCard />
        </div>

        {/* Card 2 */}
        <div className="feature-card bg-white border border-foreground/5 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] min-h-[350px] md:min-h-[400px]">
          <div>
            <h3 className="font-display font-medium text-xl mb-2">Refined Precision</h3>
            <p className="font-sans text-sm text-foreground/60 mb-8">
              Every detail considered and perfected.
            </p>
          </div>
          <TypewriterCard />
        </div>

        {/* Card 3 */}
        <div className="feature-card bg-white border border-foreground/5 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] min-h-[350px] md:min-h-[400px]">
          <div>
            <h3 className="font-display font-medium text-xl mb-2">Seamless Execution</h3>
            <p className="font-sans text-sm text-foreground/60 mb-8">
              From initial concept to flawless installation.
            </p>
          </div>
          <SchedulerCard />
        </div>
      </div>
    </section>
  );
}
