import type { DashboardData } from "@/lib/dashboard/dashboard.types";

export const demoDashboardData: DashboardData = {
  userName: "Carlos",
  companyName: "Carlos Design",

  period: {
    label: "Agosto 2026",
    start: "2026-08-01",
    end: "2026-08-31",
  },

  financial: {
    income: 830,
    expenses: 165,
    profit: 665,
    margin: 80.1,
  },

  transactions: [
    {
      id: "1",
      type: "income",
      amount: 350,
      category: "Vendas",
      paymentMethod: "Pix",
      description: "Venda de produtos",
      date: "Hoje, 14:32",
    },

    {
      id: "2",
      type: "expense",
      amount: 120,
      category: "Fornecedores",
      paymentMethod: "Pix",
      description: "Compra de materiais",
      date: "Hoje, 12:18",
    },

    {
      id: "3",
      type: "income",
      amount: 480,
      category: "Vendas",
      paymentMethod: "Cartão",
      description: "Venda de produtos",
      date: "Hoje, 09:47",
    },

    {
      id: "4",
      type: "expense",
      amount: 45,
      category: "Transporte",
      paymentMethod: "Pix",
      description: "Combustível",
      date: "Ontem, 17:20",
    },
  ],

  chart: [
    {
      label: "01 Ago",
      income: 250,
      expenses: 80,
    },
    {
      label: "05 Ago",
      income: 420,
      expenses: 130,
    },
    {
      label: "10 Ago",
      income: 310,
      expenses: 95,
    },
    {
      label: "15 Ago",
      income: 580,
      expenses: 180,
    },
    {
      label: "20 Ago",
      income: 720,
      expenses: 220,
    },
    {
      label: "25 Ago",
      income: 640,
      expenses: 190,
    },
    {
      label: "30 Ago",
      income: 830,
      expenses: 165,
    },
  ],
};
