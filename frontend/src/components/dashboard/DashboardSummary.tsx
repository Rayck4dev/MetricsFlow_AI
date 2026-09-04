"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Target,
} from "lucide-react";

interface DashboardSummaryProps {
  income: number;
  expenses: number;
  profit: number;
  margin: number;
}

export function DashboardSummary({
  income,
  expenses,
  profit,
  margin,
}: DashboardSummaryProps) {
  const total = income + expenses;

  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const expensePercentage = total > 0 ? (expenses / total) * 100 : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.22 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10"
    >
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cpm-accent/[0.06] blur-3xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cpm-accent/10">
          <CircleDollarSign size={18} className="text-cpm-accent" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Resumo financeiro</h2>

          <p className="text-[9px] text-slate-600">Visão rápida do período</p>
        </div>
      </div>

      <div className="relative mt-7 space-y-5">
        <SummaryRow
          label="Receitas"
          value={income}
          percentage={incomePercentage}
          icon={ArrowUpRight}
          color="text-cpm-income"
          bar="bg-cpm-income"
        />

        <SummaryRow
          label="Despesas"
          value={expenses}
          percentage={expensePercentage}
          icon={ArrowDownRight}
          color="text-cpm-expense"
          bar="bg-cpm-expense"
        />

        <div className="h-px bg-surface-border" />

        <div className="rounded-2xl border border-brand-500/10 bg-brand-500/[0.04] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-600">
                Resultado líquido
              </p>

              <p
                className={`mt-1 text-lg font-bold ${
                  profit >= 0 ? "text-cpm-income" : "text-cpm-expense"
                }`}
              >
                {formatCurrency(profit)}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
              <Target size={16} className="text-brand-400" />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-semibold text-slate-500">
              Margem de lucro
            </span>

            <span className="text-[10px] font-bold text-brand-400">
              {margin.toFixed(1)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-surface-sidebar">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.max(0, Math.min(100, margin))}%`,
              }}
              transition={{ duration: 0.9 }}
              className="h-full rounded-full bg-brand-500 shadow-[0_0_12px_rgba(14,165,233,0.3)]"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function SummaryRow({
  label,
  value,
  percentage,
  icon: Icon,
  color,
  bar,
}: {
  label: string;
  value: number;
  percentage: number;
  icon: typeof ArrowUpRight;
  color: string;
  bar: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={13} className={color} />

          <span className="text-[10px] font-semibold text-slate-400">
            {label}
          </span>
        </div>

        <span className="text-[10px] font-bold text-slate-300">
          {formatCurrency(value)}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-sidebar">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
          className={`h-full rounded-full ${bar}`}
        />
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
