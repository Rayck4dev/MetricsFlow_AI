export function formatTransactionDate(date: string) {
  if (!date) {
    return "";
  }

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

  return transactionDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function formatPaymentMethod(paymentMethod: string) {
  const methods: Record<string, string> = {
    pix: "Pix",
    credit_card: "Cartão de crédito",
    debit_card: "Cartão de débito",
    bank_slip: "Boleto",
    cash: "Dinheiro",
    transfer: "Transferência",
    other: "Outro",
  };

  return methods[paymentMethod] ?? paymentMethod;
}
