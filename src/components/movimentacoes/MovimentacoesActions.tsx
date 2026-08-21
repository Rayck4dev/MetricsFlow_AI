"use client";

import { ArrowDownLeft, ArrowUpRight, Download } from "lucide-react";
import { motion } from "framer-motion";

interface MovimentacoesActionsProps {
  onAddIncome?: () => void;
  onAddExpense?: () => void;
}

export function MovimentacoesActions({
  onAddIncome,
  onAddExpense,
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

      <button
        type="button"
        className="hidden h-10 items-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar px-3 text-[9px] font-semibold text-slate-500 transition-colors hover:text-white sm:inline-flex"
      >
        <Download size={13} />
        Exportar
      </button>
    </div>
  );
}
