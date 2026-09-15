"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";

import type { DashboardTransaction } from "./DashboardTransactions";

interface DashboardChartProps {
  transactions: DashboardTransaction[];
}

export function DashboardChart({ transactions }: DashboardChartProps) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const max = Math.max(income, expenses, 1);

  const incomeHeight = Math.max(8, (income / max) * 100);
  const expenseHeight = Math.max(8, (expenses / max) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-500/[0.05] blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
            <BarChart3 size={18} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Fluxo financeiro</h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Entradas e saídas registradas
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-surface-border bg-surface-sidebar px-2.5 py-1.5 sm:flex">
          <TrendingUp size={11} className="text-cpm-income" />
          <span className="text-[8px] font-semibold text-slate-500">
            Visão geral
          </span>
        </div>
      </div>

      <div className="relative mt-8">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="border-t border-surface-border/50" />
          ))}
        </div>

        <div className="relative flex h-[250px] items-end justify-around gap-12 px-6 pb-8 pt-5">
          <ChartBar
            label="Receitas"
            value={income}
            height={incomeHeight}
            color="bg-cpm-income"
          />

          <ChartBar
            label="Despesas"
            value={expenses}
            height={expenseHeight}
            color="bg-cpm-expense"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-around text-[8px] font-semibold uppercase tracking-wider text-slate-700">
          <span>Entradas</span>
          <span>Saídas</span>
        </div>
      </div>
    </motion.section>
  );
}

function ChartBar({
  label,
  value,
  height,
  color,
}: {
  label: string;
  value: number;
  height: number;
  color: string;
}) {
  return (
    <div className="flex h-full w-24 flex-col items-center justify-end gap-2">
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-[9px] font-bold text-slate-400"
      >
        {formatCurrency(value)}
      </motion.span>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${height}%` }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className={`relative w-full max-w-[58px] overflow-hidden rounded-t-2xl ${color} shadow-lg`}
      >
        <div className="absolute inset-x-0 top-0 h-8 bg-white/10" />

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/5" />
      </motion.div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}
