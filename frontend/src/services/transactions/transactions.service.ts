import { apiClient } from "@/services/api";

export type ApiTransactionType = "income" | "expense";

export type ApiPaymentMethod =
  | "pix"
  | "credit_card"
  | "debit_card"
  | "bank_slip"
  | "cash"
  | "transfer"
  | "other";

export interface TransactionCategoryRelation {
  id?: string;
  name: string;
}

export interface ApiTransaction {
  id: string;
  company_id: string;
  category_id: string | null;
  created_by_user_id: string;
  type: ApiTransactionType;
  amount: number;
  description: string;
  payment_method: ApiPaymentMethod;
  transaction_date: string;
  origin?: string;
  raw_whatsapp_text?: string | null;
  created_at: string;
  updated_at?: string;
  categories?: TransactionCategoryRelation | TransactionCategoryRelation[] | null;
}

export interface TransactionFilters {
  company_id?: string;
  type?: ApiTransactionType;
  start_date?: string;
  end_date?: string;
  category_id?: string;
}

export interface CreateTransactionDto {
  company_id: string;
  category_id?: string;
  type: ApiTransactionType;
  amount: number;
  description: string;
  payment_method: ApiPaymentMethod;
  transaction_date: string;
}

export interface UpdateTransactionDto {
  category_id?: string;
  type?: ApiTransactionType;
  amount?: number;
  description?: string;
  payment_method?: ApiPaymentMethod;
  transaction_date?: string;
}

export const transactionsService = {
  async listTransactions(filters?: TransactionFilters): Promise<ApiTransaction[]> {
    return apiClient.get<ApiTransaction[]>("/transactions", {
      params: filters as Record<string, string | undefined>,
    });
  },

  async createTransaction(dto: CreateTransactionDto): Promise<ApiTransaction> {
    return apiClient.post<ApiTransaction>("/transactions", dto);
  },

  async updateTransaction(
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<ApiTransaction> {
    return apiClient.patch<ApiTransaction>(`/transactions/${id}`, dto);
  },

  async deleteTransaction(id: string): Promise<{ success: boolean; id: string }> {
    return apiClient.delete<{ success: boolean; id: string }>(`/transactions/${id}`);
  },
};
