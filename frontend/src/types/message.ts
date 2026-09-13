import type { PaymentMethod, TransactionType } from "@/types/transaction";

export type WhatsAppIntent =
  | "create_transaction"
  | "confirm_transaction"
  | "cancel_transaction"
  | "correct_transaction"
  | "unknown";

export interface CompanyCategory {
  id: string;
  name: string;
  type: TransactionType;
}

export interface ParsedFinancialMessage {
  intent: WhatsAppIntent;
  type: TransactionType | null;
  amount: number | null;
  description: string | null;
  categoryId: string | null;
  categoryName: string | null;
  paymentMethod: PaymentMethod | null;
  transactionDate: string | null;
  confidence: number;
  missingFields: string[];
}
