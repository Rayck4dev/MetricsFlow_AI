import type {
  DreBreakdownItem,
  DreChartItem,
  DreTransaction,
} from "./types";
import { isCostCategory, parseTransactionDate } from "./date-utils";

export function groupByCategory(
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

export function buildChartData(transactions: DreTransaction[]): DreChartItem[] {
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
    const monthLabel = date.toLocaleDateString("pt-BR", { month: "short" });

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
