"use client";

import { useState } from "react";

import { joinCompanyByCode } from "@/services/company/joinCompany";
import { GoogleJoinCompanyForm } from "./google-join-company/GoogleJoinCompanyForm";
import { GoogleJoinCompanyIntro } from "./google-join-company/GoogleJoinCompanySections";

interface GoogleJoinCompanyProps {
  onBack: () => void;
  onSuccess: (companyId: string, companyName?: string | null) => void;
}

export default function GoogleJoinCompany({
  onBack,
  onSuccess,
}: GoogleJoinCompanyProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const code = inviteCode.trim().toUpperCase();

    setError("");

    if (!code) {
      setError("Informe o código de convite da empresa.");
      return;
    }

    setLoading(true);

    try {
      const result = await joinCompanyByCode(code);

      if (!result.success) {
        throw new Error(
          result.message || "Não foi possível entrar na empresa.",
        );
      }

      sessionStorage.removeItem("metricsflow_registration");

      if (result.company_id) {
        localStorage.setItem("metricsflow_company_id", result.company_id);
      }

      if (result.company_name) {
        localStorage.setItem("metricsflow_company", result.company_name);
      }

      localStorage.setItem("metricsflow_role", result.role || "collaborator");

      onSuccess(result.company_id, result.company_name ?? null);
    } catch (err) {
      console.error("Erro ao entrar na empresa:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível entrar na empresa.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <GoogleJoinCompanyIntro />

      <GoogleJoinCompanyForm inviteCode={inviteCode} setInviteCode={setInviteCode} error={error} setError={setError} loading={loading} onBack={onBack} onSubmit={handleSubmit} />
    </div>
  );
}
