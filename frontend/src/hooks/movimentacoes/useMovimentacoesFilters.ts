import { useMemo } from "react";

import type { Movimentacao, PeriodFilter, TransactionType } from "@/types";
import {
  calculateTotals,
  filterTransactions,
  getCategories,
} from "@/utils/movimentacoes.utils";

interface UseMovimentacoesFiltersOptions {
  transactions: Movimentacao[];
  search: string;
  typeFilter: TransactionType;
  categoryFilter: string;
  periodFilter: PeriodFilter;
}

export function useMovimentacoesFilters({
  transactions,
  search,
  typeFilter,
  categoryFilter,
  periodFilter,
}: UseMovimentacoesFiltersOptions) {
  const categories = useMemo(() => getCategories(transactions), [transactions]);

  const filteredTransactions = useMemo(
    () =>
      filterTransactions(transactions, {
        search,
        type: typeFilter,
        category: categoryFilter,
        period: periodFilter,
      }),
    [transactions, search, typeFilter, categoryFilter, periodFilter],
  );

  const totals = useMemo(
    () => calculateTotals(filteredTransactions),
    [filteredTransactions],
  );

  return { categories, filteredTransactions, totals };
}
