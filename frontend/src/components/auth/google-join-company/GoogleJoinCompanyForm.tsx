"use client";

import { ArrowLeft, ArrowRight, Link2, Loader2 } from "lucide-react";
import { GoogleJoinCompanyNotice } from "./GoogleJoinCompanySections";

interface GoogleJoinCompanyFormProps {
  inviteCode: string;
  setInviteCode: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onBack: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function GoogleJoinCompanyForm({
  inviteCode,
  setInviteCode,
  error,
  setError,
  loading,
  onBack,
  onSubmit,
}: GoogleJoinCompanyFormProps) {
  return (
    <>
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-xs leading-5 text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="google-invite-code" className="mb-2 block text-xs font-semibold text-slate-300">
            Código da Empresa
          </label>
          <div className="relative">
            <Link2 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
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
                setInviteCode(event.target.value.replace(/\s/g, "").toUpperCase());
                if (error) setError("");
              }}
              placeholder="Ex.: ZGPUB3"
              className="h-12 w-full rounded-xl border border-surface-border bg-surface-main pl-9 pr-4 text-sm font-semibold uppercase tracking-[0.18em] text-white outline-none placeholder:text-slate-700 transition-all focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10"
            />
          </div>
          <p className="mt-2 text-[10px] leading-4 text-slate-600">
            O código é fornecido pelo proprietário da empresa.
          </p>
        </div>

        <GoogleJoinCompanyNotice />

        <div className="flex flex-col-reverse gap-3 border-t border-surface-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-surface-border px-4 text-xs font-semibold text-slate-500 transition-colors hover:bg-surface-sidebar hover:text-slate-300 disabled:pointer-events-none disabled:opacity-50"
          >
            <ArrowLeft size={14} />
            Voltar
          </button>
          <button
            type="submit"
            disabled={loading || !inviteCode.trim()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-xs font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500 hover:shadow-brand-500/25 disabled:pointer-events-none disabled:opacity-50"
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
    </>
  );
}
