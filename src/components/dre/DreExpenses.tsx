"use client";

import { motion } from "framer-motion";
import { ReceiptText } from "lucide-react";

interface DreExpensesProps {
  total: number;
  items: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function DreExpenses({ total, items }: DreExpensesProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
            <ReceiptText size={16} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-xs font-bold text-white">
              Despesas operacionais
            </h2>

            <p className="mt-0.5 text-[8px] text-slate-600">
              Gastos necessários para manter a empresa funcionando
            </p>
          </div>
        </div>

        <p className="font-heading text-lg font-bold text-white">
          {formatCurrency(total)}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl border border-surface-border bg-surface-sidebar/70 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] font-medium text-slate-500">
                {item.label}
              </span>

              <span className="text-[9px] font-bold text-slate-300">
                {formatCurrency(item.value)}
              </span>
            </div>

            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-panel">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.7 }}
                className="h-full rounded-full bg-brand-500"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
