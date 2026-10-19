"use client";

import { useMemo, useState } from "react";
import type {
  DreCustomRange,
  DrePeriod,
} from "@/components/dre/DrePeriodSelector";
import type {
  DreFinancialData,
  DreTransaction,
} from "./dre/types";
import {
  getPeriodRange,
  isCostCategory,
  parseTransactionDate,
  toDateInputValue,
} from "./dre/date-utils";
import { buildChartData, groupByCategory } from "./dre/report-data";
import { exportDreCsv } from "./dre/export-csv";

export type {
  DreBreakdownItem,
  DreChartItem,
  DreFinancialData,
  DreTransaction,
} from "./dre/types";

export function useDre(transactions: DreTransaction[]) {
  const [period, setPeriod] = useState<DrePeriod>("month");
  const [customRange, setCustomRange] = useState<DreCustomRange>(() => {
    const today = new Date();
    return {
      start: toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1)),
      end: toDateInputValue(today),
    };
  });

  const periodTransactions = useMemo(() => {
    const { start, end } = getPeriodRange(period, customRange);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return [];
    }

    return transactions.filter((transaction) => {
      const transactionDate = parseTransactionDate(transaction.date);
      return (
        !Number.isNaN(transactionDate.getTime()) &&
        transactionDate >= start &&
        transactionDate <= end
      );
    });
  }, [transactions, period, customRange]);

  const financialData = useMemo<DreFinancialData>(() => {
    const revenue = periodTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
    const costs = periodTransactions
      .filter(
        (item) => item.type === "expense" && isCostCategory(item.category),
      )
      .reduce((sum, item) => sum + item.amount, 0);
    const expenses = periodTransactions
      .filter(
        (item) => item.type === "expense" && !isCostCategory(item.category),
      )
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      revenue,
      costs,
      expenses,
      result: revenue - costs - expenses,
    };
  }, [periodTransactions]);

  const revenueItems = useMemo(
    () =>
      groupByCategory(
        periodTransactions,
        (item) => item.type === "income",
        financialData.revenue,
      ),
    [periodTransactions, financialData.revenue],
  );
  const costItems = useMemo(
    () =>
      groupByCategory(
        periodTransactions,
        (item) => item.type === "expense" && isCostCategory(item.category),
        financialData.costs,
      ),
    [periodTransactions, financialData.costs],
  );
  const expenseItems = useMemo(
    () =>
      groupByCategory(
        periodTransactions,
        (item) => item.type === "expense" && !isCostCategory(item.category),
        financialData.expenses,
      ),
    [periodTransactions, financialData.expenses],
  );
  const chartData = useMemo(
    () => buildChartData(periodTransactions),
    [periodTransactions],
  );

  function exportReport() {
    exportDreCsv({
      period,
      customRange,
      financialData,
      revenueItems,
      costItems,
      expenseItems,
      chartData,
    });
  }

  return {
    period,
    setPeriod,
    customRange,
    setCustomRange,
    periodTransactions,
    financialData,
    revenueItems,
    costItems,
    expenseItems,
    chartData,
    exportDreCsv: exportReport,
  };
}
