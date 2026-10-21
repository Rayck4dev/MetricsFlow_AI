import { UserRound } from "lucide-react";
import { PerfilSubmitButton } from "../PerfilSubmitButton";

export function PerfilFormHeader() {
  return (
    <div
      className="
          border-b border-surface-border
          px-5 py-4
          sm:px-6
        "
    >
      <div className="flex items-center gap-3">
        <div
          className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-brand-500/10
            "
        >
          <UserRound size={16} className="text-brand-400" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Informações pessoais</h2>

          <p className="mt-0.5 text-[9px] text-slate-600">
            Atualize os dados básicos da sua conta.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PerfilFormActions(props: { saving: boolean; saved: boolean }) {
  return (
    <div
      className="
            flex flex-col gap-3
            border-t border-surface-border
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
    >
      <p className="text-[8px] text-slate-600">
        As alterações são salvas na sua conta.
      </p>

      <PerfilSubmitButton saving={props.saving} saved={props.saved} />
    </div>
  );
}
