"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Download } from "lucide-react";

interface MovimentacoesActionsProps {
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  onExport?: () => void;
}

export function MovimentacoesActions({
  onAddIncome,
  onAddExpense,
  onExport,
}: MovimentacoesActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onAddExpense}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-3.5 text-[9px] font-bold text-red-300 transition-colors hover:bg-red-500/[0.1]"
      >
        <ArrowDownLeft size={14} />

        <span className="hidden sm:inline">Despesa</span>
      </motion.button>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onAddIncome}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-3.5 text-[9px] font-bold text-slate-950 shadow-lg shadow-brand-500/10 hover:bg-brand-400"
      >
        <ArrowUpRight size={14} />

        <span className="hidden sm:inline">Receita</span>
      </motion.button>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onExport}
        disabled={!onExport}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar px-3.5 text-[9px] font-semibold text-slate-500 transition-colors hover:border-brand-500/20 hover:bg-brand-500/5 hover:text-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download size={13} />

        <span className="hidden sm:inline">Exportar CSV</span>
      </motion.button>
    </div>
  );
}
