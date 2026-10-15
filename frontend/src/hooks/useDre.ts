"use client";

import { useMemo, useState } from "react";

import type {
  DreCustomRange,
  DrePeriod,
} from "@/components/dre/DrePeriodSelector";

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

function startOfLastThreeMonths(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() - 2, 1);
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date: Date) {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseTransactionDate(date: string) {
  if (!date || typeof date !== "string") {
    return new Date(NaN);
  }

  const datePart = date.slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);

  if (!match) {
    return new Date(NaN);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const maxDay = new Date(year, month, 0).getDate();

  if (!year || month < 1 || month > 12 || day < 1 || day > maxDay) {
    return new Date(NaN);
  }

  return new Date(year, month - 1, day);
}

function getPeriodRange(period: DrePeriod, customRange: DreCustomRange) {
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
        start: startOfLastThreeMonths(now),
        end: endOfDay(now),
      };

    case "year":
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      };

    case "custom": {
      const customStart = parseTransactionDate(customRange.start);
      const customEnd = parseTransactionDate(customRange.end);

      if (
        Number.isNaN(customStart.getTime()) ||
        Number.isNaN(customEnd.getTime()) ||
        customStart > customEnd
      ) {
        return {
          start: new Date(NaN),
          end: new Date(NaN),
        };
      }

      return {
        start: startOfDay(customStart),
        end: endOfDay(customEnd),
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

    if (Number.isNaN(date.getTime())) {
      return;
    }

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

function formatDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("pt-BR");
}

function getPeriodLabel(period: DrePeriod, customRange: DreCustomRange) {
  const now = new Date();

  switch (period) {
    case "today":
      return now.toLocaleDateString("pt-BR");

    case "week":
      return `Semana de ${formatDate(startOfWeek(now))} a ${formatDate(now)}`;

    case "month":
      return now.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });

    case "last-month": {
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      return previousMonth.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
    }

    case "quarter":
      return `${formatDate(startOfLastThreeMonths(now))} a ${formatDate(now)}`;

    case "year":
      return String(now.getFullYear());

    case "custom": {
      const start = parseTransactionDate(customRange.start);
      const end = parseTransactionDate(customRange.end);

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        start > end
      ) {
        return "Período personalizado inválido";
      }

      return `${formatDate(start)} a ${formatDate(end)}`;
    }

    default:
      return "";
  }
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercentage(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function escapeCsvValue(value: string | number | null | undefined) {
  const normalized = String(value ?? "");

  return `"${normalized.replace(/"/g, '""')}"`;
}

export function useDre(transactions: DreTransaction[]) {
  const [period, setPeriod] = useState<DrePeriod>("month");

  const [customRange, setCustomRange] = useState<DreCustomRange>(() => {
    const today = new Date();

    return {
      start: toDateInputValue(startOfMonth(today)),
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

  const exportDreCsv = () => {
    const margin =
      financialData.revenue > 0
        ? (financialData.result / financialData.revenue) * 100
        : 0;

    const periodLabel = getPeriodLabel(period, customRange);

    const lines: string[] = [];

    lines.push(
      [
        escapeCsvValue("Seção"),
        escapeCsvValue("Item"),
        escapeCsvValue("Valor"),
        escapeCsvValue("Percentual"),
      ].join(";"),
    );

    lines.push(
      [
        escapeCsvValue("Relatório"),
        escapeCsvValue("MetricsFlow AI - DRE"),
        escapeCsvValue(""),
        escapeCsvValue(""),
      ].join(";"),
    );

    lines.push(
      [
        escapeCsvValue("Relatório"),
        escapeCsvValue("Período"),
        escapeCsvValue(periodLabel),
        escapeCsvValue(""),
      ].join(";"),
    );

    lines.push(
      [
        escapeCsvValue("Indicadores"),
        escapeCsvValue("Receita Bruta"),
        escapeCsvValue(`R$ ${formatCurrency(financialData.revenue)}`),
        escapeCsvValue(""),
      ].join(";"),
    );

    lines.push(
      [
        escapeCsvValue("Indicadores"),
        escapeCsvValue("Custos"),
        escapeCsvValue(`R$ ${formatCurrency(financialData.costs)}`),
        escapeCsvValue(""),
      ].join(";"),
    );

    lines.push(
      [
        escapeCsvValue("Indicadores"),
        escapeCsvValue("Despesas"),
        escapeCsvValue(`R$ ${formatCurrency(financialData.expenses)}`),
        escapeCsvValue(""),
      ].join(";"),
    );

    lines.push(
      [
        escapeCsvValue("Indicadores"),
        escapeCsvValue("Resultado"),
        escapeCsvValue(`R$ ${formatCurrency(financialData.result)}`),
        escapeCsvValue(""),
      ].join(";"),
    );

    lines.push(
      [
        escapeCsvValue("Indicadores"),
        escapeCsvValue("Margem"),
        escapeCsvValue(`${formatPercentage(margin)}%`),
        escapeCsvValue(""),
      ].join(";"),
    );

    function addBreakdownRows(section: string, items: DreBreakdownItem[]) {
      if (!items.length) {
        lines.push(
          [
            escapeCsvValue(section),
            escapeCsvValue("Nenhum registro"),
            escapeCsvValue("R$ 0,00"),
            escapeCsvValue("0,00%"),
          ].join(";"),
        );

        return;
      }

      items.forEach((item) => {
        lines.push(
          [
            escapeCsvValue(section),
            escapeCsvValue(item.label),
            escapeCsvValue(`R$ ${formatCurrency(item.value)}`),
            escapeCsvValue(`${formatPercentage(item.percentage)}%`),
          ].join(";"),
        );
      });
    }

    addBreakdownRows("Receitas", revenueItems);
    addBreakdownRows("Custos", costItems);
    addBreakdownRows("Despesas", expenseItems);

    if (!chartData.length) {
      lines.push(
        [
          escapeCsvValue("Evolução mensal"),
          escapeCsvValue("Nenhum registro"),
          escapeCsvValue("R$ 0,00"),
          escapeCsvValue(""),
        ].join(";"),
      );
    } else {
      chartData.forEach((item) => {
        lines.push(
          [
            escapeCsvValue("Evolução mensal"),
            escapeCsvValue(item.month),
            escapeCsvValue(`R$ ${formatCurrency(item.result)}`),
            escapeCsvValue(""),
          ].join(";"),
        );
      });
    }

    const csv = lines.join("\r\n");
    const csvWithBom = `\uFEFF${csv}`;

    const blob = new Blob([csvWithBom], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    link.href = url;
    link.download = `metricsflow-dre-${year}-${month}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

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

    exportDreCsv,
  };
}
