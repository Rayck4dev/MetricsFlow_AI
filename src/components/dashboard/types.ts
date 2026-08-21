export type DashboardTabSection =
  | "dashboard"
  | "whatsapp"
  | "dre"
  | "transactions";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}
