"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface BreakdownRowData {
  label: string;
  value: number;
  type: "income" | "expense" | "result";
}

interface BreakdownRowProps {
  row: BreakdownRowData;
  index: number;
  revenue: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function BreakdownRow({ row, index, revenue }: BreakdownRowProps) {
  const isResult = row.type === "result";
  const isPositive = isResult ? row.value >= 0 : row.type === "income";
  const percentage =
    revenue > 0 ? Math.min((Math.abs(row.value) / revenue) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + index * 0.06 }}
      className={`rounded-xl p-3 ${isResult ? (isPositive ? "mt-2 border border-emerald-500/20 bg-emerald-500/[0.05]" : "mt-2 border border-rose-500/20 bg-rose-500/[0.05]") : "bg-surface-sidebar/40"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isPositive ? "bg-emerald-500/10" : "bg-rose-500/10"}`}
        >
          {isResult ? (
            isPositive ? (
              <TrendingUp size={13} className="text-emerald-400" />
            ) : (
              <TrendingDown size={13} className="text-rose-400" />
            )
          ) : isPositive ? (
            <ArrowUpRight size={13} className="text-emerald-400" />
          ) : (
            <ArrowDownRight size={13} className="text-rose-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`text-[9px] font-semibold ${isResult ? "text-white" : "text-slate-500"}`}
            >
              {row.label}
            </span>
            <span
              className={`text-[9px] font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}
            >
              {isResult && row.value < 0
                ? "-"
                : !isResult && row.type === "expense"
                  ? "-"
                  : "+"}
              {formatCurrency(Math.abs(row.value))}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-panel">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.7, delay: 0.1 + index * 0.05 }}
              className={`h-full rounded-full ${isPositive ? "bg-emerald-400" : "bg-rose-400"}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
