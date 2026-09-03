"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-main text-slate-100 flex flex-col items-center justify-center px-4 py-5 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-3/4 left-1/2 w-[280px] h-[280px] bg-violet-500/8 blur-[110px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-3 relative z-10 text-center"
      >
        <Link href="/" className="inline-flex items-center gap-1.5 group">
          <Image
            src="/logo_metrics_bg.png"
            alt="MetricsFlow AI"
            width={48}
            height={44}
            priority
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
          />

          <span className="font-heading font-bold text-white text-sm tracking-tight">
            MetricsFlow <span className="text-brand-500">AI</span>
          </span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          delay: 0.04,
        }}
        className="
          w-full
          max-w-xl
          bg-surface-sidebar/90
          border border-surface-border/80
          rounded-2xl
          shadow-2xl
          px-5 py-6
          md:px-7 md:py-7
          relative z-10
          backdrop-blur-xl
        "
      >
        {children}
      </motion.div>
    </div>
  );
}
