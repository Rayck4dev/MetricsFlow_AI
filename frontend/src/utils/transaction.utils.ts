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
