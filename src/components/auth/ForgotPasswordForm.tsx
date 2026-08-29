"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Lock, Mail } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const redirectTo = `${window.location.origin}/auth/callback?next=/redefinir-senha`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        },
      );

      if (error) {
        console.error("Erro ao solicitar recuperação:", error);

        setError(
          error.message || "Não foi possível enviar o link de recuperação.",
        );

        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Erro inesperado na recuperação:", error);

      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {!success ? (
        <>
          <div className="mb-6">
            <div
              className="
                mb-4 flex h-10 w-10
                items-center justify-center
                rounded-xl
                border border-brand-500/20
                bg-brand-500/10
              "
            >
              <Lock size={18} className="text-brand-400" />
            </div>

            <h1 className="font-heading text-xl font-bold tracking-tight text-white">
              Recuperar senha
            </h1>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Informe o e-mail da sua conta e enviaremos um link para você criar
              uma nova senha.
            </p>
          </div>

          {error && (
            <div
              className="
                mb-4 rounded-xl
                border border-red-500/20
                bg-red-500/10
                px-3 py-2.5
              "
            >
              <p className="text-[11px] leading-4 text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-slate-300"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="
                    pointer-events-none
                    absolute left-3 top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@empresa.com"
                  className="
                    h-11 w-full rounded-xl
                    border border-surface-border
                    bg-surface-main
                    pl-9 pr-3
                    text-xs text-white
                    outline-none
                    placeholder:text-slate-600
                    transition-all
                    focus:border-brand-500/60
                    focus:ring-2
                    focus:ring-brand-500/10
                  "
                />
              </div>
            </div>

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
                  Enviando...
                </>
              ) : (
                <>
                  Enviar link de recuperação
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="
                text-xs font-medium
                text-slate-500
                transition-colors
                hover:text-slate-300
              "
            >
              Voltar para o login
            </Link>
          </div>
        </>
      ) : (
        <div className="py-4 text-center">
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

          <h1 className="font-heading text-xl font-bold tracking-tight text-white">
            E-mail enviado!
          </h1>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Se existir uma conta associada a este e-mail, você receberá um link
            para redefinir sua senha.
          </p>

          <p className="mt-2 text-[10px] leading-4 text-slate-600">
            Verifique também sua pasta de spam ou lixo eletrônico.
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
            Voltar para o login
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
