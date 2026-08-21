"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { MovimentacoesHeader } from "./MovimentacoesHeader";
import { MovimentacoesCards } from "./MovimentacoesCards";
import { MovimentacoesFilters } from "./MovimentacoesFilters";
import { MovimentacoesSearch } from "./MovimentacoesSearch";
import { MovimentacoesTable } from "./MovimentacoesTable";
import { MovimentacoesActions } from "./MovimentacoesActions";

import { ReceitaModal } from "./ReceitaModal";
import { DespesaModal } from "./DespesaModal";
import { TransactionEditModal } from "./TransactionEditModal";
import { TransactionDeleteDialog } from "./TransactionDeleteDialog";

import type { TransactionFormValues } from "./TransactionForm";

import type { Movimentacao } from "./types";

export interface MovimentacoesProps {
  transactions: Movimentacao[];

  userName?: string;
  companyName?: string;

  onAddIncome?: (transaction: Omit<Movimentacao, "id">) => void | Promise<void>;

  onAddExpense?: (
    transaction: Omit<Movimentacao, "id">,
  ) => void | Promise<void>;

  /**
   * Futuramente:
   * integração direta com Supabase/API.
   */
  onUpdateTransaction?: (
    id: string,
    transaction: Omit<Movimentacao, "id">,
  ) => void | Promise<void>;

  onDeleteTransaction?: (id: string) => void | Promise<void>;
}

export function Movimentacoes({
  transactions,
  userName,
  companyName,
  onAddIncome,
  onAddExpense,
  onUpdateTransaction,
  onDeleteTransaction,
}: MovimentacoesProps) {
  const [search, setSearch] = useState("");

  const [editingTransaction, setEditingTransaction] =
    useState<Movimentacao | null>(null);

  const [deletingTransaction, setDeletingTransaction] =
    useState<Movimentacao | null>(null);

  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all",
  );

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [periodFilter, setPeriodFilter] = useState("all");

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  /*
   * Categorias disponíveis.
   *
   * Futuramente podem vir diretamente da tabela
   * categories do Supabase.
   */
  const categories = useMemo(() => {
    return Array.from(
      new Set(transactions.map((transaction) => transaction.category)),
    ).sort();
  }, [transactions]);

  /*
   * Filtros.
   *
   * Mantemos toda essa lógica no frontend por enquanto.
   *
   * Futuramente isso pode ser movido para uma query
   * paginada no backend/Supabase.
   */
  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return transactions.filter((transaction) => {
      const normalizedDate = transaction.date.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        transaction.description.toLowerCase().includes(normalizedSearch) ||
        transaction.category.toLowerCase().includes(normalizedSearch) ||
        transaction.paymentMethod.toLowerCase().includes(normalizedSearch);

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;

      let matchesPeriod = true;

      if (periodFilter === "today") {
        matchesPeriod = normalizedDate.includes("hoje");
      }

      if (periodFilter === "week") {
        matchesPeriod =
          normalizedDate.includes("hoje") || normalizedDate.includes("ontem");
      }

      /*
       * Mock atual.
       *
       * Quando o backend entrar, o período deverá ser
       * baseado em transaction_date.
       */
      if (periodFilter === "month") {
        matchesPeriod = true;
      }

      return matchesSearch && matchesType && matchesCategory && matchesPeriod;
    });
  }, [transactions, search, typeFilter, categoryFilter, periodFilter]);

  /*
   * Totais dos dados filtrados.
   */
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = filteredTransactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  async function handleIncome(transaction: Omit<Movimentacao, "id">) {
    await onAddIncome?.(transaction);

    setIsIncomeModalOpen(false);
  }

  async function handleExpense(transaction: Omit<Movimentacao, "id">) {
    await onAddExpense?.(transaction);

    setIsExpenseModalOpen(false);
  }

  /*
   * Edição.
   *
   * Atualmente funciona como callback/mock.
   * Quando o Supabase entrar, onUpdateTransaction
   * fará o update real.
   */
  async function handleEdit(id: string, values: TransactionFormValues) {
    const transaction: Omit<Movimentacao, "id"> = {
      type: values.type,
      amount: values.amount,
      category: values.category,
      paymentMethod: values.paymentMethod,
      description: values.description,
      date: values.date,
    };

    await onUpdateTransaction?.(id, transaction);

    setEditingTransaction(null);
  }

  /*
   * Exclusão.
   */
  async function handleDelete(transaction: Movimentacao) {
    await onDeleteTransaction?.(transaction.id);

    setDeletingTransaction(null);
  }

  function handleClearFilters() {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setPeriodFilter("all");
  }

  return (
    <>
      <div className="relative space-y-6">
        <MovimentacoesHeader
          userName={userName}
          companyName={companyName}
          onAddIncome={() => setIsIncomeModalOpen(true)}
          onAddExpense={() => setIsExpenseModalOpen(true)}
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
            relative z-50
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

          <div className="relative z-50 flex flex-col gap-4">
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
                onAddIncome={() => setIsIncomeModalOpen(true)}
                onAddExpense={() => setIsExpenseModalOpen(true)}
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
              onClear={handleClearFilters}
            />
          </div>
        </motion.section>

        <MovimentacoesTable
          transactions={filteredTransactions}
          totalTransactions={transactions.length}
          onEdit={(transaction) => setEditingTransaction(transaction)}
          onDelete={(transaction) => setDeletingTransaction(transaction)}
        />
      </div>

      <AnimatePresence mode="wait">
        {isIncomeModalOpen && (
          <ReceitaModal
            onClose={() => setIsIncomeModalOpen(false)}
            onSubmit={handleIncome}
          />
        )}

        {isExpenseModalOpen && (
          <DespesaModal
            onClose={() => setIsExpenseModalOpen(false)}
            onSubmit={handleExpense}
          />
        )}

        {editingTransaction && (
          <TransactionEditModal
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
            onSubmit={handleEdit}
          />
        )}

        {deletingTransaction && (
          <TransactionDeleteDialog
            transaction={deletingTransaction}
            onClose={() => setDeletingTransaction(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
