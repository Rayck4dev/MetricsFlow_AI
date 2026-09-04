"use client";

import { Building2 } from "lucide-react";

interface GoogleCompanyNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function GoogleCompanyNameField({
  value,
  onChange,
  error,
}: GoogleCompanyNameFieldProps) {
  return (
    <div
      className="
        rounded-2xl
        border border-brand-500/15
        bg-brand-500/[0.035]
        p-4
      "
    >
      <label
        htmlFor="google-company-name"
        className="
          mb-2 block
          text-[10px]
          font-bold uppercase
          tracking-[0.12em]
          text-slate-500
        "
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
          id="google-company-name"
          type="text"
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ex.: Studio Smart"
          className="
            h-11 w-full rounded-xl
            border border-surface-border
            bg-surface-main
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

      {error ? (
        <p className="mt-2 text-[9px] leading-4 text-red-400">{error}</p>
      ) : (
        <p className="mt-2 text-[9px] leading-4 text-slate-600">
          Você será cadastrado como proprietário desta empresa.
        </p>
      )}
    </div>
  );
}
