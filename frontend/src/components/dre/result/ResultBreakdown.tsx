"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "./formatCurrency";

type ResultMiniCardColor = "emerald" | "orange" | "red";
type ResultLineColor =
  | "text-emerald-400"
  | "text-orange-400"
  | "text-red-400"
  | "text-brand-300";

interface ResultMiniCardProps {
  label: string;
  value: number;
  color: ResultMiniCardColor;
}

export function ResultMiniCard({ label, value, color }: ResultMiniCardProps) {
  const styles: Record<ResultMiniCardColor, string> = {
    emerald: "border-emerald-500/15 bg-emerald-500/[0.05] text-emerald-400",
    orange: "border-orange-500/15 bg-orange-500/[0.05] text-orange-400",
    red: "border-red-500/15 bg-red-500/[0.05] text-red-400",
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={`min-w-0 rounded-xl border p-3 ${styles[color]}`}
    >
      <p className="truncate text-[8px] font-semibold uppercase tracking-wider opacity-70">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-bold">{formatCurrency(value)}</p>
    </motion.div>
  );
}

interface ResultLineProps {
  label: string;
  value: number;
  color: ResultLineColor;
  negative?: boolean;
  strong?: boolean;
  large?: boolean;
}

export function ResultLine({
  label,
  value,
  color,
  negative = false,
  strong = false,
  large = false,
}: ResultLineProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={`${strong ? "font-semibold text-slate-200" : "text-slate-400"} ${large ? "text-sm" : "text-xs"}`}
      >
        {label}
      </span>
      <span
        className={`shrink-0 ${color} ${strong ? "font-bold" : "font-semibold"} ${large ? "text-base" : "text-xs"}`}
      >
        {negative ? "-" : ""}
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}

export function ResultDivider() {
  return <div className="h-px bg-surface-border" />;
}
