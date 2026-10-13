import type {
  Movimentacao,
  MovimentacoesFiltersState,
  MovimentacoesTotals,
} from "../types";

function parseTransactionDate(date: string): Date | null {
  if (!date) return null;

  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoDate) {
    const [, year, month, day] = isoDate;

    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const brDate = date.match(/^(\d{2})\/(\d{2})\/(\d{4})/);

  if (brDate) {
    const [, day, month, year] = brDate;

    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function isSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function matchesPeriodFilter(
  date: string,
  period: MovimentacoesFiltersState["period"],
): boolean {
  if (period === "all") return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let transactionDate: Date | null;

  if (date.trim().toLowerCase() === "hoje") {
    transactionDate = new Date(today);
  } else if (date.trim().toLowerCase() === "ontem") {
    transactionDate = new Date(yesterday);
  } else {
    transactionDate = parseTransactionDate(date);
  }

  if (!transactionDate) return false;

  transactionDate.setHours(0, 0, 0, 0);

  switch (period) {
    case "today":
      return isSameDay(transactionDate, today);

    case "week": {
      const startOfWeek = new Date(today);
      const daysSinceMonday = (startOfWeek.getDay() + 6) % 7;

      startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      return transactionDate >= startOfWeek && transactionDate < endOfWeek;
    }

    case "month": {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const startOfNextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1,
      );

      return (
        transactionDate >= startOfMonth && transactionDate < startOfNextMonth
      );
    }

    default:
      return true;
  }
}

export function getCategories(transactions: Movimentacao[]): string[] {
  return Array.from(
    new Set(transactions.map((transaction) => transaction.category)),
  ).sort();
}

export function filterTransactions(
  transactions: Movimentacao[],
  filters: MovimentacoesFiltersState,
): Movimentacao[] {
  const normalizedSearch = filters.search.toLowerCase().trim();

  const filtered = transactions.filter((transaction) => {
    const matchesSearch =
      !normalizedSearch ||
      transaction.description.toLowerCase().includes(normalizedSearch) ||
      transaction.category.toLowerCase().includes(normalizedSearch) ||
      transaction.paymentMethod.toLowerCase().includes(normalizedSearch);

    const matchesType =
      filters.type === "all" || transaction.type === filters.type;

    const matchesCategory =
      filters.category === "all" || transaction.category === filters.category;

    const matchesPeriod = matchesPeriodFilter(transaction.date, filters.period);

    return matchesSearch && matchesType && matchesCategory && matchesPeriod;
  });

  return filtered;
}

export function calculateTotals(
  transactions: Movimentacao[],
): MovimentacoesTotals {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
    count: transactions.length,
  };
}
