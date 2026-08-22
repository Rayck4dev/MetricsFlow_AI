"use client";

import { useState } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Movimentacao } from "@/components/movimentacoes/types";
import { Movimentacoes } from "@/components/movimentacoes/Movimentacoes";

const initialTransactions: Movimentacao[] = [
  {
    id: "1",
    type: "income",
    amount: 350,
    category: "Vendas / Produtos",
    paymentMethod: "pix",
    description: "Venda de produtos",
    date: "Hoje, 14:32",
  },
  {
    id: "2",
    type: "expense",
    amount: 120,
    category: "Fornecedores / Estoque",
    paymentMethod: "pix",
    description: "Compra de materiais",
    date: "Hoje, 12:18",
  },
  {
    id: "3",
    type: "income",
    amount: 480,
    category: "Prestação de Serviços",
    paymentMethod: "credit_card",
    description: "Projeto de identidade visual",
    date: "Hoje, 09:47",
  },
  {
    id: "4",
    type: "expense",
    amount: 45,
    category: "Transporte",
    paymentMethod: "pix",
    description: "Combustível",
    date: "Ontem, 17:20",
  },
  {
    id: "5",
    type: "income",
    amount: 920,
    category: "Vendas / Produtos",
    paymentMethod: "pix",
    description: "Venda de produtos",
    date: "Ontem, 15:42",
  },
  {
    id: "6",
    type: "expense",
    amount: 180,
    category: "Marketing / Anúncios",
    paymentMethod: "credit_card",
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

  function handleUpdateTransaction(
    id: string,
    transaction: Omit<Movimentacao, "id">,
  ) {
    setTransactions((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...transaction,
              id,
            }
          : item,
      ),
    );
  }

  function handleDeleteTransaction(id: string) {
    setTransactions((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName="Carlos" companyName="Carlos Design" />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] min-w-0 px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Movimentacoes
              transactions={transactions}
              userName="Carlos"
              companyName="Carlos Design"
              onAddIncome={handleAddTransaction}
              onAddExpense={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
