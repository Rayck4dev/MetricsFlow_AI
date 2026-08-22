"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setLoading(false);
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

        <p className="mt-1 text-xs text-slate-400">
          Acesse sua conta para acompanhar as finanças da sua empresa.
        </p>
      </div>

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
          disabled={loading}
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

      <div className="mt-4 border-t border-surface-border pt-3 text-center">
        <p className="text-xs text-slate-500">
          Ainda não possui uma conta?{" "}
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