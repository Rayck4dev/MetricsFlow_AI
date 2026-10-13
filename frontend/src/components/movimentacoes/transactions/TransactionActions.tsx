"use client";

import { motion } from "framer-motion";
import { MoreVertical, Paperclip, Pencil, Trash2 } from "lucide-react";

import type { Movimentacao } from "@/components/movimentacoes/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TransactionActionsProps {
  transaction: Movimentacao;
  onEdit?: (transaction: Movimentacao) => void;
  onDelete?: (transaction: Movimentacao) => void;
  onManageAttachment?: (transaction: Movimentacao) => void;
}

export function TransactionActions({
  transaction,
  onEdit,
  onDelete,
  onManageAttachment,
}: TransactionActionsProps) {
  return (
    <div className="flex h-full w-full items-center justify-center md:justify-self-center">
      {" "}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            aria-label="Abrir ações da movimentação"
            title="Mais opções"
            className="flex h-8 w-8 items-center justify-center rounded-lg
              text-slate-400 transition-colors hover:bg-white/10
              hover:text-white focus:outline-none focus:ring-2
              focus:ring-blue-500"
          >
            <MoreVertical size={18} />
          </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="
    z-50 min-w-44
    border border-white/10
    bg-slate-900 p-1 text-slate-200 shadow-xl
    origin-[var(--radix-dropdown-menu-content-transform-origin)]
    data-[state=open]:animate-in
    data-[state=open]:fade-in-0
    data-[state=open]:zoom-in-95
    data-[state=open]:slide-in-from-top-1
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0
    data-[state=closed]:zoom-out-95
    duration-200
  "
        >
          {onEdit && (
            <DropdownMenuItem
              onSelect={() => onEdit(transaction)}
              className="flex cursor-pointer items-center gap-2
                rounded-md px-3 py-2 text-sm focus:bg-white/10
                focus:text-white"
            >
              <Pencil size={15} />
              Editar
            </DropdownMenuItem>
          )}

          {onManageAttachment && (
            <DropdownMenuItem
              onSelect={() => onManageAttachment(transaction)}
              className="flex cursor-pointer items-center gap-2
                rounded-md px-3 py-2 text-sm focus:bg-white/10
                focus:text-white"
            >
              <Paperclip size={15} />
              Comprovante
            </DropdownMenuItem>
          )}

          {onDelete && (
            <DropdownMenuItem
              onSelect={() => onDelete(transaction)}
              className="flex cursor-pointer items-center gap-2
                rounded-md px-3 py-2 text-sm text-red-400
                focus:bg-red-500/10 focus:text-red-300"
            >
              <Trash2 size={15} />
              Excluir
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
