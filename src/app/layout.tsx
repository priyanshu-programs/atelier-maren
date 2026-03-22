import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import DeferredCursor from "@/components/ui/DeferredCursor";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atelier Maren — Luxury Residential Interior Design Studio",
  description: "Atelier Maren creates refined residential interiors that balance materiality with daily life. Every project begins with listening. Book a consultation.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${jakarta.variable} ${outfit.variable} ${cormorant.variable} ${plexMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <SmoothScroll>
          {/* Global CSS Noise Overlay */}
          <div className="noise-overlay">
            <svg style={{ display: 'none' }}>
              <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              </filter>
            </svg>
            <div style={{ width: '100%', height: '100%', filter: 'url(#noiseFilter)' }}></div>
          </div>
          <DeferredCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
