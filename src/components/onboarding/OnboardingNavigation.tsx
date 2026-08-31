"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
}

export default function OnboardingNavigation({
  currentStep,
  totalSteps,
  canProceed,
  onBack,
  onNext,
}: OnboardingNavigationProps) {
  if (currentStep > totalSteps) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-between border-t border-surface-border/60 pt-8">
      <button
        type="button"
        onClick={onBack}
        disabled={currentStep === 1}
        className="
          flex cursor-pointer
          items-center gap-2
          rounded-xl
          border border-transparent
          px-4 py-2.5
          text-xs text-slate-400
          transition-all
          hover:border-surface-border
          hover:text-white
          disabled:cursor-default
          disabled:opacity-0
        "
      >
        <ArrowLeft size={14} />
        Voltar
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        className="
          group flex cursor-pointer
          items-center gap-2
          rounded-xl
          bg-brand-600
          px-6 py-2.5
          text-xs font-semibold
          text-white
          shadow-lg
          shadow-brand-600/25
          transition-all
          hover:bg-brand-500
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <span>{currentStep === totalSteps ? "Finalizar" : "Continuar"}</span>

        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </div>
  );
}
