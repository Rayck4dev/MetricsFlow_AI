import { UserRound, UsersRound } from "lucide-react";
export { MemberRow, getDisplayName } from "./EmpresaMemberRows";

export function MembersHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
          <UsersRound size={16} className="text-brand-400" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Membros da empresa</h2>

          <p className="mt-0.5 text-[9px] text-slate-600">
            Pessoas com acesso à empresa.
          </p>
        </div>
      </div>

      <span className="rounded-full border border-surface-border bg-surface-sidebar px-2.5 py-1 text-[8px] font-bold text-slate-500">
        {count} {count === 1 ? "membro" : "membros"}
      </span>
    </div>
  );
}

export function EmptyState({ isOwner }: { isOwner: boolean }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center px-5 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/[0.06] text-brand-400">
        <UserRound size={18} />
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-300">
        Nenhum membro encontrado
      </p>

      <p className="mt-1 max-w-xs text-[9px] leading-4 text-slate-600">
        {isOwner
          ? "Compartilhe o código de convite para adicionar colaboradores."
          : "Nenhum colaborador foi adicionado à empresa."}
      </p>
    </div>
  );
}




















