"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Loader2,
} from "lucide-react";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    // Aqui entrará a criação real do usuário.

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
  }

  return (
    <div className="w-full">
      <div className="mb-7">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
          <Building2 size={20} className="text-brand-400" />
        </div>

        <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
          Crie sua conta
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Comece a organizar as finanças da sua empresa de forma simples.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs font-semibold text-slate-300"
          >
            Seu nome
          </label>

          <div className="relative">
            <User
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome completo"
              className="
                h-11 w-full rounded-xl
                border border-surface-border
                bg-surface-sidebar
                pl-11 pr-4
                text-sm text-white
                outline-none
                placeholder:text-slate-600
                transition-all
                focus:border-brand-500/60
                focus:ring-4
                focus:ring-brand-500/10
              "
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="company"
            className="mb-2 block text-xs font-semibold text-slate-300"
          >
            Nome da empresa
          </label>

          <div className="relative">
            <Building2
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="company"
              type="text"
              required
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Ex.: Studio Smart"
              className="
                h-11 w-full rounded-xl
                border border-surface-border
                bg-surface-sidebar
                pl-11 pr-4
                text-sm text-white
                outline-none
                placeholder:text-slate-600
                transition-all
                focus:border-brand-500/60
                focus:ring-4
                focus:ring-brand-500/10
              "
            />
          </div>

          <p className="mt-1.5 text-[10px] text-slate-600">
            Esse nome será usado para personalizar sua plataforma.
          </p>
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-2 block text-xs font-semibold text-slate-300"
          >
            E-mail
          </label>

          <div className="relative">
            <Mail
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@empresa.com"
              className="
                h-11 w-full rounded-xl
                border border-surface-border
                bg-surface-sidebar
                pl-11 pr-4
                text-sm text-white
                outline-none
                placeholder:text-slate-600
                transition-all
                focus:border-brand-500/60
                focus:ring-4
                focus:ring-brand-500/10
              "
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="mb-2 block text-xs font-semibold text-slate-300"
          >
            Senha
          </label>

          <div className="relative">
            <Lock
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 6 caracteres"
              className="
                h-11 w-full rounded-xl
                border border-surface-border
                bg-surface-sidebar
                pl-11 pr-12
                text-sm text-white
                outline-none
                placeholder:text-slate-600
                transition-all
                focus:border-brand-500/60
                focus:ring-4
                focus:ring-brand-500/10
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="
                absolute right-3.5 top-1/2
                -translate-y-1/2
                text-slate-500
                transition-colors
                hover:text-slate-300
              "
            >
              {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-sidebar/60 p-4">
          <p className="mb-3 text-[11px] font-semibold text-slate-300">
            Sua conta inclui:
          </p>

          <div className="grid gap-2">
            {[
              "Dashboard financeiro",
              "Registro de receitas e despesas",
              "DRE automatizado",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10">
                  <Check size={10} className="text-emerald-400" />
                </div>

                <span className="text-[11px] text-slate-400">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-border bg-surface-sidebar accent-brand-500"
          />

          <span className="text-[10px] leading-relaxed text-slate-500">
            Concordo com os termos de uso e com a política de privacidade do
            MetricsFlow AI.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="
            flex h-12 w-full items-center
            justify-center gap-2
            rounded-xl
            bg-brand-600
            text-sm font-semibold text-white
            shadow-xl shadow-brand-600/20
            transition-all
            hover:bg-brand-500
            hover:shadow-brand-500/25
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Criando conta...
            </>
          ) : (
            <>
              Criar minha conta
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      <div className="mt-7 border-t border-surface-border pt-5 text-center">
        <p className="text-xs text-slate-500">Já possui uma conta?</p>

        <Link
          href="/login"
          className="mt-1 inline-block text-sm font-semibold text-brand-400 transition-colors hover:text-brand-300"
        >
          Entrar na plataforma
        </Link>
      </div>
    </div>
  );
}
