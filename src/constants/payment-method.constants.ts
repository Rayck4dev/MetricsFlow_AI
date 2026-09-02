export const PAYMENT_METHOD_LABELS = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
  debit_card: "Cartão de débito",
  bank_slip: "Boleto",
  cash: "Dinheiro",
  transfer: "Transferência",
  other: "Outro",
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHOD_LABELS;

export function getPaymentMethodLabel(value: string): string {
  return PAYMENT_METHOD_LABELS[value as PaymentMethod] ?? value;
}
