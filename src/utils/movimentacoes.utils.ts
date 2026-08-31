import type {
  Movimentacao,
  MovimentacoesFiltersState,
  MovimentacoesTotals,
} from "../types";

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

  return transactions.filter((transaction) => {
    const normalizedDate = transaction.date.toLowerCase();

    const matchesSearch =
      !normalizedSearch ||
      transaction.description.toLowerCase().includes(normalizedSearch) ||
      transaction.category.toLowerCase().includes(normalizedSearch) ||
      transaction.paymentMethod.toLowerCase().includes(normalizedSearch);

    const matchesType =
      filters.type === "all" || transaction.type === filters.type;

    const matchesCategory =
      filters.category === "all" || transaction.category === filters.category;

    const matchesPeriod = matchesPeriodFilter(normalizedDate, filters.period);

    return matchesSearch && matchesType && matchesCategory && matchesPeriod;
  });
}

function matchesPeriodFilter(
  date: string,
  period: MovimentacoesFiltersState["period"],
): boolean {
  switch (period) {
    case "today":
      return date.includes("hoje");

    case "week":
      return date.includes("hoje") || date.includes("ontem");

    case "month":
      return true;

    case "all":
    default:
      return true;
  }
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
