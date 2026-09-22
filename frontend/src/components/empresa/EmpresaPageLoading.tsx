"use client";

import { Sidebar } from "@/components/layout/Sidebar";

export default function EmpresaPageLoading() {
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

