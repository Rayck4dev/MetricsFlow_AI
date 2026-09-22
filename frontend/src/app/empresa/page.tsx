"use client";

import { Empresa } from "@/components/empresa/Empresa";
import { Sidebar } from "@/components/layout/Sidebar";

import { useEmpresa } from "@/hooks/useEmpresa";

export default function EmpresaPage() {
  const {
    userName,
    company,
    members,
    currentUserId,
    loading,
    roleLoading,
    errorMessage,
    role,
    loadCompanyData,
    handleUpdateCompany,
    handleRegenerateInvite,
    handleRemoveMember,
  } = useEmpresa();

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[1500px] px-4 pb-4 pt-20 sm:px-6 sm:pb-6 lg:p-8">
              <div className="space-y-4">
                <div className="h-40 animate-pulse rounded-3xl border border-surface-border bg-surface-panel" />

                <div className="h-72 animate-pulse rounded-3xl border border-surface-border bg-surface-panel" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (role === "collaborator") {
    return null;
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar userName={userName} companyName={company?.name} />

          <main className="min-w-0 flex-1">
            <div className="flex min-h-screen items-center justify-center px-6 pb-6 pt-20 lg:p-6">
              <div className="max-w-md rounded-2xl border border-red-500/20 bg-surface-panel px-6 py-5 text-center">
                <p className="text-sm font-semibold text-white">
                  Não foi possível carregar a empresa
                </p>

                <p className="mt-2 text-xs text-slate-500">{errorMessage}</p>

                <button
                  type="button"
                  onClick={loadCompanyData}
                  className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-[10px] font-bold text-white transition hover:bg-brand-500"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar userName={userName} />

          <main className="min-w-0 flex-1">
            <div className="flex min-h-screen items-center justify-center px-6 pb-6 pt-20 lg:p-6">
              <div className="rounded-2xl border border-surface-border bg-surface-panel px-6 py-5 text-center">
                <p className="text-sm font-semibold text-white">
                  Nenhuma empresa encontrada
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Sua conta ainda não está vinculada a uma empresa.
                </p>
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
        <Sidebar userName={userName} companyName={company.name} />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] px-4 pb-4 pt-20 sm:px-6 sm:pb-6 lg:p-8">
            <Empresa
              company={company}
              members={members}
              currentUserId={currentUserId}
              onUpdateCompany={handleUpdateCompany}
              onRegenerateInvite={handleRegenerateInvite}
              onRemoveMember={handleRemoveMember}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

