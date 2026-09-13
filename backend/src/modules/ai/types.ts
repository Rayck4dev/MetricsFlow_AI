export type TransactionType = 'income' | 'expense';

export type PaymentMethod =
  | 'pix'
  | 'credit_card'
  | 'debit_card'
  | 'bank_slip'
  | 'cash'
  | 'transfer'
  | 'other';

export type WhatsAppIntent =
  | 'create_transaction'
  | 'confirm_transaction'
  | 'cancel_transaction'
  | 'correct_transaction'
  | 'unknown';

export interface CompanyCategory {
  id: string;
  name: string;
  type: TransactionType;
  color?: string | null;
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
export type IncomingWhatsAppMessage = {
  providerMessageId: string;
  phoneNumber: string;
  type: "text" | "audio";
  text?: string;
  mediaId?: string;
  payload: unknown;
};
