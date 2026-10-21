import type { Movimentacao } from "@/components/movimentacoes/types";
import type { ToastType } from "@/components/ui/Toast";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

export interface TransactionQueryRecord {
  id: string;
  type: Movimentacao["type"];
  amount: number;
  description: string;
  payment_method: string;
  transaction_date: string;
  categories: { name: string } | { name: string }[] | null;
}

export interface ToastState {
  open: boolean;
  type: ToastType;
  title: string;
  message?: string;
}
