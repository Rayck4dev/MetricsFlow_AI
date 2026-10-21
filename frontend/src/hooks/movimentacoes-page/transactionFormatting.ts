import type { Movimentacao } from "@/components/movimentacoes/types";
import type { TransactionQueryRecord } from "./types";

export function formatTransactionDate(date: string): string {
  const transactionDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(transactionDate.getTime())) {
    return date;
  }

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  if (date === todayString) {
    return "Hoje";
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayString = yesterday.toISOString().split("T")[0];

  if (date === yesterdayString) {
    return "Ontem";
  }

  return transactionDate.toLocaleDateString("pt-BR");
}

export function getDatabaseDate(date: string): string {
  const today = new Date();

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  if (date.toLowerCase().startsWith("hoje")) {
    return today.toISOString().split("T")[0];
  }

  if (date.toLowerCase().startsWith("ontem")) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return yesterday.toISOString().split("T")[0];
  }

  const parsed = new Date(date);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return today.toISOString().split("T")[0];
}

export function formatTransactionRecords(records: TransactionQueryRecord[]): {
  databaseDates: Record<string, string>;
  transactions: Movimentacao[];
} {
  const databaseDates: Record<string, string> = {};

  const transactions = records.map((item) => {
    const category = Array.isArray(item.categories)
      ? item.categories[0]
      : item.categories;

    databaseDates[item.id] = item.transaction_date;

    return {
      id: item.id,
      type: item.type,
      amount: Number(item.amount),
      category: category?.name ?? "Sem categoria",
      paymentMethod: item.payment_method,
      description: item.description,
      date: formatTransactionDate(item.transaction_date),
    };
  });

  return { databaseDates, transactions };
}
