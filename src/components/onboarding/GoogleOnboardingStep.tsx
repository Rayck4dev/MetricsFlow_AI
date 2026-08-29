"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Link2 } from "lucide-react";

type RegistrationType = "create_company" | "join_company";

interface GoogleOnboardingStepProps {
  onSelect: (type: RegistrationType, companyName?: string) => void;
}

export default function GoogleOnboardingStep({
  onSelect,
}: GoogleOnboardingStepProps) {
  const [selectedType, setSelectedType] = useState<RegistrationType | null>(
    null,
  );

  const [companyName, setCompanyName] = useState("");

  const [error, setError] = useState("");

  function handleSelect(type: RegistrationType) {
    setSelectedType(type);
    setError("");

    if (type === "join_company") {
      setCompanyName("");
    }
  }

  function handleContinue() {
    if (!selectedType) {
      setError("Selecione como deseja utilizar o MetricsFlow.");
      return;
    }

    if (selectedType === "create_company" && !companyName.trim()) {
      setError("Informe o nome da empresa.");
      return;
    }

    onSelect(
      selectedType,
      selectedType === "create_company" ? companyName.trim() : undefined,
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div
          className="
            mb-4
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-brand-500/20
            bg-brand-500/10
          "
        >
          <Building2 size={18} className="text-brand-400" />
        </div>

        <h1
          className="
            font-heading text-xl font-bold
            tracking-tight text-white
            md:text-2xl
          "
        >
          Como deseja começar?
        </h1>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Sua conta do Google foi criada com sucesso. Agora escolha como deseja
          utilizar o MetricsFlow AI.
        </p>
      </div>

      {error && (
        <div
          className="
            rounded-xl
            border border-red-500/20
            bg-red-500/10
            px-4 py-3
          "
        >
          <p className="text-xs leading-5 text-red-300">{error}</p>
        </div>
      )}

      <div className="space-y-3">

        <button
          type="button"
          onClick={() => handleSelect("create_company")}
          className={`
            group w-full rounded-2xl
            border p-4 text-left
            transition-all
            ${
              selectedType === "create_company"
                ? "border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10"
                : "border-surface-border bg-surface-sidebar hover:border-slate-600 hover:bg-surface-panel"
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div
              className={`
                flex h-11 w-11
                shrink-0 items-center
                justify-center rounded-xl
                border
                ${
                  selectedType === "create_company"
                    ? "border-brand-400 bg-brand-500 text-white"
                    : "border-surface-border bg-surface-main text-slate-400"
                }
              `}
            >
              <Building2 size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-white">
                Criar minha empresa
              </h2>

              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                Criar uma nova empresa e acessar como proprietário.
              </p>
            </div>

            <ArrowRight
              size={16}
              className={`
                shrink-0 transition-all
                ${
                  selectedType === "create_company"
                    ? "translate-x-1 text-brand-400"
                    : "text-slate-600 group-hover:translate-x-1 group-hover:text-brand-400"
                }
              `}
            />
          </div>
        </button>


        {selectedType === "create_company" && (
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
                value={companyName}
                onChange={(event) => {
                  setCompanyName(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
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

            <p className="mt-2 text-[9px] leading-4 text-slate-600">
              Você será cadastrado como proprietário desta empresa.
            </p>
          </div>
        )}


        <button
          type="button"
          onClick={() => handleSelect("join_company")}
          className={`
            group w-full rounded-2xl
            border p-4 text-left
            transition-all
            ${
              selectedType === "join_company"
                ? "border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10"
                : "border-surface-border bg-surface-sidebar hover:border-slate-600 hover:bg-surface-panel"
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div
              className={`
                flex h-11 w-11
                shrink-0 items-center
                justify-center rounded-xl
                border
                ${
                  selectedType === "join_company"
                    ? "border-brand-400 bg-brand-500 text-white"
                    : "border-surface-border bg-surface-main text-slate-400"
                }
              `}
            >
              <Link2 size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-white">
                Entrar em uma empresa
              </h2>

              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                Já recebeu um código de convite? Entre como colaborador.
              </p>
            </div>

            <ArrowRight
              size={16}
              className={`
                shrink-0 transition-all
                ${
                  selectedType === "join_company"
                    ? "translate-x-1 text-brand-400"
                    : "text-slate-600 group-hover:translate-x-1 group-hover:text-brand-400"
                }
              `}
            />
          </div>
        </button>
      </div>


      <div
        className="
          flex items-center justify-between
          border-t border-surface-border
          pt-5
        "
      >
        <button
          type="button"
          onClick={() => {
            setSelectedType(null);
            setCompanyName("");
            setError("");
          }}
          disabled={!selectedType}
          className="
            inline-flex h-10
            items-center gap-2
            rounded-xl
            px-4
            text-xs font-semibold
            text-slate-500
            transition-colors
            hover:bg-surface-sidebar
            hover:text-slate-300
            disabled:pointer-events-none
            disabled:opacity-0
          "
        >
          <ArrowLeft size={14} />
          Voltar
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={
            !selectedType ||
            (selectedType === "create_company" && !companyName.trim())
          }
          className="
            inline-flex h-10
            items-center gap-2
            rounded-xl
            bg-brand-600
            px-5
            text-xs font-semibold
            text-white
            shadow-lg
            shadow-brand-600/20
            transition-all
            hover:bg-brand-500
            disabled:pointer-events-none
            disabled:opacity-40
          "
        >
          Continuar
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
