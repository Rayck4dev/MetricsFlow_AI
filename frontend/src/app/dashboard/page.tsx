"use client";

import { useRouter } from "next/navigation";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { Sidebar } from "@/components/layout/Sidebar";

import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const router = useRouter();

  const { transactions, userName, companyName, loading } = useDashboard();

  function handleAddIncome() {
    router.push("/movimentacoes");
  }

  function handleAddExpense() {
    router.push("/movimentacoes");
  }

  function handleViewFinance() {
    router.push("/movimentacoes");
  }

  function handleViewDre() {
    router.push("/dre");
  }

  function handleViewAllTransactions() {
    router.push("/movimentacoes");
  }

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={userName} companyName={companyName} />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] px-4 pb-4 pt-20 sm:px-6 sm:pb-6 lg:p-8">
            <Dashboard
              transactions={transactions}
              userName={userName}
              companyName={companyName}
              demo={false}
              onAddIncome={handleAddIncome}
              onAddExpense={handleAddExpense}
              onViewFinance={handleViewFinance}
              onViewDre={handleViewDre}
              onViewAllTransactions={handleViewAllTransactions}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

