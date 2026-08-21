"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

import type { Movimentacao } from "./Movimentacoes";

interface TransactionDeleteDialogProps {
  transaction: Movimentacao | null;
  onClose: () => void;
  onConfirm: (transaction: Movimentacao) => void | Promise<void>;
}

export function TransactionDeleteDialog({
  transaction,
  onClose,
  onConfirm,
}: TransactionDeleteDialogProps) {
  if (!transaction) {
    return null;
  }

  const isIncome = transaction.type === "income";

  const formattedAmount = transaction.amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={onClose}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          onMouseDown={(event) => event.stopPropagation()}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/20 bg-surface-panel shadow-2xl shadow-black/50"
        >
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <AlertTriangle size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-white">
                  Excluir movimentação?
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Essa ação não poderá ser desfeita. A movimentação será
                  removida do histórico financeiro.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-surface-sidebar hover:text-slate-300"
                aria-label="Fechar"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-surface-border bg-surface-sidebar/70 p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-300">
                    {transaction.description}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-600">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-sm font-bold ${
                    isIncome ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formattedAmount}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-xl px-4 text-[10px] font-bold text-slate-500 transition-colors hover:bg-surface-sidebar hover:text-slate-300"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => onConfirm(transaction)}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-500 px-4 text-[10px] font-bold text-white shadow-lg shadow-rose-500/10 transition-all hover:-translate-y-0.5 hover:bg-rose-400"
              >
                <Trash2 size={13} />
                Excluir movimentação
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
