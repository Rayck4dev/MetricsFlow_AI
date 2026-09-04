"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { Movimentacao } from "@/types/index";

interface TransactionMobileActionsProps {
  transaction: Movimentacao;
  onEdit?: (transaction: Movimentacao) => void;
  onDelete?: (transaction: Movimentacao) => void;
}

export function TransactionMobileActions({
  transaction,
  onEdit,
  onDelete,
}: TransactionMobileActionsProps) {
  return (
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
  );
}
