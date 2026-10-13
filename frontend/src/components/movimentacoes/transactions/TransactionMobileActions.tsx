"use client";

import { MoreHorizontal, Pencil, Trash2, Paperclip } from "lucide-react";
import type { Movimentacao } from "@/types/index";

interface TransactionMobileActionsProps {
  transaction: Movimentacao;
  onEdit?: (transaction: Movimentacao) => void;
  onDelete?: (transaction: Movimentacao) => void;
  onManageAttachment?: (transaction: Movimentacao) => void;
}

export function TransactionMobileActions({
  transaction,
  onEdit,
  onDelete,
  onManageAttachment,
}: TransactionMobileActionsProps) {
  return (
    <div className="absolute right-4 top-4 md:hidden">
      <details className="relative">
        <summary
          aria-label="Abrir ações da movimentação"
          className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg border border-surface-border bg-surface-panel text-slate-400 transition hover:bg-white/5 hover:text-white [&::-webkit-details-marker]:hidden"
        >
          <MoreHorizontal size={14} />
        </summary>

        <div className="absolute right-0 top-8 z-30 flex min-w-[150px] flex-col overflow-hidden rounded-xl border border-surface-border bg-surface-panel p-1 shadow-xl">
          {onManageAttachment && (
            <button
              type="button"
              onClick={() => onManageAttachment(transaction)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Paperclip size={12} />
              Comprovante
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(transaction)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Pencil size={12} />
              Editar
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(transaction)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10"
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
