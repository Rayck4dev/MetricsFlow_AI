"use client";

import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import type { TransactionType } from "@/constants/transaction.constants";

interface TransactionTypeSelectorProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

export function TransactionTypeSelector({
  value,
  onChange,
}: TransactionTypeSelectorProps) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-surface-border bg-surface-panel p-1">
      <button
        type="button"
        onClick={() => onChange("income")}
        className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
          value === "income"
            ? "text-emerald-400"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        {value === "income" && (
          <motion.div
            layoutId="activeTransactionType"
            className="absolute inset-0 rounded-lg border border-emerald-500/20 bg-emerald-500/10"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
        )}

        <ArrowUpCircle size={16} className="relative z-10" />

        <span className="relative z-10">Nova Receita</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("expense")}
        className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
          value === "expense"
            ? "text-rose-400"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        {value === "expense" && (
          <motion.div
            layoutId="activeTransactionType"
            className="absolute inset-0 rounded-lg border border-rose-500/20 bg-rose-500/10"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
        )}

        <ArrowDownCircle size={16} className="relative z-10" />

        <span className="relative z-10">Nova Despesa</span>
      </button>
    </div>
  );
}
