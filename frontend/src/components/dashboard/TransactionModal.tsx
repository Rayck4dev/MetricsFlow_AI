"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

import {
  TransactionFormData,
  TransactionType,
} from "@/constants/transaction.constants";

import { useTransaction } from "@/hooks/useTransaction";

import TransactionForm from "@/components/movimentacoes/transactions/TransactionForm";

import { TransactionTypeSelector } from "@/components/movimentacoes/transactions/TransactionTypeSelector";

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  onSave?: (data: TransactionFormData) => void | Promise<void>;
}

export function TransactionModal({
  isOpen,
  onClose,
  defaultType = "income",
  onSave,
}: TransactionModalProps) {
  const transaction = useTransaction({
    defaultType,
    onSave,
    onSuccess: onClose,
  });

  useEffect(() => {
    if (!isOpen) {
      transaction.resetForm();
    }
  }, [isOpen, transaction]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex select-none items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-surface-border bg-surface-sidebar p-6 shadow-2xl shadow-black/60"
          >
            {transaction.isSuccess ? (
              <SuccessState />
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-surface-border pb-4">
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Novo Lançamento
                  </h2>

                  <button
                    onClick={onClose}
                    type="button"
                    aria-label="Fechar"
                    className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-surface-panel hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5">
                  <TransactionTypeSelector
                    value={transaction.type}
                    onChange={transaction.handleTypeChange}
                  />
                </div>

                <TransactionForm
                  type={transaction.type}
                  categories={transaction.categories}
                  onCancel={onClose}
                  onSubmit={transaction.handleSubmit}
                />
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SuccessState() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
        <CheckCircle2 size={36} />
      </div>

      <h3 className="text-xl font-bold text-white">Lançamento Salvo!</h3>

      <p className="mt-1 text-xs text-slate-400">
        A transação foi adicionada com sucesso.
      </p>
    </motion.div>
  );
}
