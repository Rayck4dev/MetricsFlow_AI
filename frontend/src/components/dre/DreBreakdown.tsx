"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface DreBreakdownProps {
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

export function DreBreakdown({
  revenue,
  costs,
  expenses,
  result,
}: DreBreakdownProps) {
  const totalOut = costs + expenses;

  const rows = [
    {
      label: "Receita bruta",
      value: revenue,
      type: "income" as const,
    },
    {
      label: "(-) Custos",
      value: costs,
      type: "expense" as const,
    },
    {
      label: "(-) Despesas operacionais",
      value: expenses,
      type: "expense" as const,
    },
    {
      label: "Resultado líquido",
      value: result,
      type: "result" as const,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.22,
      }}
      className="rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10"
    >
      <div className="mb-5">
        <h2 className="text-xs font-bold text-white">
          Visão financeira
        </h2>

        <p className="mt-1 text-[8px] text-slate-600">
          Resumo visual das principais movimentações da DRE.
        </p>
      </div>

      <div className="space-y-1">
        {rows.map((row, index) => {
          const isResult = row.type === "result";
          const isPositive = isResult
            ? row.value >= 0
            : row.type === "income";

          const percentage =
            revenue > 0
              ? Math.min(
                  (Math.abs(row.value) / revenue) * 100,
                  100,
                )
              : 0;

          return (
            <motion.div
              key={row.label}
              initial={{
                opacity: 0,
                x: -8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.25 + index * 0.06,
              }}
              className={`rounded-xl p-3 ${
                isResult
                  ? isPositive
                    ? "mt-2 border border-emerald-500/20 bg-emerald-500/[0.05]"
                    : "mt-2 border border-rose-500/20 bg-rose-500/[0.05]"
                  : "bg-surface-sidebar/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    isPositive
                      ? "bg-emerald-500/10"
                      : "bg-rose-500/10"
                  }`}
                >
                  {isResult ? (
                    isPositive ? (
                      <TrendingUp
                        size={13}
                        className="text-emerald-400"
                      />
                    ) : (
                      <TrendingDown
                        size={13}
                        className="text-rose-400"
                      />
                    )
                  ) : isPositive ? (
                    <ArrowUpRight
                      size={13}
                      className="text-emerald-400"
                    />
                  ) : (
                    <ArrowDownRight
                      size={13}
                      className="text-rose-400"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-[9px] font-semibold ${
                        isResult
                          ? "text-white"
                          : "text-slate-500"
                      }`}
                    >
                      {row.label}
                    </span>

                    <span
                      className={`text-[9px] font-bold ${
                        isPositive
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {isResult && row.value < 0
                        ? "-"
                        : !isResult && row.type === "expense"
                          ? "-"
                          : "+"}

                      {formatCurrency(
                        Math.abs(row.value),
                      )}
                    </span>
                  </div>

                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-panel">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${percentage}%`,
                      }}
                      transition={{
                        duration: 0.7,
                        delay: 0.1 + index * 0.05,
                      }}
                      className={`h-full rounded-full ${
                        isPositive
                          ? "bg-emerald-400"
                          : "bg-rose-400"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-4">
        <span className="text-[8px] font-semibold text-slate-600">
          Total de saídas
        </span>

        <span className="text-[9px] font-bold text-slate-400">
          {formatCurrency(totalOut)}
        </span>
      </div>
    </motion.section>
  );
}