import { Building2 } from "lucide-react";

export function RegisterHeader() {
  return (
    <div className="mb-4">
      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
        <Building2 size={17} className="text-brand-400" />
      </div>

      <h1 className="font-heading text-xl font-bold tracking-tight text-white">
        Crie sua conta
      </h1>

      <p className="mt-1 text-xs text-slate-400">
        Comece a organizar as finanças da sua empresa de forma simples.
      </p>
    </div>
  );
}
