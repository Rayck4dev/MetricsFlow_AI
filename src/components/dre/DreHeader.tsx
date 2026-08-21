"use client";

import { motion } from "framer-motion";
import { BarChart3, Download, Sparkles } from "lucide-react";

import { DrePeriodSelector } from "./DrePeriodSelector";

interface DreHeaderProps {
  period: string;
  onPeriodChange: (period: string) => void;
  onExport?: () => void;
}

export function DreHeader({
  period,
  onPeriodChange,
  onExport,
}: DreHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6 z-[70]"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-cpm-accent/5 blur-3xl" />

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10">
              <BarChart3 size={15} className="text-brand-400" />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-400">
              Análise financeira
            </span>

            <Sparkles size={12} className="text-brand-400/60" />
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            DRE
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
            Acompanhe receitas, custos, despesas e o resultado da sua empresa.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <DrePeriodSelector value={period} onChange={onPeriodChange} />

          <button
            type="button"
            onClick={onExport}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar px-4 text-[10px] font-bold text-slate-400 transition-all hover:border-brand-500/30 hover:bg-brand-500/5 hover:text-brand-300 active:scale-[0.98]"
          >
            <Download size={13} />
            Exportar
          </button>
        </div>
      </div>
    </motion.header>
  );
}
