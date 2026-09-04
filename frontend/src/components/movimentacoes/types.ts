export type MovimentacaoTipo = "income" | "expense";

export interface Movimentacao {
  id: string;
  type: MovimentacaoTipo;
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}
