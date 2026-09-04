"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Link2, Loader2 } from "lucide-react";

import { joinCompanyByCode } from "@/services/company/joinCompany";

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
      <div>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
          <Link2 size={18} className="text-brand-400" />
        </div>

        <h2 className="font-heading text-xl font-bold text-white md:text-2xl">
          Entrar em uma empresa
        </h2>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Informe o código de convite que você recebeu do proprietário da
          empresa.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-xs leading-5 text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="google-invite-code"
            className="mb-2 block text-xs font-semibold text-slate-300"
          >
            Código da empresa
          </label>

          <div className="relative">
            <Link2
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="google-invite-code"
              name="inviteCode"
              type="text"
              required
              maxLength={10}
              autoFocus
              autoComplete="off"
              value={inviteCode}
              onChange={(event) => {
                setInviteCode(
                  event.target.value.replace(/\s/g, "").toUpperCase(),
                );

                if (error) {
                  setError("");
                }
              }}
              placeholder="Ex.: ZGPUB3"
              className="
                h-12 w-full rounded-xl
                border border-surface-border
                bg-surface-main
                pl-9 pr-4
                text-sm font-semibold
                uppercase tracking-[0.18em]
                text-white
                outline-none
                placeholder:text-slate-700
                transition-all
                focus:border-brand-500/60
                focus:ring-2
                focus:ring-brand-500/10
              "
            />
          </div>

          <p className="mt-2 text-[10px] leading-4 text-slate-600">
            O código é fornecido pelo proprietário da empresa.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-500/10 bg-brand-500/[0.035] p-4">
          <p className="text-[10px] font-semibold text-brand-300">
            Você entrará como colaborador
          </p>

          <p className="mt-1 text-[9px] leading-4 text-slate-600">
            O acesso será vinculado à empresa do convite.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-surface-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="
              inline-flex h-10
              items-center justify-center gap-2
              rounded-xl
              border border-surface-border
              px-4
              text-xs font-semibold
              text-slate-500
              transition-colors
              hover:bg-surface-sidebar
              hover:text-slate-300
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <ArrowLeft size={14} />
            Voltar
          </button>

          <button
            type="submit"
            disabled={loading || !inviteCode.trim()}
            className="
              inline-flex h-10
              items-center justify-center gap-2
              rounded-xl
              bg-brand-600
              px-5
              text-xs font-semibold
              text-white
              shadow-lg shadow-brand-600/20
              transition-all
              hover:bg-brand-500
              hover:shadow-brand-500/25
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar na empresa
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
