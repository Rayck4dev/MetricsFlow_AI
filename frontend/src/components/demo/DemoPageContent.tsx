"use client";

import { useState } from "react";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { Sidebar } from "@/components/layout/Sidebar";

import type { DashboardTransaction } from "@/components/dashboard/DashboardTransactions";

import { DemoLockedPage } from "./DemoLockedPage";
import { demoTransactions } from "./demo-data";

export type DemoSection =
  | "dashboard"
  | "whatsapp"
  | "dre"
  | "transactions"
  | "profile"
  | "company"
  | "preferences";

export function DemoPageContent() {
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
            <DemoSectionContent
              section={section}
              transactions={demoTransactions}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

interface DemoSectionContentProps {
  section: DemoSection;
  transactions: DashboardTransaction[];
}

function DemoSectionContent({
  section,
  transactions,
}: DemoSectionContentProps) {
  switch (section) {
    case "dashboard":
      return (
        <Dashboard
          transactions={transactions}
          userName="Carlos"
          companyName="Carlos Design"
          demo
        />
      );

    case "whatsapp":
      return (
        <DemoLockedPage
          title="WhatsApp"
          description="Conecte o WhatsApp ao MetricsFlow AI para acompanhar suas movimentações e interações financeiras."
          badge="Em breve"
        />
      );

    case "dre":
      return (
        <DemoLockedPage
          title="DRE"
          description="Acompanhe receitas, custos, despesas e o resultado financeiro da empresa."
        />
      );

    case "transactions":
      return (
        <DemoLockedPage
          title="Movimentações"
          description="Registre, consulte e organize todas as entradas e saídas da sua empresa."
        />
      );

    case "profile":
      return (
        <DemoLockedPage
          title="Perfil"
          description="Gerencie suas informações pessoais e configurações da sua conta."
        />
      );

    case "company":
      return (
        <DemoLockedPage
          title="Empresa"
          description="Configure os dados da sua empresa, membros e informações financeiras."
        />
      );

    case "preferences":
      return (
        <DemoLockedPage
          title="Preferências"
          description="Personalize sua experiência, notificações e preferências financeiras."
        />
      );

    default:
      return null;
  }
}
