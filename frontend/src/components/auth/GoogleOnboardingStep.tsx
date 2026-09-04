"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

import {
  GoogleCompanyOption,
  type RegistrationType,
} from "./GoogleCompanyOption";

import { GoogleCompanyNameField } from "./GoogleCompanyNameField";
import { GoogleOnboardingActions } from "./GoogleOnboardingActions";

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

  function handleBack() {
    setSelectedType(null);
    setCompanyName("");
    setError("");
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

  const canContinue =
    !!selectedType && (selectedType === "join_company" || !!companyName.trim());

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
        <GoogleCompanyOption
          type="create_company"
          selected={selectedType === "create_company"}
          onSelect={handleSelect}
        />

        {selectedType === "create_company" && (
          <GoogleCompanyNameField
            value={companyName}
            onChange={(value) => {
              setCompanyName(value);

              if (error) {
                setError("");
              }
            }}
            error={error === "Informe o nome da empresa." ? error : undefined}
          />
        )}

        <GoogleCompanyOption
          type="join_company"
          selected={selectedType === "join_company"}
          onSelect={handleSelect}
        />
      </div>

      <GoogleOnboardingActions
        canContinue={canContinue}
        onBack={handleBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
