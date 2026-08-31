"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  TrendingUp,
} from "lucide-react";

interface DreResultProps {
  revenue: number;
  costs: number;
  expenses: number;
}

type ResultMiniCardColor = "emerald" | "orange" | "red";

type ResultLineColor =
  | "text-emerald-400"
  | "text-orange-400"
  | "text-red-400"
  | "text-brand-300";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function DreResult({ revenue, costs, expenses }: DreResultProps) {
  const grossResult = revenue - costs;
  const netResult = grossResult - expenses;

  const marginPercentage = revenue > 0 ? (netResult / revenue) * 100 : 0;

  const isPositive = netResult >= 0;

  const formattedMargin = Math.abs(marginPercentage).toFixed(1);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.18,
        duration: 0.45,
      }}
      aria-labelledby="dre-result-title"
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel shadow-xl shadow-black/10"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl ${
          isPositive ? "bg-emerald-500/[0.08]" : "bg-red-500/[0.08]"
        }`}
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <div
                aria-hidden="true"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isPositive ? "bg-emerald-500/10" : "bg-red-500/10"
                }`}
              >
                {isPositive ? (
                  <TrendingUp size={17} className="text-emerald-400" />
                ) : (
                  <ArrowDownRight size={17} className="text-red-400" />
                )}
              </div>

              <div className="min-w-0">
                <p
                  id="dre-result-title"
                  className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500"
                >
                  Resultado líquido
                </p>

                <p className="text-[8px] text-slate-600">
                  Após custos e despesas
                </p>
              </div>
            </div>

            <motion.h2
              initial={{
                scale: 0.95,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 180,
              }}
              className={`font-heading text-3xl font-bold sm:text-4xl ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {formatCurrency(netResult)}
            </motion.h2>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-semibold ${
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight size={10} />
                ) : (
                  <ArrowDownRight size={10} />
                )}
                {formattedMargin}% de margem
              </span>

              <span className="text-[8px] text-slate-600">sobre a receita</span>
            </div>
          </div>

          <div className="grid w-full max-w-md grid-cols-3 gap-3">
            <ResultMiniCard label="Receita" value={revenue} color="emerald" />

            <ResultMiniCard label="Custos" value={costs} color="orange" />

            <ResultMiniCard label="Despesas" value={expenses} color="red" />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-surface-border bg-surface-sidebar/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <BadgeDollarSign size={14} className="text-brand-400" />

            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Composição do resultado
            </span>
          </div>

          <div className="space-y-3">
            <ResultLine
              label="Receita bruta"
              value={revenue}
              color="text-emerald-400"
            />

            <ResultLine
              label="(-) Custos"
              value={costs}
              color="text-orange-400"
              negative
            />

            <ResultDivider />

            <ResultLine
              label="Resultado bruto"
              value={grossResult}
              color="text-brand-300"
              strong
            />

            <ResultLine
              label="(-) Despesas"
              value={expenses}
              color="text-red-400"
              negative
            />

            <ResultDivider />

            <ResultLine
              label="Resultado líquido"
              value={netResult}
              color={isPositive ? "text-emerald-400" : "text-red-400"}
              strong
              large
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

interface ResultMiniCardProps {
  label: string;
  value: number;
  color: ResultMiniCardColor;
}

function ResultMiniCard({ label, value, color }: ResultMiniCardProps) {
  const styles: Record<ResultMiniCardColor, string> = {
    emerald: "border-emerald-500/15 bg-emerald-500/[0.05] text-emerald-400",

    orange: "border-orange-500/15 bg-orange-500/[0.05] text-orange-400",

    red: "border-red-500/15 bg-red-500/[0.05] text-red-400",
  };

  return (
    <motion.div
      whileHover={{
        y: -3,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 18,
      }}
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

function ResultLine({
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
        className={`${
          strong ? "font-semibold text-slate-200" : "text-slate-400"
        } ${large ? "text-sm" : "text-xs"}`}
      >
        {label}
      </span>

      <span
        className={`shrink-0 ${color} ${
          strong ? "font-bold" : "font-semibold"
        } ${large ? "text-base" : "text-xs"}`}
      >
        {negative ? "-" : ""}
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}

function ResultDivider() {
  return <div className="h-px bg-surface-border" />;
}
