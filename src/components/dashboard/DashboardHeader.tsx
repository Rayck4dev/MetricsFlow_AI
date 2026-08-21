"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Sparkles,
} from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  companyName?: string;
  demo?: boolean;
}

export function DashboardHeader({
  userName = "Carlos",
  companyName = "Carlos Design",
  demo = false,
}: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-3xl border border-surface-border bg-surface-panel p-5 shadow-2xl shadow-black/10 sm:p-6"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/[0.09] blur-3xl transition-all duration-700 group-hover:bg-brand-500/[0.14]" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-64 rounded-full bg-cpm-accent/[0.035] blur-3xl" />

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {demo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-cpm-accent/20 bg-cpm-accent/[0.08] px-3 py-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-400">
                Modo demonstração
              </span>

              <Sparkles size={11} className="text-brand-400" />
            </motion.div>
          )}

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Visão geral financeira
            </span>
          </div>

          <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Olá, {userName}{" "}
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 14, -8, 10, 0] }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="inline-block origin-bottom"
            >
              👋
            </motion.span>
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
            Acompanhe a saúde financeira da sua empresa em um só lugar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-sidebar/70 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/10 bg-brand-500/10">
              <Building2 size={18} className="text-brand-400" />
            </div>

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                Empresa
              </p>

              <p className="mt-0.5 text-xs font-bold text-slate-300">
                {companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-surface-border bg-surface-sidebar/70 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-xl">
            <CalendarDays size={15} className="text-slate-500" />

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                Período
              </p>

              <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                Agosto 2026
              </p>
            </div>
          </div>

          <button
            type="button"
            className="group hidden h-[62px] w-[62px] items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-500/20 sm:flex"
          >
            <ArrowUpRight
              size={18}
              className="text-brand-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </motion.header>
  );
}