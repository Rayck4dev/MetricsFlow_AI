"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useRegister } from "@/hooks/useRegister";
import { RegisterActions } from "./register/RegisterActions";
import { RegisterCompanyDetails } from "./register/RegisterCompanyDetails";
import { RegisterCredentials } from "./register/RegisterCredentials";
import { RegisterHeader } from "./register/RegisterHeader";
import { RegisterLegalConsent } from "./register/RegisterLegalConsent";

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

  const isDisabled = loading || googleLoading;

  return (
    <div className="w-full">
      <RegisterHeader />

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
          <p className="text-[11px] leading-4 text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <RegisterCompanyDetails
          name={name}
          company={company}
          inviteCode={inviteCode}
          registrationType={registrationType}
          disabled={isDisabled}
          onNameChange={setName}
          onCompanyChange={setCompany}
          onInviteCodeChange={setInviteCode}
          onRegistrationTypeChange={handleRegistrationTypeChange}
        />
        <RegisterCredentials
          email={email}
          password={password}
          disabled={isDisabled}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
          <FeatureItem>Dashboard financeiro</FeatureItem>
          <FeatureItem>Receitas e despesas</FeatureItem>
          <FeatureItem>DRE automatizado</FeatureItem>
        </div>

        <RegisterLegalConsent
          accepted={acceptedTerms}
          onChange={setAcceptedTerms}
          disabled={isDisabled}
        />
        <RegisterActions
          registrationType={registrationType}
          loading={loading}
          googleLoading={googleLoading}
          disabled={isDisabled || !acceptedTerms}
          onRegisterWithGoogle={handleGoogleRegister}
        />
      </form>

      <div className="mt-3 border-t border-surface-border pt-3 text-center">
        <p className="text-[10px] text-slate-500">
          Já possui uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
          >
            Entrar na plataforma
          </Link>
        </p>
      </div>
    </div>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/10 text-[8px] text-emerald-400">
        <Check size={8} />
      </span>
      <span className="text-[9px] text-slate-500">{children}</span>
    </div>
  );
}
