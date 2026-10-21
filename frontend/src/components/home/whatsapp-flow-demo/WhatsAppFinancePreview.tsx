"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Receipt, WalletCards } from "lucide-react";
import { Metric, TrendingUpIcon } from "./WhatsAppFinanceMetrics";

interface Transaction {
  description: string;
  value: string;
  type: "income" | "expense";
}

const transactions: Transaction[] = [
  {
    description: "Venda de produtos",
    value: "+R$ 250,00",
    type: "income",
  },
  {
    description: "Combustível",
    value: "-R$ 180,00",
    type: "expense",
  },
  {
    description: "Internet",
    value: "-R$ 90,00",
    type: "expense",
  },
];

export function WhatsAppFinancePreview() {
  return (
    <div className="relative bg-surface-sidebar p-5 lg:p-7">
      <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-brand-500/[0.06] blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
              <WalletCards size={16} />
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.14em] text-slate-600">
                Visão geral
              </p>

              <h3 className="mt-0.5 text-sm font-bold text-white">
                Seu financeiro
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.05] px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <span className="text-[8px] font-semibold text-emerald-400">
              Atualizado
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <Metric
            label="Receita"
            value="R$ 12.450"
            icon={<TrendingUpIcon />}
            valueClass="text-white"
          />

          <Metric
            label="Despesas"
            value="R$ 3.350"
            icon={<Receipt size={11} />}
            valueClass="text-rose-400"
          />

          <Metric
            label="Resultado"
            value="R$ 9.100"
            icon={<CheckCircle2 size={11} />}
            valueClass="text-emerald-400"
          />
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-brand-500/10 bg-brand-500/[0.035] p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <ArrowRight size={14} />
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.12em] text-brand-400">
              Sincronizado
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              A nova movimentação já aparece no seu financeiro.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-surface-border bg-surface-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[7px] uppercase tracking-[0.14em] text-slate-600">
                Movimentações
              </p>

              <p className="mt-1 text-[10px] font-semibold text-slate-300">
                Últimos lançamentos
              </p>
            </div>

            <span className="text-[7px] text-slate-600">Agosto 2026</span>
          </div>

          <div className="mt-4 space-y-2">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.description}
                initial={{
                  opacity: 0,
                  x: 8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 1 + index * 0.1,
                }}
                className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-sidebar px-3 py-2.5"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    transaction.type === "income"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowRight size={12} className="-rotate-45" />
                  ) : (
                    <ArrowRight size={12} className="rotate-45" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] font-semibold text-slate-300">
                    {transaction.description}
                  </p>

                  <p className="mt-0.5 text-[7px] text-slate-600">
                    Registrada pelo WhatsApp
                  </p>
                </div>

                <span
                  className={`text-[9px] font-bold ${
                    transaction.type === "income"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {transaction.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[8px] text-slate-600">
            DRE atualizado automaticamente
          </span>

          <span className="flex items-center gap-1.5 text-[8px] font-medium text-emerald-400">
            <CheckCircle2 size={10} />
            Tudo sincronizado
          </span>
        </div>
      </div>
    </div>
  );
}
