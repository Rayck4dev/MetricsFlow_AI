export interface ConfirmWhatsappParsed {
  intent: 'create_transaction' | string;
  missingFields: string[];
  type: 'income' | 'expense' | null;
  amount: number | null;
  description: string | null;
  categoryId: string | null;
  categoryName: string | null;
  paymentMethod: string | null;
  transactionDate: string | null;
}

export interface ConfirmWhatsappDto {
  parsed?: ConfirmWhatsappParsed;
  rawText?: string;
}
