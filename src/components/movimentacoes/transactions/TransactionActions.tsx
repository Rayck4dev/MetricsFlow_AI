"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

import { useCompanyRole } from "@/hooks/useCompanyRole";

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
  const { role, loading } = useCompanyRole();

  const canManageTransactions = !loading && role === "owner";

  if (!canManageTransactions) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 md:block">
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-surface-border bg-surface-panel/95 p-1 shadow-lg shadow-black/20 backdrop-blur-md opacity-0 transition-all duration-200 group-hover:opacity-100">
        {onEdit && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(transaction)}
            aria-label="Editar movimentação"
            title="Editar movimentação"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-brand-500/10 hover:text-brand-400"
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
            title="Excluir movimentação"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={12} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
