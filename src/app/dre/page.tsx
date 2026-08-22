"use client";

import { Dre } from "@/components/dre/Dre";
import type { DreTransaction } from "@/components/dre/Dre";
import { Sidebar } from "@/components/layout/Sidebar";

const mockTransactions: DreTransaction[] = [
  {
    id: "1",
    type: "income",
    amount: 3500,
    category: "Vendas / Produtos",
    paymentMethod: "Pix",
    description: "Venda de produtos",
    date: "2026-08-05",
  },
  {
    id: "2",
    type: "income",
    amount: 2800,
    category: "Prestação de Serviços",
    paymentMethod: "Pix",
    description: "Projeto de identidade visual",
    date: "2026-08-08",
  },
  {
    id: "3",
    type: "income",
    amount: 1800,
    category: "Vendas / Produtos",
    paymentMethod: "credit_card",
    description: "Venda de produtos",
    date: "2026-08-12",
  },
  {
    id: "4",
    type: "expense",
    amount: 1250,
    category: "Fornecedores / Estoque",
    paymentMethod: "Pix",
    description: "Compra de materiais",
    date: "2026-08-06",
  },
  {
    id: "5",
    type: "expense",
    amount: 650,
    category: "Marketing / Anúncios",
    paymentMethod: "credit_card",
    description: "Campanha de anúncios",
    date: "2026-08-10",
  },
  {
    id: "6",
    type: "expense",
    amount: 320,
    category: "Ferramentas / Sistema",
    paymentMethod: "credit_card",
    description: "Assinaturas de ferramentas",
    date: "2026-08-15",
  },
  {
    id: "7",
    type: "expense",
    amount: 180,
    category: "Transporte",
    paymentMethod: "Pix",
    description: "Combustível",
    date: "2026-08-17",
  },
];

export default function DrePage() {
  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          userName="Carlos"
          companyName="Carlos Design"
        />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] min-w-0 px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Dre
              transactions={mockTransactions}
              userName="Carlos"
              companyName="Carlos Design"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
