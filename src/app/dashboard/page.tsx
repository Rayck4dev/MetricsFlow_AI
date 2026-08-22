"use client";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { Sidebar } from "@/components/layout/Sidebar";

import type { DashboardTransaction } from "@/components/dashboard/DashboardTransactions";

const dashboardTransactions: DashboardTransaction[] = [
  {
    id: "1",
    type: "income",
    amount: 4200,
    category: "Vendas",
    paymentMethod: "Pix",
    description: "Recebimento de projeto",
    date: "Hoje, 14:32",
  },
  {
    id: "2",
    type: "expense",
    amount: 850,
    category: "Fornecedores",
    paymentMethod: "Pix",
    description: "Compra de materiais",
    date: "Hoje, 11:18",
  },
  {
    id: "3",
    type: "income",
    amount: 2800,
    category: "Serviços",
    paymentMethod: "Cartão",
    description: "Projeto de identidade visual",
    date: "Ontem, 16:42",
  },
  {
    id: "4",
    type: "expense",
    amount: 420,
    category: "Operacional",
    paymentMethod: "Pix",
    description: "Despesas operacionais",
    date: "Ontem, 10:20",
  },
  {
    id: "5",
    type: "income",
    amount: 1750,
    category: "Vendas",
    paymentMethod: "Pix",
    description: "Venda de serviços",
    date: "18 Ago, 15:30",
  },
  {
    id: "6",
    type: "expense",
    amount: 280,
    category: "Transporte",
    paymentMethod: "Pix",
    description: "Combustível",
    date: "18 Ago, 09:14",
  },
];

export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          userName="Carlos"
          companyName="Carlos Design"
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
            <Dashboard
              transactions={dashboardTransactions}
              userName="Carlos"
              companyName="Carlos Design"
              demo={false}
            />
          </div>
        </main>
      </div>
    </div>
  );
}