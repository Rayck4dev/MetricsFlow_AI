"use client";

import { AnimatePresence } from "framer-motion";
import type { Movimentacao } from "@/types";
import { ReceitaModal } from "../ReceitaModal";
import { DespesaModal } from "../DespesaModal";
import { TransactionEditModal } from "../transactions/TransactionEditModal";
import { TransactionDeleteDialog } from "../transactions/TransactionDeleteDialog";
import { TransactionAttachmentsModal } from "../transactions/TransactionAttachmentsModal";
import type { TransactionFormValues } from "../transactions/TransactionForm";

interface MovimentacoesModalsProps {
  isIncomeModalOpen: boolean;
  closeIncomeModal: () => void;
  handleIncome: (transaction: Omit<Movimentacao, "id">) => void | Promise<void>;
  incomeCategories: string[];
  isExpenseModalOpen: boolean;
  closeExpenseModal: () => void;
  handleExpense: (
    transaction: Omit<Movimentacao, "id">,
  ) => void | Promise<void>;
  expenseCategories: string[];
  editingTransaction: Movimentacao | null;
  closeEdit: () => void;
  handleEdit: (values: TransactionFormValues) => void | Promise<void>;
  allCategories: string[];
  deletingTransaction: Movimentacao | null;
  closeDelete: () => void;
  handleDelete: (transaction: Movimentacao) => void | Promise<void>;
  attachmentTransaction: Movimentacao | null;
  closeAttachment: () => void;
  currentUserId?: string;
  isOwner?: boolean;
}

export function MovimentacoesModals({
  isIncomeModalOpen,
  closeIncomeModal,
  handleIncome,
  incomeCategories,
  isExpenseModalOpen,
  closeExpenseModal,
  handleExpense,
  expenseCategories,
  editingTransaction,
  closeEdit,
  handleEdit,
  allCategories,
  deletingTransaction,
  closeDelete,
  handleDelete,
  attachmentTransaction,
  closeAttachment,
  currentUserId,
  isOwner,
}: MovimentacoesModalsProps) {
  return (
    <AnimatePresence mode="wait">
      {isIncomeModalOpen && (
        <ReceitaModal
          onClose={closeIncomeModal}
          onSubmit={handleIncome}
          categories={incomeCategories}
        />
      )}
      {isExpenseModalOpen && (
        <DespesaModal
          onClose={closeExpenseModal}
          onSubmit={handleExpense}
          categories={expenseCategories}
        />
      )}
      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          onClose={closeEdit}
          onSubmit={handleEdit}
          categories={allCategories}
        />
      )}
      {deletingTransaction && (
        <TransactionDeleteDialog
          transaction={deletingTransaction}
          onClose={closeDelete}
          onConfirm={handleDelete}
        />
      )}
      {attachmentTransaction && (
        <TransactionAttachmentsModal
          transaction={attachmentTransaction}
          onClose={closeAttachment}
          currentUserId={currentUserId ?? ""}
          isOwner={isOwner ?? false}
        />
      )}
    </AnimatePresence>
  );
}
