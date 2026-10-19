"use client";

import Link from "next/link";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";

export function DesktopCta() {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link
        href="/login"
        className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white hover:shadow-lg hover:shadow-black/20"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] text-slate-400 transition-all duration-300 group-hover:bg-brand-500/10 group-hover:text-brand-400">
          <LogIn size={12} />
        </span>
        Já tenho uma conta
      </Link>

      <Link
        href="/demo"
        className="group flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-brand-500/30"
      >
        <Sparkles
          size={13}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
        Testar Plataforma
        <ArrowRight
          size={13}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}
