"use client";

import { AnimatePresence, motion } from "framer-motion";

import { MovimentacoesHeader } from "./MovimentacoesHeader";
import { MovimentacoesCards } from "./MovimentacoesCards";
import { MovimentacoesFilters } from "./MovimentacoesFilters";
import { MovimentacoesSearch } from "./MovimentacoesSearch";
import { MovimentacoesTable } from "./MovimentacoesTable";
import { MovimentacoesActions } from "./MovimentacoesActions";

import { ReceitaModal } from "./ReceitaModal";
import { DespesaModal } from "./DespesaModal";
import { TransactionEditModal } from "./transactions/TransactionEditModal";
import { TransactionDeleteDialog } from "./transactions/TransactionDeleteDialog";

import { useMovimentacoes } from "@/hooks/useMovimentacoes";

import type { Movimentacao } from "@/types";

export interface MovimentacoesProps {
  transactions: Movimentacao[];

  userName?: string;
  companyName?: string;

  onAddIncome?: (transaction: Omit<Movimentacao, "id">) => void | Promise<void>;

  onAddExpense?: (
    transaction: Omit<Movimentacao, "id">,
  ) => void | Promise<void>;

  onUpdateTransaction?: (
    id: string,
    transaction: Omit<Movimentacao, "id">,
  ) => void | Promise<void>;

  onDeleteTransaction?: (id: string) => void | Promise<void>;

  onExport?: (transactions: Movimentacao[]) => void;
}

export function Movimentacoes({
  transactions,
  userName,
  companyName,
  onAddIncome,
  onAddExpense,
  onUpdateTransaction,
  onDeleteTransaction,
  onExport,
}: MovimentacoesProps) {
  const {
    search,
    setSearch,

    typeFilter,
    setTypeFilter,

    categoryFilter,
    setCategoryFilter,

    periodFilter,
    setPeriodFilter,

    clearFilters,

    categories,
    filteredTransactions,
    totals,

    editingTransaction,
    openEdit,
    closeEdit,

    deletingTransaction,
    openDelete,
    closeDelete,

    isIncomeModalOpen,
    openIncomeModal,
    closeIncomeModal,

    isExpenseModalOpen,
    openExpenseModal,
    closeExpenseModal,

    handleIncome,
    handleExpense,
    handleEdit,
    handleDelete,
  } = useMovimentacoes({
    transactions,
    onAddIncome,
    onAddExpense,
    onUpdateTransaction,
    onDeleteTransaction,
  });

  function handleExport() {
    onExport?.(filteredTransactions);
  }

  return (
    <>
      <div className="relative space-y-6">
        <MovimentacoesHeader
          userName={userName}
          companyName={companyName}
          onAddIncome={openIncomeModal}
          onAddExpense={openExpenseModal}
        />

        <MovimentacoesCards
          income={totals.income}
          expenses={totals.expenses}
          balance={totals.balance}
          count={totals.count}
        />

        <motion.section
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.45,
          }}
          className="
            relative
            overflow-visible
            rounded-2xl
            border border-surface-border
            bg-surface-panel/80
            p-4
            shadow-xl shadow-black/10
            backdrop-blur-xl
            sm:p-5
          "
        >
          <div
            className="
              pointer-events-none
              absolute -right-24 -top-24
              h-48 w-48
              rounded-full
              bg-brand-500/[0.06]
              blur-3xl
            "
          />

          <div className="relative flex flex-col gap-4">
            <div
              className="
                flex flex-col gap-3
                xl:flex-row
                xl:items-center
                xl:justify-between
              "
            >
              <MovimentacoesSearch value={search} onChange={setSearch} />

              <MovimentacoesActions
                onAddIncome={openIncomeModal}
                onAddExpense={openExpenseModal}
                onExport={handleExport}
              />
            </div>

            <MovimentacoesFilters
              type={typeFilter}
              category={categoryFilter}
              period={periodFilter}
              categories={categories}
              onTypeChange={setTypeFilter}
              onCategoryChange={setCategoryFilter}
              onPeriodChange={setPeriodFilter}
              onClear={clearFilters}
            />
          </div>
        </motion.section>

        <MovimentacoesTable
          transactions={filteredTransactions}
          totalTransactions={transactions.length}
          onEdit={onUpdateTransaction ? openEdit : undefined}
          onDelete={onDeleteTransaction ? openDelete : undefined}
        />
      </div>

      <AnimatePresence mode="wait">
        {isIncomeModalOpen && (
          <ReceitaModal
            onClose={closeIncomeModal}
            onSubmit={handleIncome}
            categories={categories}
          />
        )}

        {isExpenseModalOpen && (
          <DespesaModal
            onClose={closeExpenseModal}
            onSubmit={handleExpense}
            categories={categories}
          />
        )}

        {editingTransaction && (
          <TransactionEditModal
            transaction={editingTransaction}
            onClose={closeEdit}
            onSubmit={handleEdit}
            categories={categories}
          />
        )}

        {deletingTransaction && (
          <TransactionDeleteDialog
            transaction={deletingTransaction}
            onClose={closeDelete}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
