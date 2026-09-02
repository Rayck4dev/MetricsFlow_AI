import { CreditCard, WalletCards } from "lucide-react";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function getPaymentIcon(paymentMethod: string) {
  const normalized = paymentMethod.toLowerCase();

  if (
    normalized.includes("pix") ||
    normalized.includes("transfer") ||
    normalized.includes("transferência")
  ) {
    return WalletCards;
  }

  return CreditCard;
}

export function getPaymentLabel(paymentMethod: string) {
  const labels: Record<string, string> = {
    pix: "Pix",
    credit_card: "Cartão de crédito",
    debit_card: "Cartão de débito",
    bank_slip: "Boleto",
    cash: "Dinheiro",
    transfer: "Transferência",
    other: "Outro",
  };

  return labels[paymentMethod] ?? paymentMethod;
}
