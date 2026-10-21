"use client";

import { useState } from "react";

import { MovimentacoesHeader } from "./MovimentacoesHeader";
import { MovimentacoesCards } from "./MovimentacoesCards";
import { MovimentacoesTable } from "./MovimentacoesTable";

import { MovimentacoesModals } from "./movimentacoes/MovimentacoesModals";
import { MovimentacoesFilterPanel } from "./movimentacoes/MovimentacoesFilterPanel";

import { useMovimentacoes } from "@/hooks/useMovimentacoes";

import type { Movimentacao } from "@/types";

interface CategoryOption {
  id: string;
  name: string;
  type: "income" | "expense";
}

export interface MovimentacoesProps {
  transactions: Movimentacao[];
  categories?: CategoryOption[];

  userName?: string;
  companyName?: string;

  currentUserId?: string;
  isOwner?: boolean;

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
  categories: externalCategories = [],
  userName,
  companyName,
  currentUserId,
  isOwner,
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

  const [attachmentTransaction, setAttachmentTransaction] =
    useState<Movimentacao | null>(null);

  function openAttachment(transaction: Movimentacao) {
    setAttachmentTransaction(transaction);
  }

  function closeAttachment() {
    setAttachmentTransaction(null);
  }

  const incomeCategories = externalCategories
    .filter((c) => c.type === "income")
    .map((c) => c.name);

  const expenseCategories = externalCategories
    .filter((c) => c.type === "expense")
    .map((c) => c.name);

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

        <MovimentacoesFilterPanel
          search={search}
          onSearchChange={setSearch}
          onAddIncome={openIncomeModal}
          onAddExpense={openExpenseModal}
          onExport={handleExport}
          type={typeFilter}
          category={categoryFilter}
          period={periodFilter}
          categories={categories}
          onTypeChange={setTypeFilter}
          onCategoryChange={setCategoryFilter}
          onPeriodChange={setPeriodFilter}
          onClear={clearFilters}
        />

        <MovimentacoesTable
          transactions={filteredTransactions}
          totalTransactions={transactions.length}
          onEdit={onUpdateTransaction ? openEdit : undefined}
          onDelete={onDeleteTransaction ? openDelete : undefined}
          onManageAttachment={openAttachment}
        />
      </div>

      <MovimentacoesModals
        isIncomeModalOpen={isIncomeModalOpen}
        closeIncomeModal={closeIncomeModal}
        handleIncome={handleIncome}
        incomeCategories={incomeCategories}
        isExpenseModalOpen={isExpenseModalOpen}
        closeExpenseModal={closeExpenseModal}
        handleExpense={handleExpense}
        expenseCategories={expenseCategories}
        editingTransaction={editingTransaction}
        closeEdit={closeEdit}
        handleEdit={handleEdit}
        allCategories={[...incomeCategories, ...expenseCategories]}
        deletingTransaction={deletingTransaction}
        closeDelete={closeDelete}
        handleDelete={handleDelete}
        attachmentTransaction={attachmentTransaction}
        closeAttachment={closeAttachment}
        currentUserId={currentUserId}
        isOwner={isOwner}
      />
    </>
  );
}
