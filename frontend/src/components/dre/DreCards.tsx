"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";

interface DreCardsProps {
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

const cards = [
  {
    key: "revenue",
    label: "Receita bruta",
    icon: ArrowUpRight,
    tone: "income",
  },
  {
    key: "costs",
    label: "Custos",
    icon: ArrowDownRight,
    tone: "expense",
  },
  {
    key: "expenses",
    label: "Despesas operacionais",
    icon: CircleDollarSign,
    tone: "expense",
  },
  {
    key: "result",
    label: "Resultado líquido",
    icon: TrendingUp,
    tone: "result",
  },
] as const;

export function DreCards({ revenue, costs, expenses, result }: DreCardsProps) {
  const values = {
    revenue,
    costs,
    expenses,
    result,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const value = values[card.key];

        const positive = card.key === "revenue" || card.key === "result";

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
            }}
            whileHover={{
              y: -4,
              rotateX: 2,
              rotateY: -1,
            }}
            style={{ transformPerspective: 900 }}
            className="group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10"
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${
                positive ? "bg-cpm-income/10" : "bg-cpm-expense/10"
              }`}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    positive
                      ? "bg-cpm-income/10 text-cpm-income"
                      : "bg-cpm-expense/10 text-cpm-expense"
                  }`}
                >
                  <Icon size={17} />
                </div>

                <span
                  className={`text-[8px] font-bold uppercase tracking-wider ${
                    positive ? "text-cpm-income" : "text-cpm-expense"
                  }`}
                >
                  DRE
                </span>
              </div>

              <p className="mt-5 text-[9px] font-semibold text-slate-500">
                {card.label}
              </p>

              <p className="mt-1 font-heading text-xl font-bold tracking-tight text-white">
                {formatCurrency(value)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
