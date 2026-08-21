export type TransactionType = "income" | "expense";

export type PaymentMethod =
  | "pix"
  | "credit_card"
  | "debit_card"
  | "bank_slip"
  | "cash"
  | "transfer"
  | "other";

export interface Transaction {
  id: string;
  companyId: string;
  categoryId?: string | null;

  type: TransactionType;

  amount: number;

  description: string;

  paymentMethod: PaymentMethod;

  transactionDate: string;

  origin?: "web" | "whatsapp";

  createdAt?: string;
  updatedAt?: string;

  category?: {
    id: string;
    name: string;
    color?: string;
  } | null;
}
