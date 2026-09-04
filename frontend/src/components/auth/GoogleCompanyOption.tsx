"use client";

import { ArrowRight, Building2, Link2 } from "lucide-react";

export type RegistrationType = "create_company" | "join_company";

interface GoogleCompanyOptionProps {
  type: RegistrationType;
  selected: boolean;
  onSelect: (type: RegistrationType) => void;
}

export function GoogleCompanyOption({
  type,
  selected,
  onSelect,
}: GoogleCompanyOptionProps) {
  const isCreate = type === "create_company";

  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      className={`
        group w-full rounded-2xl
        border p-4 text-left
        transition-all
        ${
          selected
            ? "border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10"
            : "border-surface-border bg-surface-sidebar hover:border-slate-600 hover:bg-surface-panel"
        }
      `}
    >
      <div className="flex items-center gap-4">
        <div
          className={`
            flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-xl border
            ${
              selected
                ? "border-brand-400 bg-brand-500 text-white"
                : "border-surface-border bg-surface-main text-slate-400"
            }
          `}
        >
          {isCreate ? <Building2 size={20} /> : <Link2 size={20} />}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-white">
            {isCreate ? "Criar minha empresa" : "Entrar em uma empresa"}
          </h2>

          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            {isCreate
              ? "Criar uma nova empresa e acessar como proprietário."
              : "Já recebeu um código de convite? Entre como colaborador."}
          </p>
        </div>

        <ArrowRight
          size={16}
          className={`
            shrink-0 transition-all
            ${
              selected
                ? "translate-x-1 text-brand-400"
                : "text-slate-600 group-hover:translate-x-1 group-hover:text-brand-400"
            }
          `}
        />
      </div>
    </button>
  );
}
