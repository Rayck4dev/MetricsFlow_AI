"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Wallet } from "lucide-react";

interface MovimentacoesCardsProps {
  income: number;
  expenses: number;
  balance: number;
  count: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const cards = [
  {
    key: "income",
    label: "Receitas",
    icon: ArrowUpRight,
    description: "Total recebido",
    iconClass: "bg-cpm-income/10 text-cpm-income",
    glowClass: "bg-cpm-income/10",
  },
  {
    key: "expenses",
    label: "Despesas",
    icon: ArrowDownLeft,
    description: "Total gasto",
    iconClass: "bg-cpm-expense/10 text-cpm-expense",
    glowClass: "bg-cpm-expense/10",
  },
  {
    key: "balance",
    label: "Saldo",
    icon: Wallet,
    description: "Resultado do período",
    iconClass: "bg-cpm-accent/10 text-cpm-accent",
    glowClass: "bg-cpm-accent/10",
  },
  {
    key: "count",
    label: "Movimentações",
    icon: CreditCard,
    description: "Registros realizados",
    iconClass: "bg-brand-500/10 text-brand-400",
    glowClass: "bg-brand-500/10",
  },
] as const;

export function MovimentacoesCards({
  income,
  expenses,
  balance,
  count,
}: MovimentacoesCardsProps) {
  const values = {
    income: formatCurrency(income),
    expenses: formatCurrency(expenses),
    balance: formatCurrency(balance),
    count: count.toString(),
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.07,
              ease: "easeOut",
            }}
            whileHover={{
              y: -4,
              transition: { duration: 0.2 },
            }}
            className="group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-lg shadow-black/10"
          >
            {/* Glow */}
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${card.glowClass} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
            />

            {/* Reflexo */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.035] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconClass} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2`}
                >
                  <Icon size={18} />
                </div>

                <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  {card.key === "count" ? "Total" : "Período"}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-medium text-slate-500">
                  {card.label}
                </p>

                <p className="mt-1 font-heading text-xl font-bold tracking-tight text-white">
                  {values[card.key]}
                </p>

                <p className="mt-1 text-[9px] text-slate-600">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Linha inferior animada */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.07 + 0.2,
              }}
              className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-brand-500/40 via-cpm-accent/20 to-transparent"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
