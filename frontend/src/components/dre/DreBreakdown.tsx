"use client";

import { motion } from "framer-motion";
import { BreakdownRow } from "./breakdown/BreakdownRow";

interface DreBreakdownProps {
  revenue: number;
  costs: number;
  expenses: number;
  result: number;
}

interface BreakdownRowData {
  label: string;
  value: number;
  type: "income" | "expense" | "result";
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

  const rows: BreakdownRowData[] = [
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
        <h2 className="text-xs font-bold text-white">Visão financeira</h2>

        <p className="mt-1 text-[8px] text-slate-600">
          Resumo visual das principais movimentações da DRE.
        </p>
      </div>

      <div className="space-y-1">
        {rows.map((row, index) => (
          <BreakdownRow
            key={row.label}
            row={row}
            index={index}
            revenue={revenue}
          />
        ))}
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
