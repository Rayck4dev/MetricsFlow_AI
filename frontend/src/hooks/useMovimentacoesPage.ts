"use client";

import { useCallback, useState } from "react";

import type { Movimentacao } from "@/components/movimentacoes/types";
import type { ToastType } from "@/components/ui/Toast";

import { useCompanyRole } from "@/hooks/useCompanyRole";
import { exportTransactionsCsv as exportCsv } from "@/lib/transactions/exportTransactionsCsv";
import { createClient } from "@/lib/supabase/client";

import { getDatabaseDate } from "./movimentacoes-page/transactionFormatting";
import type { ToastState } from "./movimentacoes-page/types";
import { useMovimentacoesPageActions } from "./movimentacoes-page/useMovimentacoesPageActions";
import { useMovimentacoesPageData } from "./movimentacoes-page/useMovimentacoesPageData";

export function useMovimentacoesPage() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    type: "success",
    title: "",
  });

  const { role, loading: roleLoading } = useCompanyRole();
  const isOwner = role === "owner";
  const supabase = createClient();
  const pageData = useMovimentacoesPageData(supabase);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      setToast({ open: true, type, title, message });
    },
    [],
  );

  const closeToast = useCallback(() => {
    setToast((current) => ({ ...current, open: false }));
  }, []);

  const exportTransactionsCsv = useCallback(
    (transactionsToExport: Movimentacao[]) =>
      exportCsv(transactionsToExport, pageData.transactionDatabaseDates),
    [pageData.transactionDatabaseDates],
  );

  const actions = useMovimentacoesPageActions({
    supabase,
    companyId: pageData.companyId,
    categories: pageData.categories,
    getDatabaseDate,
    loadTransactions: pageData.loadTransactions,
    showToast,
  });

  return {
    transactions: pageData.transactions,
    userName: pageData.userName,
    companyName: pageData.companyName,
    companyId: pageData.companyId,
    categories: pageData.categories,
    loading: pageData.loading,
    roleLoading,
    role,
    isOwner,

    loadCompany: pageData.loadCompany,
    loadCategories: pageData.loadCategories,
    loadTransactions: pageData.loadTransactions,

    exportTransactionsCsv,

    handleAddTransaction: actions.handleAddTransaction,
    handleUpdateTransaction: actions.handleUpdateTransaction,
    handleDeleteTransaction: actions.handleDeleteTransaction,

    toast,
    closeToast,

    currentUserId: pageData.currentUserId,
  };
}
