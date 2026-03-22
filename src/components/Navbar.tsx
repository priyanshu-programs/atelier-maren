"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate mobile menu open/close
  useEffect(() => {
    if (!mobileMenuRef.current || !overlayRef.current) return;

    if (isMobileMenuOpen) {
      // Prevent scroll when menu is open
      document.body.style.overflow = "hidden";

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        pointerEvents: "auto",
      });

      gsap.fromTo(
        mobileMenuRef.current,
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
      );

      // Stagger menu items
      gsap.fromTo(
        ".mobile-nav-item",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.2 }
      );
    } else {
      document.body.style.overflow = "";

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        pointerEvents: "none",
      });

      gsap.to(mobileMenuRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div id="nav-container" className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 w-full pointer-events-none opacity-0">
        <nav
          ref={navRef}
          className={`pointer-events-auto flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] w-full max-w-5xl ${isScrolled
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 text-foreground translate-y-0 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]"
            : "bg-transparent border border-transparent text-foreground -translate-y-2"
            }`}
        >
          <div id="nav-logo" className="text-lg sm:text-xl font-drama italic font-medium tracking-wide">
            Atelier Maren
          </div>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8 font-sans text-xs tracking-widest uppercase">
            {["Projects", "Studio", "Services", "Journal"].map((item) => (
              <li key={item}>
                <button className="relative group overflow-hidden pb-1">
                  <span className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-full block">
                    {item}
                  </span>
                  <span className="absolute top-0 left-0 z-10 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 block">
                    {item}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <ButtonWithIconDemo
              label="Book Consultation"
              className={`border-none ${isScrolled
                ? "bg-foreground text-background"
                : "bg-foreground text-background"
                }`}
            />
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[6px] rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <span
              className={`block w-5 h-[1.5px] bg-foreground transition-all duration-300 origin-center ${isMobileMenuOpen ? "rotate-45 translate-y-[3.75px]" : ""
                }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-foreground transition-all duration-300 origin-center ${isMobileMenuOpen ? "-rotate-45 -translate-y-[3.75px]" : ""
                }`}
            />
          </button>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm opacity-0 pointer-events-none md:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 left-0 right-0 z-45 bg-background/95 backdrop-blur-2xl md:hidden pt-24 pb-12 px-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]"
        style={{ transform: "translateY(-100%)", opacity: 0, zIndex: 45 }}
      >
        <ul className="flex flex-col gap-6 mb-10">
          {["Projects", "Studio", "Services", "Journal"].map((item) => (
            <li key={item} className="mobile-nav-item">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-3xl tracking-tight text-foreground hover:text-foreground/70 transition-colors"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
        <div className="mobile-nav-item">
          <ButtonWithIconDemo
            label="Book Consultation"
            className="bg-foreground text-background font-sans uppercase tracking-widest w-full justify-center"
          />
        </div>

      </div>
    </>
  );
}
