import { Preferencias } from "@/components/preferencias/Preferencias";
import { Sidebar } from "@/components/layout/Sidebar";

export default function PreferenciasPage() {
  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName="Carlos" companyName="Carlos Design" />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
            <Preferencias />
          </div>
        </main>
      </div>
    </div>
  );
}
