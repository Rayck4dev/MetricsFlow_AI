import { Sidebar } from "@/components/layout/Sidebar";

interface DreLoadingStateProps {
  userName?: string;
  companyName?: string;
}

export function DreLoadingState({ userName, companyName }: DreLoadingStateProps) {
  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={userName} companyName={companyName} />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] px-5 pb-5 pt-20 sm:px-6 sm:pb-6 lg:px-8 lg:py-8">
            <div className="space-y-6">
              <div className="h-24 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
              <div className="h-64 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
              <div className="h-96 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
