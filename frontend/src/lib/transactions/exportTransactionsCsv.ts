import type { Movimentacao } from "@/components/movimentacoes/types";
import { getPaymentMethodLabel } from "@/constants/transaction.constants";

function escapeCsvValue(value: string | number | null | undefined) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function formatExportDate(date: string | undefined) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("pt-BR");
}

export function exportTransactionsCsv(
  transactions: Movimentacao[],
  transactionDatabaseDates: Record<string, string>,
) {
  if (!transactions.length) {
    return;
  }

  const headers = [
    "Data",
    "Tipo",
    "Descrição",
    "Categoria",
    "Forma de pagamento",
    "Valor",
  ];
  const rows = transactions.map((transaction) => [
    escapeCsvValue(formatExportDate(transactionDatabaseDates[transaction.id])),
    escapeCsvValue(transaction.type === "income" ? "Receita" : "Despesa"),
    escapeCsvValue(transaction.description),
    escapeCsvValue(transaction.category),
    escapeCsvValue(getPaymentMethodLabel(transaction.paymentMethod)),
    escapeCsvValue(
      transaction.amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ),
  ]);
  const csv = [
    headers.map(escapeCsvValue).join(";"),
    ...rows.map((row) => row.join(";")),
  ].join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  link.href = url;
  link.download = `metricsflow-movimentacoes-${year}-${month}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
