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

export type DemoSection =
  | "dashboard"
  | "whatsapp"
  | "dre"
  | "transactions"
  | "profile"
  | "company"
  | "preferences";

export default function DemoPage() {
  const [section, setSection] = useState<DemoSection>("dashboard");

  function handleSectionChange(value: DemoSection) {
    setSection(value);
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          userName="Carlos"
          companyName="Carlos Design"
          demo
          activeDemoSection={section}
          onDemoSectionChange={handleSectionChange}
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

            {section === "whatsapp" && (
              <DemoLockedPage
                title="WhatsApp"
                description="Conecte o WhatsApp ao MetricsFlow AI para acompanhar suas movimentações e interações financeiras."
                badge="Em breve"
              />
            )}

            {section === "dre" && (
              <DemoLockedPage
                title="DRE"
                description="Acompanhe receitas, custos, despesas e o resultado financeiro da sua empresa."
              />
            )}

            {section === "transactions" && (
              <DemoLockedPage
                title="Movimentações"
                description="Registre, consulte e organize todas as entradas e saídas da sua empresa."
              />
            )}

            {section === "profile" && (
              <DemoLockedPage
                title="Perfil"
                description="Gerencie suas informações pessoais e configurações da sua conta."
              />
            )}

            {section === "company" && (
              <DemoLockedPage
                title="Empresa"
                description="Configure os dados da sua empresa, membros e informações financeiras."
              />
            )}

            {section === "preferences" && (
              <DemoLockedPage
                title="Preferências"
                description="Personalize sua experiência, notificações e preferências financeiras."
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

interface DemoLockedPageProps {
  title: string;
  description: string;
  badge?: string;
}

function DemoLockedPage({ title, description, badge }: DemoLockedPageProps) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden rounded-3xl">
      <div className="pointer-events-none select-none blur-[7px] opacity-45">
        <div className="rounded-3xl border border-surface-border bg-surface-panel/80 p-6 shadow-2xl sm:p-8">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-400" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-400">
                Demonstração
              </span>
            </div>

            <h1 className="font-heading text-3xl font-bold text-white">
              {title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <FakeCard />
            <FakeCard />
            <FakeCard />
          </div>

          <div className="mt-5 h-72 rounded-2xl border border-surface-border bg-surface-sidebar/70" />

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FakeCard />
            <FakeCard />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-[#03182b]/35 backdrop-blur-[1px]" />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[520px] rounded-3xl border border-white/[0.08] bg-[#0a1b2c]/95 p-7 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-9">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-400/15 bg-brand-400/[0.08]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-brand-300"
            >
              <path
                d="M7 10V8a5 5 0 0 1 10 0v2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <rect
                x="4"
                y="10"
                width="16"
                height="10"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M12 14v2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {badge && (
            <div className="mt-6 inline-flex rounded-full border border-brand-400/15 bg-brand-400/[0.06] px-3 py-1">
              <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-brand-300">
                {badge}
              </span>
            </div>
          )}

          {!badge && (
            <div className="mt-6 inline-flex rounded-full border border-brand-400/15 bg-brand-400/[0.06] px-3 py-1">
              <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-brand-300">
                Recurso disponível na conta
              </span>
            </div>
          )}

          <h2 className="mt-5 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
            Tenha acesso à experiência completa
          </h2>

          <p className="mx-auto mt-4 max-w-md text-xs leading-5 text-slate-500 sm:text-sm">
            Você está visualizando uma prévia do{" "}
            <strong className="font-semibold text-slate-300">{title}</strong>.
            Cadastre-se gratuitamente para desbloquear todos os recursos do
            MetricsFlow AI.
          </p>

          <button
            type="button"
            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-xs font-bold text-white shadow-lg shadow-brand-500/10 transition-all hover:bg-brand-400 hover:shadow-brand-500/20 active:scale-[0.98]"
          >
            Criar minha conta
            <span aria-hidden>→</span>
          </button>

          <p className="mt-4 text-[8px] text-slate-600">
            É rápido, gratuito e você poderá explorar todos os módulos.
          </p>
        </div>
      </div>
    </div>
  );
}

function FakeCard() {
  return (
    <div className="h-32 rounded-2xl border border-surface-border bg-surface-sidebar/80 p-5">
      <div className="h-2 w-24 rounded bg-slate-700/70" />
      <div className="mt-5 h-5 w-32 rounded bg-slate-600/60" />
      <div className="mt-3 h-2 w-20 rounded bg-slate-700/60" />
    </div>
  );
}
