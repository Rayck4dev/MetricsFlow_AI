"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Perfil } from "@/components/perfil/Perfil";

import { usePerfilPage } from "@/hooks/usePerfilPage";

export default function PerfilPage() {
  const {
    user,
    companyName,
    loading,
    error,
    loadProfile,
    handleUpdateProfile,
    handleChangePassword,
    handleManageSessions,
  } = usePerfilPage();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar userName="Usuário" companyName="Carregando..." />

          <main className="min-w-0 flex-1">
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-brand-400" />

                <p className="mt-4 text-xs text-slate-500">
                  Carregando perfil...
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar userName="Usuário" companyName={companyName || "Empresa"} />

          <main className="min-w-0 flex-1">
            <div className="flex min-h-screen items-center justify-center px-5 pb-5 pt-20 lg:p-5">
              <div className="w-full max-w-md rounded-2xl border border-red-500/10 bg-surface-panel p-6 text-center">
                <p className="text-sm font-bold text-white">
                  Não foi possível carregar o perfil
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {error ?? "Usuário não encontrado."}
                </p>

                <button
                  type="button"
                  onClick={loadProfile}
                  className="mt-5 rounded-xl border border-brand-500/20 bg-brand-500/10 px-4 py-2.5 text-[10px] font-bold text-brand-300 transition-colors hover:bg-brand-500/20"
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

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={user.name} companyName={companyName || "Empresa"} />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] px-4 pb-4 pt-20 sm:px-6 sm:pb-6 lg:p-8">
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3">
                <p className="text-[10px] font-medium text-red-400">{error}</p>
              </div>
            )}

            <Perfil
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
              onManageSessions={handleManageSessions}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

