"use client";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

import { TransactionRow } from "./transactions/TransactionRow";

import type { Movimentacao } from "./types";

interface MovimentacoesTableProps {
  transactions: Movimentacao[];
  totalTransactions: number;

  onEdit?: (transaction: Movimentacao) => void;
  onDelete?: (transaction: Movimentacao) => void;
}

export function MovimentacoesTable({
  transactions,
  totalTransactions,
  onEdit,
  onDelete,
}: MovimentacoesTableProps) {
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
        delay: 0.22,
        duration: 0.45,
      }}
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
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.35,
            }}
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
            {transactions.map((transaction, index) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </>
      )}
    </motion.section>
  );
}
