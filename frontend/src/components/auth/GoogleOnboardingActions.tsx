"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface GoogleOnboardingActionsProps {
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
}

export function GoogleOnboardingActions({
  canContinue,
  onBack,
  onContinue,
}: GoogleOnboardingActionsProps) {
  return (
    <div
      className="
        flex items-center justify-between
        border-t border-surface-border
        pt-5
      "
    >
      <button
        type="button"
        onClick={onBack}
        disabled={!canContinue}
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
        onClick={onContinue}
        disabled={!canContinue}
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
  );
}
