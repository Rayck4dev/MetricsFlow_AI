"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Movimentacoes } from "@/components/movimentacoes/Movimentacoes";
import Toast from "@/components/ui/Toast";

import { useMovimentacoesPage } from "@/hooks/useMovimentacoesPage";

export default function MovimentacoesPage() {
  const {
    transactions,
    categories,
    userName,
    companyName,
    loading,
    roleLoading,
    isOwner,
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    exportTransactionsCsv,
    toast,
    closeToast,
  } = useMovimentacoesPage();

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="min-w-0 flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1400px] px-5 pb-5 pt-20 sm:px-6 sm:pb-6 lg:px-8 lg:py-8">
              <div className="space-y-6">
                <div className="h-24 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />

                <div className="h-32 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />

                <div className="h-96 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={userName} companyName={companyName} />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] min-w-0 px-5 pb-5 pt-20 sm:px-6 sm:pb-6 lg:px-8 lg:py-8">
            <Movimentacoes
              transactions={transactions}
              categories={categories}
              userName={userName}
              companyName={companyName}
              onAddIncome={handleAddTransaction}
              onAddExpense={handleAddTransaction}
              onUpdateTransaction={
                isOwner ? handleUpdateTransaction : undefined
              }
              onDeleteTransaction={
                isOwner ? handleDeleteTransaction : undefined
              }
              onExport={exportTransactionsCsv}
            />
          </div>
        </main>

        <Toast
          open={toast.open}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={closeToast}
        />
      </div>
    </div>
  );
}

