"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message,
      );

      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("Não foi possível entrar com o Google.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
          <Lock size={18} className="text-brand-400" />
        </div>

        <h1 className="font-heading text-xl font-bold tracking-tight text-white">
          Bem-vindo de volta
        </h1>

        <p className="mt-2 text-xs text-slate-400">
          Já possui uma conta ou faz parte de uma empresa? <br />
          Acesse sua conta para continuar.
        </p>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
          <p className="text-[11px] leading-4 text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-semibold text-slate-300"
          >
            E-mail
          </label>

          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@empresa.com"
              className="
                h-10 w-full rounded-xl
                border border-surface-border
                bg-surface-sidebar
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

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-300"
            >
              Senha
            </label>

            <button
              type="button"
              className="text-[11px] font-medium text-brand-400 transition-colors hover:text-brand-300"
            >
              Esqueci minha senha
            </button>
          </div>

          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="
                h-10 w-full rounded-xl
                border border-surface-border
                bg-surface-sidebar
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
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 pt-1">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-surface-border bg-surface-sidebar accent-brand-500"
          />

          <span className="text-xs text-slate-400">Manter conectado</span>
        </label>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="
            flex h-10 w-full items-center
            justify-center gap-2
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
              Entrando...
            </>
          ) : (
            <>
              Entrar na plataforma
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-border" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-surface-main px-3 text-[10px] text-slate-600">
            ou continue com
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading || googleLoading}
        className="
          flex h-10 w-full items-center
          justify-center gap-2
          rounded-xl
          border border-surface-border
          bg-surface-sidebar
          text-xs font-semibold text-slate-200
          transition-all
          hover:border-slate-600
          hover:bg-surface-panel
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {googleLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <GoogleIcon />
        )} 
        

        {googleLoading ? "Conectando..." : "Continuar com Google"}
      </button>

      <div className="mt-4 border-t border-surface-border pt-3 text-center">
        <p className="text-xs text-slate-500">
          Novo por aqui?{" "}
          <Link
            href="/cadastro"
            className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
          >
            Criar minha conta grátis
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.23-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
      />
      <path
        fill="#34A853"
        d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.75a5.85 5.85 0 0 1 0-3.5V7.72H3.3a9.74 9.74 0 0 0 0 8.56l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.22c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.27 14.63 2.33 12 2.33a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.94 9.46 6.22 12 6.22Z"
      />
    </svg>
  );
}
