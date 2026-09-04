"use client";

import { useState } from "react";
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
  Users,
  Loader2,
} from "lucide-react";

import { useRegister } from "@/hooks/useRegister";
import {
  RegistrationTypeSelect,
  type RegistrationType,
} from "@/components/auth/RegistrationTypeSelect";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

export function RegisterForm() {
  const {
    name,
    company,
    inviteCode,
    email,
    password,

    acceptedTerms,

    loading,
    googleLoading,
    error,

    registrationType,

    setName,
    setCompany,
    setInviteCode,
    setEmail,
    setPassword,
    setAcceptedTerms,

    handleRegistrationTypeChange,
    handleSubmit,
    handleGoogleRegister,
  } = useRegister();

  const [showPassword, setShowPassword] = useState(false);

  const isDisabled = loading || googleLoading;

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
          <Building2 size={17} className="text-brand-400" />
        </div>

        <h1 className="font-heading text-xl font-bold tracking-tight text-white">
          Crie sua conta
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          Comece a organizar as finanças da sua empresa de forma simples.
        </p>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
          <p className="text-[11px] leading-4 text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-xs font-semibold text-slate-300"
            >
              Seu nome
            </label>

            <div className="relative">
              <User
                size={15}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                disabled={isDisabled}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>
          </div>

          <RegistrationTypeSelect
            value={registrationType}
            onChange={handleRegistrationTypeChange}
            disabled={isDisabled}
          />
        </div>

        {registrationType === "create_company" ? (
          <CompanyField
            value={company}
            onChange={setCompany}
            disabled={isDisabled}
          />
        ) : (
          <InviteCodeField
            value={inviteCode}
            onChange={setInviteCode}
            disabled={isDisabled}
          />
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label
              htmlFor="register-email"
              className="mb-1 block text-xs font-semibold text-slate-300"
            >
              E-mail
            </label>

            <div className="relative">
              <Mail
                size={15}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                id="register-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="exemplo@gmail.com"
                disabled={isDisabled}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-1 block text-xs font-semibold text-slate-300"
            >
              Senha
            </label>

            <div className="relative">
              <Lock
                size={15}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo de 6 caracteres"
                disabled={isDisabled}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={isDisabled}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                  transition-colors
                  hover:text-slate-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
          <FeatureItem>Dashboard financeiro</FeatureItem>
          <FeatureItem>Receitas e despesas</FeatureItem>
          <FeatureItem>DRE automatizado</FeatureItem>
        </div>

        <label className="flex items-start gap-2 pt-0.5">
          <input
            type="checkbox"
            required
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            disabled={isDisabled}
            className="
              mt-0.2
              h-3.5
              w-3.5
              shrink-0
              rounded
              border-surface-border
              bg-surface-sidebar
              accent-brand-500
              disabled:cursor-not-allowed
            "
          />

          <span className="text-[9px] leading-[1.45] text-slate-500">
            Li e concordo com os{" "}
            <Link
              href="/termos-de-uso"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-400 transition-colors hover:text-brand-300 hover:underline"
            >
              Termos de Uso
            </Link>{" "}
            e estou ciente da{" "}
            <Link
              href="/politica-de-privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-400 transition-colors hover:text-brand-300 hover:underline"
            >
              Política de Privacidade
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={isDisabled || !acceptedTerms}
          className="
            flex h-10 w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-brand-600
            text-xs font-semibold
            text-white
            shadow-lg
            shadow-brand-600/20
            transition-all
            hover:bg-brand-500
            hover:shadow-brand-500/25
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
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
      </form>

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
        onClick={handleGoogleRegister}
        disabled={isDisabled || !acceptedTerms}
        className="
          flex h-10 w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border border-surface-border
          bg-surface-sidebar
          text-xs font-semibold
          text-slate-200
          transition-all
          hover:border-slate-600
          hover:bg-surface-panel
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {googleLoading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <GoogleIcon />
        )}

        {googleLoading ? "Conectando..." : "Continuar com Google"}
      </button>

      <div className="mt-3 border-t border-surface-border pt-3 text-center">
        <p className="text-[10px] text-slate-500">
          Já possui uma conta?{" "}
          <Link
            href="/login"
            className="
              font-semibold
              text-brand-400
              transition-colors
              hover:text-brand-300
            "
          >
            Entrar na plataforma
          </Link>
        </p>
      </div>
    </div>
  );
}

interface CompanyFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function CompanyField({
  value,
  onChange,
  disabled = false,
}: CompanyFieldProps) {
  return (
    <div>
      <label
        htmlFor="company"
        className="mb-1 block text-xs font-semibold text-slate-300"
      >
        Nome da empresa
      </label>

      <div className="relative">
        <Building2
          size={15}
          className="
            pointer-events-none
            absolute left-3 top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />

        <input
          id="company"
          name="company"
          type="text"
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ex.: Studio Smart"
          disabled={disabled}
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
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>

      <p className="mt-1 text-[9px] text-slate-600">
        Você será o proprietário e poderá convidar colaboradores.
      </p>
    </div>
  );
}

interface InviteCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function InviteCodeField({
  value,
  onChange,
  disabled = false,
}: InviteCodeFieldProps) {
  return (
    <div>
      <label
        htmlFor="invite-code"
        className="mb-1 block text-xs font-semibold text-slate-300"
      >
        Código de convite
      </label>

      <div className="relative">
        <Users
          size={15}
          className="
            pointer-events-none
            absolute left-3 top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />

        <input
          id="invite-code"
          name="invite-code"
          type="text"
          required
          maxLength={10}
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          placeholder="Ex.: ABC123"
          disabled={disabled}
          className="
            h-10 w-full rounded-xl
            border border-surface-border
            bg-surface-sidebar
            pl-9 pr-3
            text-xs font-semibold
            uppercase tracking-wider
            text-white
            outline-none
            placeholder:text-slate-600
            transition-all
            focus:border-brand-500/60
            focus:ring-2
            focus:ring-brand-500/10
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>

      <p className="mt-1 text-[9px] text-slate-600">
        O código é fornecido pelo proprietário da empresa.
      </p>
    </div>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/10">
        <Check size={8} className="text-emerald-400" />
      </div>

      <span className="text-[9px] text-slate-500">{children}</span>
    </div>
  );
}
