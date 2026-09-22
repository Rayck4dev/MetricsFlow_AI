"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Empresa } from "@/components/empresa/Empresa";

import { useEmpresa } from "@/hooks/useEmpresa";

import EmpresaPageLoading from "./EmpresaPageLoading";
import EmpresaPageError from "./EmpresaPageError";

export default function EmpresaPageContent() {
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
    return <EmpresaPageLoading />;
  }

  if (role === "collaborator") {
    return null;
  }

  if (errorMessage) {
    return (
      <EmpresaPageError
        userName={userName}
        companyName={company?.name}
        message={errorMessage}
        onRetry={loadCompanyData}
      />
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

