"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Lock } from "lucide-react";

import { PasswordInput } from "./PasswordInput";
import { useResetPassword } from "@/hooks/useResetPassword";

export function ResetPasswordForm() {
  const {
    password,
    setPassword,

    confirmPassword,
    setConfirmPassword,

    loading,
    checkingSession,

    success,
    error,

    hasRecoverySession,

    resetPassword,
  } = useResetPassword();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    resetPassword();
  }

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center py-10">
        <Loader2 size={22} className="animate-spin text-brand-400" />

        <p className="mt-3 text-xs text-slate-500">
          Validando link de recuperação...
        </p>
      </div>
    );
  }

  if (success) {
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
          Sua senha foi alterada com sucesso. Agora você já pode entrar
          novamente na sua conta.
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

  return (
    <div className="w-full">
      <div className="mb-6">
        <div
          className="
            mb-4
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-brand-500/20
            bg-brand-500/10
          "
        >
          <Lock size={18} className="text-brand-400" />
        </div>

        <h1
          className="
            font-heading text-xl font-bold
            tracking-tight text-white
          "
        >
          Criar nova senha
        </h1>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Escolha uma nova senha para proteger sua conta do MetricsFlow AI.
        </p>
      </div>

      {error && (
        <div
          className="
            mb-4
            rounded-xl
            border border-red-500/20
            bg-red-500/10
            px-3 py-2.5
          "
        >
          <p className="text-[11px] leading-4 text-red-300">{error}</p>
        </div>
      )}

      {hasRecoverySession ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            id="password"
            name="password"
            label="Nova senha"
            value={password}
            onChange={setPassword}
            disabled={loading}
          />

          <p className="-mt-2 text-[10px] text-slate-600">
            A senha deve possuir pelo menos 8 caracteres.
          </p>

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar nova senha"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={loading}
          />

          {confirmPassword.length > 0 && (
            <div>
              {password === confirmPassword ? (
                <p
                  className="
                    flex items-center gap-1.5
                    text-[10px] text-emerald-400
                  "
                >
                  <CheckCircle2 size={12} />
                  As senhas coincidem.
                </p>
              ) : (
                <p className="text-[10px] text-red-400">
                  As senhas ainda não coincidem.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              flex h-11 w-full
              items-center justify-center gap-2
              rounded-xl
              bg-brand-600
              text-xs font-semibold text-white
              shadow-lg shadow-brand-600/20
              transition-all
              hover:bg-brand-500
              hover:shadow-brand-500/25
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                Salvar nova senha
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      ) : (
        <Link
          href="/recuperar-senha"
          className="
            flex h-11 w-full
            items-center justify-center
            rounded-xl
            bg-brand-600
            text-xs font-semibold text-white
            transition-all
            hover:bg-brand-500
          "
        >
          Solicitar novo link
        </Link>
      )}
    </div>
  );
}
