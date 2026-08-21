export type TransactionType = "receita" | "despesa";

export type PaymentMethod =
  | "pix"
  | "cartao_credito"
  | "cartao_debito"
  | "boleto"
  | "dinheiro"
  | "transferencia"
  | "outro";

export interface Transaction {
  id: string;
  empresa_id: string;
  categoria_id?: string;
  tipo: TransactionType;
  valor: number;
  descricao: string;
  metodo_pagamento: PaymentMethod;
  data_transacao: string;
  origem?: string;
  created_at?: string;
}
