"use client";

import Link from "next/link";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { useLogin } from "@/hooks/useLogin";
import { LoginCredentials } from "./login/LoginCredentials";

export function LoginForm() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    loading,
    googleLoading,
    error,
    handleSubmit,
    handleGoogleLogin,
  } = useLogin();

  const isDisabled = loading || googleLoading;

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
        <LoginCredentials
          email={email}
          password={password}
          showPassword={showPassword}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={togglePasswordVisibility}
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-xs font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500 hover:shadow-brand-500/25 disabled:cursor-not-allowed disabled:opacity-60"
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
        disabled={isDisabled}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar text-xs font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-surface-panel disabled:cursor-not-allowed disabled:opacity-60"
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
