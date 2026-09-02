"use client";

import { DreHeader } from "./DreHeader";
import { DreCards } from "./DreCards";
import { DreRevenue } from "./DreRevenue";
import { DreCosts } from "./DreCosts";
import { DreExpenses } from "./DreExpenses";
import { DreResult } from "./DreResult";
import { DreChart } from "./DreChart";
import { DreBreakdown } from "./DreBreakdown";

import { useDre, type DreTransaction } from "@/hooks/useDre";

export interface DreProps {
  transactions: DreTransaction[];
  userName?: string;
  companyName?: string;
  onExport?: () => void;
}

export default function Dre({
  transactions,
  userName,
  companyName,
  onExport,
}: DreProps) {
  const {
    period,
    setPeriod,

    customPeriod,
    changeCustomPeriod,

    financialData,

    revenueItems,
    costItems,
    expenseItems,

    chartData,
  } = useDre(transactions);

  return (
    <div className="relative z-0 min-w-0 space-y-6">
      <DreHeader
        companyName={companyName}
        period={period}
        onPeriodChange={setPeriod}
        customStartDate={customPeriod.startDate}
        customEndDate={customPeriod.endDate}
        onCustomChange={changeCustomPeriod}
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
