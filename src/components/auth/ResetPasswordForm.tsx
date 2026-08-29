"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setHasRecoverySession(true);
        } else {
          setError(
            "O link de recuperação é inválido ou expirou. Solicite um novo link.",
          );
        }
      } catch (error) {
        console.error("Erro ao verificar sessão de recuperação:", error);

        setError("Não foi possível validar o link de recuperação.");
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setHasRecoverySession(true);
        setError("");
        setCheckingSession(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error("Erro ao atualizar senha:", error);

        setError(error.message || "Não foi possível atualizar sua senha.");

        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Erro inesperado ao atualizar senha:", error);

      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
    <>
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
          {/* NOVA SENHA */}
          <div>
            <label
              htmlFor="password"
              className="
                mb-1.5 block
                text-xs font-semibold
                text-slate-300
              "
            >
              Nova senha
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="
                  h-11 w-full rounded-xl
                  border border-surface-border
                  bg-surface-main
                  pl-9 pr-10
                  text-xs text-white
                  outline-none
                  placeholder:text-slate-600
                  transition-all
                  focus:border-brand-500/60
                  focus:ring-2
                  focus:ring-brand-500/10
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                  transition-colors
                  hover:text-slate-300
                "
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <p className="mt-1.5 text-[10px] text-slate-600">
              A senha deve possuir pelo menos 8 caracteres.
            </p>
          </div>

          {/* CONFIRMAR SENHA */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="
                mb-1.5 block
                text-xs font-semibold
                text-slate-300
              "
            >
              Confirmar nova senha
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                className="
                  h-11 w-full rounded-xl
                  border border-surface-border
                  bg-surface-main
                  pl-9 pr-10
                  text-xs text-white
                  outline-none
                  placeholder:text-slate-600
                  transition-all
                  focus:border-brand-500/60
                  focus:ring-2
                  focus:ring-brand-500/10
                "
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                aria-label={
                  showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                }
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                  transition-colors
                  hover:text-slate-300
                "
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

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
    </>
  );
}
