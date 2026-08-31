import { useMemo, useState } from "react";

import type { Movimentacao, PeriodFilter, TransactionType } from "@/types";

import {
  calculateTotals,
  filterTransactions,
  getCategories,
} from "@/utils/movimentacoes.utils";

import type { TransactionFormValues } from "@/components/movimentacoes/transactions/TransactionForm";

interface UseMovimentacoesOptions {
  transactions: Movimentacao[];

  onAddIncome?: (transaction: Omit<Movimentacao, "id">) => void | Promise<void>;

  onAddExpense?: (
    transaction: Omit<Movimentacao, "id">,
  ) => void | Promise<void>;

  onUpdateTransaction?: (
    id: string,
    transaction: Omit<Movimentacao, "id">,
  ) => void | Promise<void>;

  onDeleteTransaction?: (id: string) => void | Promise<void>;
}

export function useMovimentacoes({
  transactions,
  onAddIncome,
  onAddExpense,
  onUpdateTransaction,
  onDeleteTransaction,
}: UseMovimentacoesOptions) {
  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState<TransactionType>("all");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");

  const [editingTransaction, setEditingTransaction] =
    useState<Movimentacao | null>(null);

  const [deletingTransaction, setDeletingTransaction] =
    useState<Movimentacao | null>(null);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const categories = useMemo(() => {
    return getCategories(transactions);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, {
      search,
      type: typeFilter,
      category: categoryFilter,
      period: periodFilter,
    });
  }, [transactions, search, typeFilter, categoryFilter, periodFilter]);

  const totals = useMemo(() => {
    return calculateTotals(filteredTransactions);
  }, [filteredTransactions]);

  function clearFilters() {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setPeriodFilter("all");
  }

  function openIncomeModal() {
    setIsIncomeModalOpen(true);
  }

  function closeIncomeModal() {
    setIsIncomeModalOpen(false);
  }

  function openExpenseModal() {
    setIsExpenseModalOpen(true);
  }

  function closeExpenseModal() {
    setIsExpenseModalOpen(false);
  }

  function openEdit(transaction: Movimentacao) {
    setEditingTransaction(transaction);
  }

  function closeEdit() {
    setEditingTransaction(null);
  }

  function openDelete(transaction: Movimentacao) {
    setDeletingTransaction(transaction);
  }

  function closeDelete() {
    setDeletingTransaction(null);
  }

  async function handleIncome(values: TransactionFormValues) {
    const transaction: Omit<Movimentacao, "id"> = {
      type: "income",
      amount: values.amount,
      description: values.description,
      category: values.category,
      paymentMethod: values.paymentMethod,
      date: values.date,
    };

    await onAddIncome?.(transaction);

    closeIncomeModal();
  }

  async function handleExpense(values: TransactionFormValues) {
    const transaction: Omit<Movimentacao, "id"> = {
      type: "expense",
      amount: values.amount,
      description: values.description,
      category: values.category,
      paymentMethod: values.paymentMethod,
      date: values.date,
    };

    await onAddExpense?.(transaction);

    closeExpenseModal();
  }

  async function handleEdit(values: TransactionFormValues) {
    if (!editingTransaction) {
      return;
    }

    const transaction: Omit<Movimentacao, "id"> = {
      type: values.type,
      amount: values.amount,
      description: values.description,
      category: values.category,
      paymentMethod: values.paymentMethod,
      date: values.date,
    };

    await onUpdateTransaction?.(editingTransaction.id, transaction);

    closeEdit();
  }

  async function handleDelete(transaction: Movimentacao) {
    await onDeleteTransaction?.(transaction.id);

    closeDelete();
  }

  return {
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
  };
}
