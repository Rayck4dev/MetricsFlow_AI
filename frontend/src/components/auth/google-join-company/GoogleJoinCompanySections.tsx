import { Link2 } from "lucide-react";

export function GoogleJoinCompanyIntro() {
  return (
    <div>
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
        <Link2 size={18} className="text-brand-400" />
      </div>

      <h2 className="font-heading text-xl font-bold text-white md:text-2xl">
        Entrar em uma empresa
      </h2>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        Informe o código de convite que você recebeu do proprietário da empresa.
      </p>
    </div>
  );
}

export function GoogleJoinCompanyNotice() {
  return (
    <div className="rounded-2xl border border-brand-500/10 bg-brand-500/[0.035] p-4">
      <p className="text-[10px] font-semibold text-brand-300">
        Você entrará como colaborador
      </p>

      <p className="mt-1 text-[9px] leading-4 text-slate-600">
        O acesso será vinculado à empresa do convite.
      </p>
    </div>
  );
}
