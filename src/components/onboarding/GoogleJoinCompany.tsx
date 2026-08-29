"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Link2, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

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

    const normalizedCode = inviteCode.trim().toUpperCase();

    setError("");

    if (!normalizedCode) {
      setError("Informe o código de convite da empresa.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error("Sua sessão não foi encontrada. Faça login novamente.");
      }

      const { data, error: rpcError } = await supabase.rpc(
        "join_company_by_code",
        {
          code_input: normalizedCode,
        },
      );

      if (rpcError) {
        console.error("❌ Erro ao entrar na empresa:", rpcError);

        throw rpcError;
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Não foi possível entrar na empresa com este código.",
        );
      }

      sessionStorage.removeItem("metricsflow_registration");

      if (data.company_id) {
        localStorage.setItem("metricsflow_company_id", data.company_id);
      }

      if (data.company_name) {
        localStorage.setItem("metricsflow_company", data.company_name);
      }

      localStorage.setItem("metricsflow_role", data.role || "collaborator");

      console.log("✅ Google entrou na empresa:", data);

      onSuccess(data.company_id, data.company_name ?? null);
    } catch (err) {
      console.error("💥 Erro ao processar entrada por convite:", err);

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
            O acesso será vinculado à empresa do convite. Recursos
            administrativos, como DRE e gerenciamento da empresa, permanecem
            disponíveis apenas para o proprietário.
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
