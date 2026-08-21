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

export interface DreTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

interface DreProps {
  transactions: DreTransaction[];
  userName?: string;
  companyName?: string;
}

export function Dre({ transactions, userName, companyName }: DreProps) {
  const [period, setPeriod] = useState("month");

  const financialData = useMemo(() => {
    const revenue = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const costs = transactions
      .filter(
        (item) =>
          item.type === "expense" &&
          ["Fornecedores", "Fornecedores / Estoque"].includes(item.category),
      )
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions
      .filter(
        (item) =>
          item.type === "expense" &&
          !["Fornecedores", "Fornecedores / Estoque"].includes(item.category),
      )
      .reduce((sum, item) => sum + item.amount, 0);

    const result = revenue - costs - expenses;

    return {
      revenue,
      costs,
      expenses,
      result,
    };
  }, [transactions]);

  const revenueItems = useMemo(() => {
    const total = financialData.revenue || 1;

    const grouped = new Map<string, number>();

    transactions
      .filter((item) => item.type === "income")
      .forEach((item) => {
        grouped.set(
          item.category,
          (grouped.get(item.category) ?? 0) + item.amount,
        );
      });

    return Array.from(grouped.entries()).map(([label, value]) => ({
      label,
      value,
      percentage: (value / total) * 100,
    }));
  }, [transactions, financialData.revenue]);

  const costItems = useMemo(() => {
    const total = financialData.costs || 1;

    const grouped = new Map<string, number>();

    transactions
      .filter(
        (item) =>
          item.type === "expense" &&
          ["Fornecedores", "Fornecedores / Estoque"].includes(item.category),
      )
      .forEach((item) => {
        grouped.set(
          item.category,
          (grouped.get(item.category) ?? 0) + item.amount,
        );
      });

    return Array.from(grouped.entries()).map(([label, value]) => ({
      label,
      value,
      percentage: (value / total) * 100,
    }));
  }, [transactions, financialData.costs]);

  const expenseItems = useMemo(() => {
    const total = financialData.expenses || 1;

    const grouped = new Map<string, number>();

    transactions
      .filter(
        (item) =>
          item.type === "expense" &&
          !["Fornecedores", "Fornecedores / Estoque"].includes(item.category),
      )
      .forEach((item) => {
        grouped.set(
          item.category,
          (grouped.get(item.category) ?? 0) + item.amount,
        );
      });

    return Array.from(grouped.entries()).map(([label, value]) => ({
      label,
      value,
      percentage: (value / total) * 100,
    }));
  }, [transactions, financialData.expenses]);

  const chartData = useMemo(
    () => [
      {
        month: "Mar",
        revenue: financialData.revenue * 0.68,
        costs: financialData.costs * 0.72,
        expenses: financialData.expenses * 0.65,
        result:
          financialData.revenue * 0.68 -
          financialData.costs * 0.72 -
          financialData.expenses * 0.65,
      },
      {
        month: "Abr",
        revenue: financialData.revenue * 0.74,
        costs: financialData.costs * 0.8,
        expenses: financialData.expenses * 0.76,
        result:
          financialData.revenue * 0.74 -
          financialData.costs * 0.8 -
          financialData.expenses * 0.76,
      },
      {
        month: "Mai",
        revenue: financialData.revenue * 0.81,
        costs: financialData.costs * 0.86,
        expenses: financialData.expenses * 0.82,
        result:
          financialData.revenue * 0.81 -
          financialData.costs * 0.86 -
          financialData.expenses * 0.82,
      },
      {
        month: "Jun",
        revenue: financialData.revenue * 0.88,
        costs: financialData.costs * 0.9,
        expenses: financialData.expenses * 0.91,
        result:
          financialData.revenue * 0.88 -
          financialData.costs * 0.9 -
          financialData.expenses * 0.91,
      },
      {
        month: "Jul",
        revenue: financialData.revenue * 0.94,
        costs: financialData.costs * 0.95,
        expenses: financialData.expenses * 0.96,
        result:
          financialData.revenue * 0.94 -
          financialData.costs * 0.95 -
          financialData.expenses * 0.96,
      },
      {
        month: "Ago",
        revenue: financialData.revenue,
        costs: financialData.costs,
        expenses: financialData.expenses,
        result: financialData.result,
      },
    ],
    [financialData],
  );

  return (
    <div className="space-y-6">
      <DreHeader period={period} onPeriodChange={setPeriod} />

      <DreCards
        revenue={financialData.revenue}
        costs={financialData.costs}
        expenses={financialData.expenses}
        result={financialData.result}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <DreRevenue revenue={financialData.revenue} items={revenueItems} />

        <DreCosts total={financialData.costs} items={costItems} />
      </div>

      <DreExpenses total={financialData.expenses} items={expenseItems} />

      <DreResult
        revenue={financialData.revenue}
        costs={financialData.costs}
        expenses={financialData.expenses}
        result={financialData.result}
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
