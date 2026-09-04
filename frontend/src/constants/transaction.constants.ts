export type TransactionType = "income" | "expense";

export const CATEGORIES: Record<TransactionType, string[]> = {
  income: ["Vendas", "Serviços", "Investimentos", "Comissões", "Outros"],

  expense: [
    "Fornecedores",
    "Aluguel / Fixos",
    "Marketing / Anúncios",
    "Transporte / Logística",
    "Equipe / Salários",
    "Software / Ferramentas",
    "Impostos",
    "Outros",
  ],
};

export const PAYMENT_METHODS = [
  "Pix",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Boleto",
  "Dinheiro",
  "Transferência (TED/DOC)",
] as const;

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  paymentMethod: string;
  date: string;
}
