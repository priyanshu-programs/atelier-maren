"use client";

import dynamic from "next/dynamic";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Lazy-load below-fold components to reduce initial JS bundle
const ExplodingVideo = dynamic(() => import("@/components/ExplodingVideo"), { ssr: false });
const Features = dynamic(() => import("@/components/Features"), { ssr: false });
const Philosophy = dynamic(() => import("@/components/Philosophy"), { ssr: false });
const Protocol = dynamic(() => import("@/components/Protocol"), { ssr: false });
const GetStarted = dynamic(() => import("@/components/GetStarted"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background w-full">
      <Preloader />
      <Navbar />
      <Hero />
      <ExplodingVideo />
      <Features />
      <Philosophy />
      <Protocol />
      <GetStarted />
      <Footer />
    </main>
  );
}
