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

import type { DrePeriod } from "@/components/dre/DrePeriodSelector";

export interface DreTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

export interface DreProps {
  transactions: DreTransaction[];
  userName?: string;
  companyName?: string;
  onExport?: () => void;
}

export interface DreFinancialData {
  revenue: number;
  costs: number;
  expenses: number;
  result: number;
}

export interface DreBreakdownItem {
  label: string;
  value: number;
  percentage: number;
}

export interface DreChartItem {
  month: string;
  revenue: number;
  costs: number;
  expenses: number;
  result: number;
}

export interface DreData {
  period: DrePeriod;
  periodTransactions: DreTransaction[];
  financialData: DreFinancialData;
  revenueItems: DreBreakdownItem[];
  costItems: DreBreakdownItem[];
  expenseItems: DreBreakdownItem[];
  chartData: DreChartItem[];
}

export interface Movimentacao {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

export type TransactionType = "all" | "income" | "expense";

export type PeriodFilter = "all" | "today" | "week" | "month";

export interface MovimentacoesFiltersState {
  search: string;
  type: TransactionType;
  category: string;
  period: PeriodFilter;
}

export interface MovimentacoesTotals {
  income: number;
  expenses: number;
  balance: number;
  count: number;
}
