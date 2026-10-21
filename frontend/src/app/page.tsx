"use client";

import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "./home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ForMei } from "@/components/home/ForMei";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Features } from "@/components/home/Features";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-main text-slate-100 selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main>
        <HeroSection />

        <HowItWorks />
        <ForMei />
        <Features />
        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
