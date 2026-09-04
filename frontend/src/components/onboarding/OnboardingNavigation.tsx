"use client";

import { ArrowLeft, ArrowRight, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

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

  const isLastStep = currentStep === totalSteps;

  return (
    <div className="mt-8 flex items-center justify-between border-t border-surface-border/60 pt-8">
      <motion.button
        type="button"
        onClick={onBack}
        disabled={currentStep === 1}
        whileHover={currentStep !== 1 ? { x: -2 } : {}}
        whileTap={currentStep !== 1 ? { scale: 0.97 } : {}}
        className="
          flex cursor-pointer
          items-center gap-2
          rounded-xl
          border border-transparent
          px-4 py-2.5
          text-xs text-slate-400
          transition-colors
          hover:border-surface-border
          hover:text-white
          disabled:cursor-default
          disabled:opacity-0
          disabled:pointer-events-none
        "
      >
        <ArrowLeft size={14} />
        Voltar
      </motion.button>

      <motion.button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        whileHover={canProceed ? { scale: 1.03 } : {}}
        whileTap={canProceed ? { scale: 0.97 } : {}}
        className={`
          group flex cursor-pointer
          items-center gap-2
          rounded-xl
          px-6 py-2.5
          text-xs font-semibold
          text-white
          shadow-lg
          transition-all
          disabled:cursor-not-allowed
          disabled:opacity-30
          ${
            isLastStep
              ? "bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-500"
              : "bg-brand-600 shadow-brand-600/25 hover:bg-brand-500"
          }
        `}
      >
        {isLastStep ? (
          <>
            <CheckCheck size={14} />
            <span>Concluir configuração</span>
          </>
        ) : (
          <>
            <span>Continuar</span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </motion.button>
    </div>
  );
}
