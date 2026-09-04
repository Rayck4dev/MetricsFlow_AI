"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

import TransactionForm from "./transactions/TransactionForm";
import type { TransactionFormValues } from "./transactions/TransactionForm";

interface ReceitaModalProps {
  onClose: () => void;
  onSubmit: (transaction: TransactionFormValues) => void | Promise<void>;
  initialData?: Partial<TransactionFormValues>;
  categories?: string[];
}

export function ReceitaModal({
  onClose,
  onSubmit,
  initialData,
  categories,
}: ReceitaModalProps) {
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
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onMouseDown={(event) => event.stopPropagation()}
          className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-emerald-500/15 bg-surface-panel shadow-2xl shadow-black/40"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-surface-border bg-surface-panel/95 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ArrowUpRight size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">Nova receita</h2>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  Registre uma nova entrada financeira.
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
              type="income"
              initialData={initialData}
              categories={categories}
              onSubmit={onSubmit}
              onCancel={onClose}
              submitLabel="Salvar receita"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
