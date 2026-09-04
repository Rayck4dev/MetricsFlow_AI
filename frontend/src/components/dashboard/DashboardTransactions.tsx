"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  Receipt,
} from "lucide-react";

export interface DashboardTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

interface DashboardTransactionsProps {
  transactions: DashboardTransaction[];
  onViewAll?: () => void;
}

export function DashboardTransactions({
  transactions,
  onViewAll,
}: DashboardTransactionsProps) {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel shadow-xl shadow-black/10"
    >
      <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
            <Receipt size={16} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              Movimentações recentes
            </h2>

            <p className="text-[9px] text-slate-600">
              Últimas entradas e saídas
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="group flex items-center gap-1 text-[9px] font-bold text-brand-400 transition-colors hover:text-brand-300"
        >
          Ver todas
          <ChevronRight
            size={12}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <div className="divide-y divide-surface-border">
        {recentTransactions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Receipt size={24} className="mx-auto text-slate-700" />

            <p className="mt-3 text-xs font-semibold text-slate-500">
              Nenhuma movimentação
            </p>

            <p className="mt-1 text-[9px] text-slate-700">
              Suas movimentações aparecerão aqui.
            </p>
          </div>
        ) : (
          recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.35 + index * 0.05,
              }}
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-sidebar/50"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  transaction.type === "income"
                    ? "bg-cpm-income/10"
                    : "bg-cpm-expense/10"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowUpRight size={15} className="text-cpm-income" />
                ) : (
                  <ArrowDownRight size={15} className="text-cpm-expense" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-bold text-slate-300">
                  {transaction.description}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[8px] text-slate-600">
                    {transaction.category}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-slate-700" />

                  <span className="text-[8px] text-slate-600">
                    {transaction.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-[8px] text-slate-700">{transaction.date}</p>
              </div>

              <p
                className={`text-[11px] font-bold ${
                  transaction.type === "income"
                    ? "text-cpm-income"
                    : "text-cpm-expense"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
