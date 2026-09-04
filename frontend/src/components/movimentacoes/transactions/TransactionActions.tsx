"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

import type { Movimentacao } from "@/types/index";

interface TransactionActionsProps {
  transaction: Movimentacao;
  onEdit?: (transaction: Movimentacao) => void;
  onDelete?: (transaction: Movimentacao) => void;
}

export function TransactionActions({
  transaction,
  onEdit,
  onDelete,
}: TransactionActionsProps) {
  return (
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
  );
}
