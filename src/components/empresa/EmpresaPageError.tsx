"use client";

import { Sidebar } from "@/components/layout/Sidebar";

interface EmpresaPageErrorProps {
  userName: string;
  companyName?: string;
  message: string;
  onRetry: () => void;
}

export default function EmpresaPageError({
  userName,
  companyName,
  message,
  onRetry,
}: EmpresaPageErrorProps) {
  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={userName} companyName={companyName} />

        <main className="min-w-0 flex-1">
          <div className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-md rounded-2xl border border-red-500/20 bg-surface-panel px-6 py-5 text-center">
              <p className="text-sm font-semibold text-white">
                Não foi possível carregar a empresa
              </p>

              <p className="mt-2 text-xs text-slate-500">{message}</p>

              <button
                type="button"
                onClick={onRetry}
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
