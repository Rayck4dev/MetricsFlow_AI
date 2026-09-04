"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Percent,
  WalletCards,
} from "lucide-react";

interface DashboardCardsProps {
  income: number;
  expenses: number;
  profit: number;
  margin: number;
}

export function DashboardCards({
  income,
  expenses,
  profit,
  margin,
}: DashboardCardsProps) {
  const cards = [
    {
      title: "Receita total",
      value: income,
      icon: ArrowUpRight,
      color: "text-cpm-income",
      iconBg: "bg-cpm-income/10",
      border: "hover:border-cpm-income/25",
      description: "Entradas registradas",
    },
    {
      title: "Despesas",
      value: expenses,
      icon: ArrowDownRight,
      color: "text-cpm-expense",
      iconBg: "bg-cpm-expense/10",
      border: "hover:border-cpm-expense/25",
      description: "Saídas registradas",
    },
    {
      title: "Resultado líquido",
      value: profit,
      icon: WalletCards,
      color: profit >= 0 ? "text-cpm-accent" : "text-cpm-expense",
      iconBg: profit >= 0 ? "bg-cpm-accent/10" : "bg-cpm-expense/10",
      border:
        profit >= 0
          ? "hover:border-cpm-accent/25"
          : "hover:border-cpm-expense/25",
      description: "Receita menos despesas",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
            }}
            whileHover={{
              y: -5,
              rotateX: 1.5,
              rotateY: -1,
            }}
            className={`group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10 transition-colors duration-300 ${card.border}`}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand-500/[0.04] blur-2xl transition-all duration-500 group-hover:bg-brand-500/[0.09]" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">
                  {card.title}
                </p>

                <motion.p
                  key={card.value}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-2xl font-bold tracking-tight text-white"
                >
                  {formatCurrency(card.value)}
                </motion.p>

                <p className="mt-2 text-[9px] text-slate-600">
                  {card.description}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon size={18} className={card.color} />
              </div>
            </div>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24 }}
        whileHover={{ y: -5 }}
        className="group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10 md:col-span-3 lg:col-span-1"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">
              Margem
            </p>

            <p className="mt-3 text-2xl font-bold text-white">
              {margin.toFixed(1)}%
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-sidebar">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.max(0, Math.min(100, margin))}%`,
                  }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="h-full rounded-full bg-brand-500"
                />
              </div>

              <Percent size={11} className="text-brand-400" />
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
            <Percent size={18} className="text-brand-400" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
