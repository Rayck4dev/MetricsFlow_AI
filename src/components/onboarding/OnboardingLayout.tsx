"use client";

import Image from "next/image";
import Link from "next/link";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-main text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="mb-6 relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/logo_metrics_bg.png"
            alt="MetricsFlow AI"
            width={58}
            height={53}
            priority
            className="
                h-[50px]
                w-[50px]
                object-contain
                transition-transform
                duration-300
                group-hover:scale-105
              "
          />
          <span className="font-heading font-bold text-white text-base tracking-tight">
            MetricsFlow <span className="text-brand-500">AI</span>
          </span>
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-surface-sidebar/90 border border-surface-border/80 rounded-3xl shadow-2xl p-6 md:p-10 relative z-10 backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}
