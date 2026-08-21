"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp } from "lucide-react";

interface DreResultProps {
  revenue: number;
  costs: number;
  expenses: number;
  result: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function DreResult({
  revenue,
  costs,
  expenses,
  result,
}: DreResultProps) {
  const margin = revenue > 0 ? (result / revenue) * 100 : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="relative overflow-hidden rounded-2xl border border-cpm-income/20 bg-gradient-to-br from-cpm-income/[0.08] via-surface-panel to-surface-panel p-6 shadow-2xl shadow-black/20"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cpm-income/10 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cpm-income/10">
              <TrendingUp size={17} className="text-cpm-income" />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-cpm-income">
                Resultado
              </p>

              <h2 className="mt-0.5 text-sm font-bold text-white">
                Resultado líquido
              </h2>
            </div>
          </div>

          <p className="mt-5 max-w-xl text-[10px] leading-5 text-slate-500">
            Depois de considerar custos e despesas operacionais, este é o
            resultado financeiro do período selecionado.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-surface-border bg-surface-sidebar px-3 py-1.5 text-[8px] font-semibold text-slate-400">
              Receita: {formatCurrency(revenue)}
            </span>

            <span className="rounded-full border border-surface-border bg-surface-sidebar px-3 py-1.5 text-[8px] font-semibold text-slate-400">
              Custos: {formatCurrency(costs)}
            </span>

            <span className="rounded-full border border-surface-border bg-surface-sidebar px-3 py-1.5 text-[8px] font-semibold text-slate-400">
              Despesas: {formatCurrency(expenses)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-cpm-income" />

            <span className="text-[9px] font-bold text-cpm-income">
              Margem de {margin.toFixed(1)}%
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 font-heading text-3xl font-bold tracking-tight text-white"
          >
            {formatCurrency(result)}
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
