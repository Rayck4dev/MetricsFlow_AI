"use client";

import { useMemo } from "react";

import { DashboardHeader } from "./DashboardHeader";
import { DashboardCards } from "./DashboardCards";
import { DashboardChart } from "./DashboardChart";
import { DashboardSummary } from "./DashboardSummary";
import { DashboardTransactions } from "./DashboardTransactions";
import { DashboardQuickActions } from "./DashboardQuickActions";

import type { DashboardTransaction } from "./DashboardTransactions";

interface DashboardProps {
  transactions: DashboardTransaction[];

  userName?: string;
  companyName?: string;

  demo?: boolean;

  onAddIncome?: () => void;
  onAddExpense?: () => void;
  onViewFinance?: () => void;
  onViewDre?: () => void;
  onViewAllTransactions?: () => void;
}

export function Dashboard({
  transactions,
  userName = "Carlos",
  companyName = "Carlos Design",
  demo = false,
  onAddIncome,
  onAddExpense,
  onViewFinance,
  onViewDre,
  onViewAllTransactions,
}: DashboardProps) {
  const financialData = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const profit = income - expenses;

    const margin = income > 0 ? (profit / income) * 100 : 0;

    return {
      income,
      expenses,
      profit,
      margin,
    };
  }, [transactions]);

  return (
    <div className="relative space-y-6 pb-10">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[30%] top-0 h-[400px] w-[400px] rounded-full bg-brand-500/[0.035] blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-cpm-accent/[0.025] blur-[120px]" />
      </div>

      <DashboardHeader
        userName={userName}
        companyName={companyName}
        demo={demo}
      />

      <DashboardCards
        income={financialData.income}
        expenses={financialData.expenses}
        profit={financialData.profit}
        margin={financialData.margin}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
        <DashboardChart transactions={transactions} />

        <DashboardSummary
          income={financialData.income}
          expenses={financialData.expenses}
          profit={financialData.profit}
          margin={financialData.margin}
        />
      </div>

      <DashboardTransactions
        transactions={transactions}
        onViewAll={onViewAllTransactions}
      />

      <DashboardQuickActions
        onAddIncome={onAddIncome}
        onAddExpense={onAddExpense}
        onViewFinance={onViewFinance}
        onViewDre={onViewDre}
      />
    </div>
  );
}