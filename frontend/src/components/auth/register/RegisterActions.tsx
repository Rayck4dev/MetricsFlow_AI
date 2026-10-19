import { Loader2, ArrowRight } from "lucide-react";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import type { RegistrationType } from "@/components/auth/RegistrationTypeSelect";

interface RegisterActionsProps {
  registrationType: RegistrationType;
  loading: boolean;
  googleLoading: boolean;
  disabled: boolean;
  onRegisterWithGoogle: () => void;
}

export function RegisterActions({
  registrationType,
  loading,
  googleLoading,
  disabled,
  onRegisterWithGoogle,
}: RegisterActionsProps) {
  return (
    <>
      <button
        type="submit"
        disabled={disabled}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-xs font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500 hover:shadow-brand-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Criando conta...
          </>
        ) : (
          <>
            {registrationType === "create_company"
              ? "Criar minha conta"
              : "Criar conta e entrar"}
            <ArrowRight size={15} />
          </>
        )}
      </button>

      <div className="relative my-3.5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface-main px-3 text-[9px] text-slate-600">
            ou continue com
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onRegisterWithGoogle}
        disabled={disabled}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar text-xs font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-surface-panel disabled:cursor-not-allowed disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        {googleLoading ? "Conectando..." : "Continuar com Google"}
      </button>
    </>
  );
}
