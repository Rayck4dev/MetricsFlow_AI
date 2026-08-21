export type DashboardTransactionType = "income" | "expense";

export interface DashboardTransaction {
  id: string;
  type: DashboardTransactionType;
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

export interface DashboardData {
  userName: string;
  companyName: string;

  period: {
    label: string;
    start: string;
    end: string;
  };

  financial: {
    income: number;
    expenses: number;
    profit: number;
    margin: number;
  };

  transactions: DashboardTransaction[];

  chart: {
    label: string;
    income: number;
    expenses: number;
  }[];
}
