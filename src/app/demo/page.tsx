"use client";

import { useState } from "react";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { Sidebar } from "@/components/layout/Sidebar";

import type { DashboardTransaction } from "@/components/dashboard/DashboardTransactions";

const demoTransactions: DashboardTransaction[] = [
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
    amount: 720,
    category: "Serviços",
    paymentMethod: "Pix",
    description: "Projeto de identidade visual",
    date: "Ontem, 15:10",
  },
  {
    id: "6",
    type: "expense",
    amount: 180,
    category: "Operacional",
    paymentMethod: "Pix",
    description: "Assinaturas e ferramentas",
    date: "18 Ago, 18:40",
  },
];

type DemoSection = "dashboard" | "financeiro" | "dre";

export default function DemoPage() {
  const [section, setSection] = useState<DemoSection>("dashboard");

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar em modo demonstração */}
        <Sidebar
          userName="Carlos"
          companyName="Carlos Design"
          demo
          onDemoSectionChange={(value) =>
            setSection(value as DemoSection)
          }
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
            {section === "dashboard" && (
              <Dashboard
                transactions={demoTransactions}
                userName="Carlos"
                companyName="Carlos Design"
                demo
              />
            )}

            {section === "financeiro" && (
              <DemoPlaceholder
                title="Financeiro"
                description="Explore como o MetricsFlow organiza suas entradas, despesas e movimentações."
              />
            )}

            {section === "dre" && (
              <DemoPlaceholder
                title="DRE"
                description="Visualize uma demonstração do resultado financeiro da empresa."
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function DemoPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-panel p-8 shadow-2xl shadow-black/20">
      {/* Glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-400">
            Demonstração
          </span>
        </div>

        <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-surface-border bg-surface-sidebar/50 p-8 text-center">
          <p className="text-xs font-semibold text-slate-400">
            Seção demonstrativa
          </p>

          <p className="mt-1 text-[10px] text-slate-600">
            Este módulo será desenvolvido em seguida.
          </p>
        </div>
      </div>
    </div>
  );
}