"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Pencil, X } from "lucide-react";

import TransactionForm, { type TransactionFormValues } from "@/components/movimentacoes/transactions/TransactionForm";

import type { Movimentacao } from "@/types/index";

interface TransactionEditModalProps {
  transaction: Movimentacao;

  onClose: () => void;

  onSubmit: (values: TransactionFormValues) => void | Promise<void>;

  categories?: string[];
}

export function TransactionEditModal({
  transaction,
  onClose,
  onSubmit,
  categories = [],
}: TransactionEditModalProps) {
  const isIncome = transaction.type === "income";

  async function handleSubmit(values: TransactionFormValues) {
    await onSubmit(values);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 16,
            scale: 0.97,
          }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 28,
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-surface-border bg-surface-panel shadow-2xl shadow-black/40"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-surface-border bg-surface-panel/95 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  isIncome
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {isIncome ? (
                  <ArrowUpRight size={18} />
                ) : (
                  <ArrowDownLeft size={18} />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">
                    Editar movimentação
                  </h2>

                  <Pencil size={12} className="text-brand-400" />
                </div>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  Atualize os dados dessa movimentação.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-surface-sidebar hover:text-slate-300"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-5">
            <TransactionForm
              type={transaction.type}
              initialData={transaction}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={onClose}
              submitLabel="Salvar alterações"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
