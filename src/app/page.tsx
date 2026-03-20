"use client";

import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ExplodingVideo from "@/components/ExplodingVideo";
import Features from "@/components/Features";
import Philosophy from "@/components/Philosophy";
import Protocol from "@/components/Protocol";
import GetStarted from "@/components/GetStarted";
import Footer from "@/components/Footer";

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
