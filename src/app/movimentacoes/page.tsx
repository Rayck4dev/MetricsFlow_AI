"use client";

import { useState } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import {
  Movimentacoes,
  type Movimentacao,
} from "@/components/movimentacoes/Movimentacoes";

const initialTransactions: Movimentacao[] = [
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
  {
    id: "5",
    type: "income",
    amount: 920,
    category: "Serviços",
    paymentMethod: "Pix",
    description: "Projeto de identidade visual",
    date: "Ontem, 15:42",
  },
  {
    id: "6",
    type: "expense",
    amount: 180,
    category: "Marketing",
    paymentMethod: "Cartão",
    description: "Campanha de anúncios",
    date: "Ontem, 10:15",
  },
];

export default function MovimentacoesPage() {
  const [transactions, setTransactions] =
    useState<Movimentacao[]>(initialTransactions);

  function handleAddTransaction(transaction: Omit<Movimentacao, "id">) {
    setTransactions((current) => [
      {
        ...transaction,
        id: crypto.randomUUID(),
      },
      ...current,
    ]);
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar companyName="Carlos Design" />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1400px] p-5 sm:p-6 lg:p-8">
            <Movimentacoes
              transactions={transactions}
              userName="Carlos"
              companyName="Carlos Design"
              onAddIncome={handleAddTransaction}
              onAddExpense={handleAddTransaction}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
