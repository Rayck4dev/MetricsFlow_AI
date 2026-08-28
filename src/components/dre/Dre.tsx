"use client";

import { useMemo, useState } from "react";

import { DreHeader } from "./DreHeader";
import { DreCards } from "./DreCards";
import { DreRevenue } from "./DreRevenue";
import { DreCosts } from "./DreCosts";
import { DreExpenses } from "./DreExpenses";
import { DreResult } from "./DreResult";
import { DreChart } from "./DreChart";
import { DreBreakdown } from "./DreBreakdown";

import type { DrePeriod } from "./DrePeriodSelector";

export interface DreTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

export interface DreProps {
  transactions: DreTransaction[];
  userName?: string;
  companyName?: string;
  onExport?: () => void;
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

function parseTransactionDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getPeriodRange(period: DrePeriod) {
  const now = new Date();

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

    case "year":
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      };

    case "custom":

      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };

    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
  }
}

export function Dre({
  transactions,
  userName,
  companyName,
  onExport,
}: DreProps) {
  const [period, setPeriod] = useState<DrePeriod>("month");

  const periodTransactions = useMemo(() => {
    const { start, end } = getPeriodRange(period);

    return transactions.filter((transaction) => {
      const transactionDate = parseTransactionDate(transaction.date);

      return transactionDate >= start && transactionDate <= end;
    });
  }, [transactions, period]);

  const financialData = useMemo(() => {
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

  const revenueItems = useMemo(() => {
    const total = financialData.revenue;

    const grouped = new Map<string, number>();

    periodTransactions
      .filter((item) => item.type === "income")
      .forEach((item) => {
        grouped.set(
          item.category,
          (grouped.get(item.category) ?? 0) + item.amount,
        );
      });

    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({
        label,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }));
  }, [periodTransactions, financialData.revenue]);

  const costItems = useMemo(() => {
    const total = financialData.costs;

    const grouped = new Map<string, number>();

    periodTransactions
      .filter(
        (item) => item.type === "expense" && isCostCategory(item.category),
      )
      .forEach((item) => {
        grouped.set(
          item.category,
          (grouped.get(item.category) ?? 0) + item.amount,
        );
      });

    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({
        label,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }));
  }, [periodTransactions, financialData.costs]);

  const expenseItems = useMemo(() => {
    const total = financialData.expenses;

    const grouped = new Map<string, number>();

    periodTransactions
      .filter(
        (item) => item.type === "expense" && !isCostCategory(item.category),
      )
      .forEach((item) => {
        grouped.set(
          item.category,
          (grouped.get(item.category) ?? 0) + item.amount,
        );
      });

    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({
        label,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }));
  }, [periodTransactions, financialData.expenses]);

  const chartData = useMemo(() => {
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

    periodTransactions.forEach((transaction) => {
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
  }, [periodTransactions]);

  return (
    <div className="relative z-0 min-w-0 space-y-6">
      <DreHeader
        companyName={companyName}
        period={period}
        onPeriodChange={setPeriod}
        onExport={onExport}
      />

      <DreCards
        revenue={financialData.revenue}
        costs={financialData.costs}
        expenses={financialData.expenses}
        result={financialData.result}
      />

      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <DreRevenue revenue={financialData.revenue} items={revenueItems} />

        <DreCosts total={financialData.costs} items={costItems} />
      </div>

      <DreExpenses total={financialData.expenses} items={expenseItems} />

      <DreResult
        revenue={financialData.revenue}
        costs={financialData.costs}
        expenses={financialData.expenses}
      />

      <DreChart data={chartData} />

      <DreBreakdown
        revenue={financialData.revenue}
        costs={financialData.costs}
        expenses={financialData.expenses}
        result={financialData.result}
      />
    </div>
  );
}
