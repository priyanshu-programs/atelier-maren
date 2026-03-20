"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Lock scroll (Stage 1 starts)
    document.body.style.overflow = "hidden";
    
    // Ensure letters are invisible before animation (prevents flash)
    gsap.set(".preloader-letter", { opacity: 0 });
    
    // Ensure navbar is hidden initially (Preloader will reveal it)
    const navbar = document.getElementById("nav-container");
    const navLogo = document.getElementById("nav-logo");
    if (navbar) {
      gsap.set(navbar, { opacity: 0 });
    }
    // Hide the navbar logo text so preloader logo can land on top seamlessly
    if (navLogo) {
      gsap.set(navLogo, { opacity: 0 });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Unlock scroll when animation finishes completely
        document.body.style.overflow = "";
        
        // Remove preloader from DOM visually
        gsap.set(containerRef.current, {
          display: "none"
        });
      }
    });

    // Stage 1 is completely static. The timeline starts the logo animation with a 0.8s delay.
    
    // Stage 2 — LOGO REVEAL 
    tl.fromTo(
      ".preloader-letter",
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out", // Almost identical to cubic-bezier(0.22, 1, 0.36, 1) Standard easeOutCubic
        delay: 0.4
      }
    );

    // Hold for ~0.4s
    tl.to({}, { duration: 0.4 });

    // Stage 3 — REVEAL SITE & MOVE LOGO
    tl.add("reveal");

    // Mask expanding logic to reveal site behind
    tl.to(".preloader-bg", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, -10% -10%, -10% 110%, 110% 110%, 110% -10%, -10% -10%, 0% 0%)",
      duration: 2.2,
      ease: "power4.inOut"
    }, "reveal");

    // Find Navbar Target destination
    let destX = 0;
    let destY = -150;
    let destScale = 0.5;

    const logoEl = document.querySelector(".preloader-logo");
    
    if (navLogo && logoEl) {
      const navRect = navLogo.getBoundingClientRect();
      const logoRect = logoEl.getBoundingClientRect();
      
      // Use actual computed font-size ratio for pixel-perfect scaling
      const navFontSize = parseFloat(window.getComputedStyle(navLogo).fontSize);
      const loaderFontSize = parseFloat(window.getComputedStyle(logoEl).fontSize);
      destScale = navFontSize / loaderFontSize;
      
      // Position: center-to-center offset
      destX = (navRect.left + navRect.width / 2) - (logoRect.left + logoRect.width / 2);
      destY = (navRect.top + navRect.height / 2) - (logoRect.top + logoRect.height / 2);
    }

    tl.to(".preloader-logo", {
      x: destX,
      y: destY,
      scale: destScale,
      color: "#1A1A1A",
      duration: 2.2,
      ease: "power4.inOut"
    }, "reveal");

    // Crossfade: Hide preloader logo as it lands on the navbar
    tl.to(".preloader-logo", {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut"
    }, "reveal+=1.8");
    
    // Stage 6 — NAVBAR reveal (container fades in early, but logo stays hidden)
    if (navbar) {
      tl.to(navbar, { opacity: 1, duration: 0.8, ease: "power2.out" }, "reveal+=1.4");
    }
    // Reveal navbar logo text exactly as preloader logo fades — seamless handoff
    if (navLogo) {
      tl.to(navLogo, { opacity: 1, duration: 0.3, ease: "power2.out" }, "reveal+=1.9");
    }

    return () => {
      // Cleanup on unmount handled by useGSAP inherently for context, 
      // but manually clear global side-effects here
      document.body.style.overflow = "";
    };
  }, { scope: containerRef }); // GSAP scope simplifies querying!

  const logoText = "Atelier Maren";
  const letters = logoText.split("").map((char, index) => {
    if (char === " ") {
      return (
        <span 
          key={index} 
          className="preloader-letter inline-block w-2 sm:w-3 opacity-0"
        />
      );
    }
    
    // Custom circular glyph detail inside a letter - specifically the 'R' in MAREN (index 10)
    if (index === 10) {
      return (
         <span key={index} className="preloader-letter inline-block relative opacity-0">
            {char}
            {/* The signature circular glyph inside the R */}
            <span className="absolute top-[0.25em] left-[0.28em] w-1 h-1 bg-accent rounded-full" />
         </span>
      );
    }

    return (
      <span key={index} className="preloader-letter inline-block relative opacity-0">
        {char}
      </span>
    );
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] w-full h-[100dvh] pointer-events-none flex flex-col items-center justify-center"
    >
      <div 
        className="preloader-bg absolute inset-0 bg-primary pointer-events-auto"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 0% 0%)" }}
      ></div>

      {/* Centered Logo */}
      <div 
        className="preloader-logo relative z-20 flex items-center justify-center font-drama italic font-light tracking-wide text-background text-2xl sm:text-3xl md:text-4xl px-4 whitespace-nowrap"
      >
        {letters}
      </div>
    </div>
  );
}
