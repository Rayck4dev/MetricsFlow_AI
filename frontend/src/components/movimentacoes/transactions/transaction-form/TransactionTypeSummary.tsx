"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function TransactionTypeSummary({ isIncome }: { isIncome: boolean }) {
  return (
    <div>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
        Tipo de movimentação
      </span>
      <div className={`relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 ${isIncome ? "border-emerald-500/20 bg-emerald-500/[0.06]" : "border-rose-500/20 bg-rose-500/[0.06]"}`}>
        <motion.div layoutId="transaction-type-icon" className={`flex h-9 w-9 items-center justify-center rounded-lg ${isIncome ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
          {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
        </motion.div>
        <div>
          <p className={`text-xs font-bold ${isIncome ? "text-emerald-300" : "text-rose-300"}`}>
            {isIncome ? "Nova receita" : "Nova despesa"}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            {isIncome ? "Registre uma entrada de dinheiro." : "Registre uma saÃ­da de dinheiro."}
          </p>
        </div>
      </div>
    </div>
  );
}
