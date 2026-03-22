# Atelier Maren — [Considered Living](https://atelier-maren.vercel.app)

> "Editing space to reveal your life."

Atelier Maren is a high-fidelity, cinematic digital experience built for an avant-garde architectural and interior design studio. It serves as a digital instrument where every scroll is intentional, every animation is weighted, and every pixel is polished.

## The Experience

The site is designed to feel like a high-end luxury editorial. It leverages advanced motion patterns and scroll-driven storytelling to guide visitors through The Protocol: a methodical, uncompromising approach to crafting personal sanctuaries.

### Key Visual Archetypes
- **Exploding Video:** A 240-frame sequence synchronized with scroll using HTML5 Canvas and GSAP. Features a "Liquid/Ink Reveal" SVG filter strategy for desktop visitors.
- **The Protocol:** A vertically pinned scrolling archive with atmospheric Ken Burns effects and luminance-based lighting transitions.
- **Micro-UIs:** Interactive "Artifacts" (Swatch Shuffler, Blueprint Drafter, and Execution Timeline) that demonstrate process rather than just describing it.
- **Cinematic Preloader:** A high-precision entry sequence ensuring assets are optimized for the initial "Grand Opening."

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (React 19)
- **Motion:** [GSAP 3](https://gsap.com/) (ScrollTrigger, MatchMedia, useGSAP)
- **Smooth Scroll:** [Lenis](https://lenls.darkroom.engineering/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Type:** Inter, Playfair Display, JetBrains Mono

## Development

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Architecture Note

The project follows a component-driven architecture with a heavy emphasis on performance and responsiveness:
- **Progressive Frame Loading:** Video frames are batched and progressively loaded on mobile to minimize initial bandwidth while maintaining visual fidelity.
- **GSAP Context Management:** All animations are scoped using `@gsap/react` hooks to ensure clean memory cycles and prevent leakages in the Next.js lifecycle.
- **SVG Filter Pipelining:** Advanced text reveals utilize turbulence and displacement map filters, with automatic fallbacks for mobile browsers.

---

Built with precision by [Priyanshu]
