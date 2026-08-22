"use client";

import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Inbox,
  MoreHorizontal,
  Pencil,
  Trash2,
  WalletCards,
} from "lucide-react";

import type { Movimentacao } from "./types";

interface MovimentacoesTableProps {
  transactions: Movimentacao[];
  totalTransactions: number;
  onEdit?: (transaction: Movimentacao) => void;
  onDelete?: (transaction: Movimentacao) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getPaymentIcon(paymentMethod: string) {
  const normalized = paymentMethod.toLowerCase();

  if (
    normalized.includes("pix") ||
    normalized.includes("transfer") ||
    normalized.includes("transferência")
  ) {
    return WalletCards;
  }

  return CreditCard;
}

export function MovimentacoesTable({
  transactions,
  totalTransactions,
  onEdit,
  onDelete,
}: MovimentacoesTableProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.45 }}
      className="min-w-0 overflow-hidden rounded-2xl border border-surface-border bg-surface-panel shadow-xl shadow-black/10"
    >
      <div className="flex min-w-0 items-center justify-between gap-4 border-b border-surface-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="font-heading text-sm font-bold text-white">
            Histórico de movimentações
          </h2>

          <p className="mt-0.5 text-[9px] text-slate-600">
            {transactions.length} de {totalTransactions} registros
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/50" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[8px] font-semibold text-slate-500">
            Atualizado agora
          </span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-500/10 bg-brand-500/[0.06] text-brand-400"
          >
            <Inbox size={20} />
          </motion.div>

          <h3 className="mt-4 text-sm font-bold text-slate-300">
            Nenhuma movimentação encontrada
          </h3>

          <p className="mt-1 max-w-sm text-[10px] leading-5 text-slate-600">
            Tente alterar os filtros ou registrar uma nova receita ou despesa.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden min-w-0 grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto] gap-4 border-b border-surface-border bg-surface-sidebar/50 px-5 py-3 md:grid">
            <span className="min-w-0 text-[8px] font-bold uppercase tracking-wider text-slate-600">
              Movimentação
            </span>

            <span className="min-w-0 text-[8px] font-bold uppercase tracking-wider text-slate-600">
              Categoria
            </span>

            <span className="min-w-0 text-[8px] font-bold uppercase tracking-wider text-slate-600">
              Pagamento
            </span>

            <span className="min-w-0 text-[8px] font-bold uppercase tracking-wider text-slate-600">
              Data
            </span>

            <span className="text-right text-[8px] font-bold uppercase tracking-wider text-slate-600">
              Valor
            </span>

            <span className="w-8" />
          </div>

          <div className="min-w-0 divide-y divide-surface-border">
            {transactions.map((transaction, index) => {
              const income = transaction.type === "income";
              const PaymentIcon = getPaymentIcon(transaction.paymentMethod);

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.04 * index,
                    duration: 0.3,
                  }}
                  className="group relative grid min-w-0 gap-3 px-5 py-4 transition-colors hover:bg-white/[0.015] md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto] md:items-center md:gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        rotate: income ? 3 : -3,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                        income
                          ? "border-emerald-500/10 bg-emerald-500/10 text-emerald-400"
                          : "border-red-500/10 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {income ? (
                        <ArrowUpRight size={15} />
                      ) : (
                        <ArrowDownLeft size={15} />
                      )}
                    </motion.div>

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-bold text-slate-200">
                        {transaction.description}
                      </p>

                      <p className="mt-0.5 truncate text-[8px] text-slate-600">
                        {income ? "Entrada" : "Saída"}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <span className="inline-flex max-w-full truncate rounded-full border border-surface-border bg-surface-sidebar px-2 py-1 text-[8px] font-semibold text-slate-500">
                      {transaction.category}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-1.5 text-[9px] text-slate-500">
                    <PaymentIcon size={12} className="shrink-0" />

                    <span className="truncate">
                      {transaction.paymentMethod}
                    </span>
                  </div>

                  <div className="min-w-0 truncate text-[9px] text-slate-600">
                    {transaction.date}
                  </div>

                  <div
                    className={`shrink-0 text-left text-[10px] font-bold md:text-right ${
                      income ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {income ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </div>

                  <div className="hidden shrink-0 justify-end md:flex">
                    <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {onEdit && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEdit(transaction)}
                          aria-label="Editar movimentação"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-surface-border bg-surface-sidebar text-slate-500 transition-colors hover:border-brand-500/20 hover:bg-brand-500/10 hover:text-brand-400"
                        >
                          <Pencil size={12} />
                        </motion.button>
                      )}

                      {onDelete && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDelete(transaction)}
                          aria-label="Excluir movimentação"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-surface-border bg-surface-sidebar text-slate-500 transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="absolute right-4 top-4 md:hidden">
                    <details className="relative">
                      <summary className="flex h-7 w-7 cursor-pointer list-none items-center justify-center rounded-lg border border-surface-border bg-surface-sidebar text-slate-500 transition-colors hover:text-slate-300">
                        <MoreHorizontal size={14} />
                      </summary>

                      <div className="absolute right-0 top-8 z-30 flex min-w-[130px] flex-col overflow-hidden rounded-xl border border-surface-border bg-surface-sidebar p-1.5 shadow-2xl">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(transaction)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[9px] font-semibold text-slate-400 transition-colors hover:bg-brand-500/10 hover:text-brand-400"
                          >
                            <Pencil size={12} />
                            Editar
                          </button>
                        )}

                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(transaction)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[9px] font-semibold text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                            Excluir
                          </button>
                        )}
                      </div>
                    </details>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.section>
  );
}
