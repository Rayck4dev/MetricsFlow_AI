"use client";

import { useMemo, useState } from "react";

import type { DrePeriod } from "@/components/dre/DrePeriodSelector";

export interface DreTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

export interface DreFinancialData {
  revenue: number;
  costs: number;
  expenses: number;
  result: number;
}

export interface DreBreakdownItem {
  label: string;
  value: number;
  percentage: number;
}

export interface DreChartItem {
  month: string;
  revenue: number;
  costs: number;
  expenses: number;
  result: number;
}

export interface DreCustomPeriod {
  startDate: string;
  endDate: string;
}

const COST_CATEGORIES = ["Fornecedores", "Fornecedores / Estoque"];

function isCostCategory(category: string) {
  return COST_CATEGORIES.includes(category);
}

function startOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
}

function startOfWeek(date: Date) {
  const result = new Date(date);

  const day = result.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);

  return result;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function startOfQuarter(date: Date) {
  const quarterStartMonth = Math.floor(date.getMonth() / 3) * 3;

  return new Date(date.getFullYear(), quarterStartMonth, 1);
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date: Date) {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function parseTransactionDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function parseInputDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getPeriodRange(period: DrePeriod, customPeriod?: DreCustomPeriod) {
  const now = new Date();

  if (period === "year") {
    return {
      start: startOfYear(now),
      end: endOfYear(now),
    };
  }


  if (period.startsWith("year-")) {
    const year = Number(period.replace("year-", ""));

    if (!Number.isNaN(year)) {
      return {
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31, 23, 59, 59, 999),
      };
    }
  }

  switch (period) {
    case "today":
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };

    case "week":
      return {
        start: startOfWeek(now),
        end: endOfDay(now),
      };

    case "month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };

    case "last-month": {
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      return {
        start: startOfMonth(previousMonth),
        end: endOfMonth(previousMonth),
      };
    }

    case "quarter":
      return {
        start: startOfQuarter(now),
        end: endOfDay(now),
      };

    case "custom": {
      if (customPeriod?.startDate && customPeriod?.endDate) {
        const start = startOfDay(parseInputDate(customPeriod.startDate));

        const end = endOfDay(parseInputDate(customPeriod.endDate));

        return {
          start,
          end,
        };
      }


      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    }

    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
  }
}

function groupByCategory(
  transactions: DreTransaction[],
  filter: (transaction: DreTransaction) => boolean,
  total: number,
): DreBreakdownItem[] {
  const grouped = new Map<string, number>();

  transactions.filter(filter).forEach((transaction) => {
    grouped.set(
      transaction.category,
      (grouped.get(transaction.category) ?? 0) + transaction.amount,
    );
  });

  return Array.from(grouped.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
    }));
}

function buildChartData(transactions: DreTransaction[]): DreChartItem[] {
  const grouped = new Map<
    string,
    {
      month: string;
      sortKey: string;
      revenue: number;
      costs: number;
      expenses: number;
      result: number;
    }
  >();

  transactions.forEach((transaction) => {
    const date = parseTransactionDate(transaction.date);

    const year = date.getFullYear();
    const month = date.getMonth();

    const sortKey = `${year}-${String(month + 1).padStart(2, "0")}`;

    const monthLabel = date.toLocaleDateString("pt-BR", {
      month: "short",
    });

    const existing = grouped.get(sortKey) ?? {
      month: `${monthLabel.replace(".", "")}/${year}`,
      sortKey,
      revenue: 0,
      costs: 0,
      expenses: 0,
      result: 0,
    };

    if (transaction.type === "income") {
      existing.revenue += transaction.amount;
    } else if (isCostCategory(transaction.category)) {
      existing.costs += transaction.amount;
    } else {
      existing.expenses += transaction.amount;
    }

    existing.result = existing.revenue - existing.costs - existing.expenses;

    grouped.set(sortKey, existing);
  });

  return Array.from(grouped.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ month, revenue, costs, expenses, result }) => ({
      month,
      revenue,
      costs,
      expenses,
      result,
    }));
}

export function useDre(transactions: DreTransaction[]) {
  const [period, setPeriod] = useState<DrePeriod>("month");

  const [customPeriod, setCustomPeriod] = useState<DreCustomPeriod>({
    startDate: "",
    endDate: "",
  });

  const periodTransactions = useMemo(() => {
    const { start, end } = getPeriodRange(period, customPeriod);

    return transactions.filter((transaction) => {
      const transactionDate = parseTransactionDate(transaction.date);

      return transactionDate >= start && transactionDate <= end;
    });
  }, [transactions, period, customPeriod]);

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

    const result = revenue - costs - expenses;

    return {
      revenue,
      costs,
      expenses,
      result,
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

  function changePeriod(nextPeriod: DrePeriod) {
    setPeriod(nextPeriod);
  }

  function changeCustomPeriod(startDate: string, endDate: string) {
    setCustomPeriod({
      startDate,
      endDate,
    });

    setPeriod("custom");
  }

  return {
    period,
    setPeriod: changePeriod,

    customPeriod,
    setCustomPeriod,
    changeCustomPeriod,

    periodTransactions,

    financialData,

    revenueItems,
    costItems,
    expenseItems,

    chartData,
  };
}
