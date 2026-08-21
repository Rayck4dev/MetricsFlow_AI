"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, WalletCards } from "lucide-react";

interface DreRevenueProps {
  revenue: number;
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

export function DreRevenue({ revenue, items }: DreRevenueProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cpm-income/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cpm-income/10">
              <WalletCards size={16} className="text-cpm-income" />
            </div>

            <div>
              <h2 className="text-xs font-bold text-white">Receita</h2>

              <p className="mt-0.5 text-[8px] text-slate-600">
                Entradas no período
              </p>
            </div>
          </div>

          <ArrowUpRight size={15} className="text-cpm-income" />
        </div>

        <div className="mt-5">
          <p className="font-heading text-2xl font-bold text-white">
            {formatCurrency(revenue)}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {items.map((item, index) => (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[9px] font-medium text-slate-500">
                  {item.label}
                </span>

                <span className="text-[9px] font-semibold text-slate-300">
                  {formatCurrency(item.value)}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-surface-sidebar">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                  }}
                  className="h-full rounded-full bg-cpm-income"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
