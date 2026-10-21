import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function ResetPasswordChecking() {
  return (
    <div className="flex flex-col items-center py-10">
      <Loader2 size={22} className="animate-spin text-brand-400" />

      <p className="mt-3 text-xs text-slate-500">
        Validando link de recuperação...
      </p>
    </div>
  );
}

export function ResetPasswordSuccess() {
  return (
    <div className="py-5 text-center">
      <div
        className="
            mx-auto mb-5
            flex h-12 w-12
            items-center justify-center
            rounded-full
            border border-emerald-500/20
            bg-emerald-500/10
          "
      >
        <CheckCircle2 size={23} className="text-emerald-400" />
      </div>

      <h1
        className="
            font-heading text-xl font-bold
            tracking-tight text-white
          "
      >
        Senha atualizada!
      </h1>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        Sua senha foi alterada com sucesso. Agora você já pode entrar novamente
        na sua conta.
      </p>

      <Link
        href="/login"
        className="
            mt-6
            flex h-11 w-full
            items-center justify-center gap-2
            rounded-xl
            bg-brand-600
            text-xs font-semibold text-white
            shadow-lg shadow-brand-600/20
            transition-all
            hover:bg-brand-500
          "
      >
        Ir para o login
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
