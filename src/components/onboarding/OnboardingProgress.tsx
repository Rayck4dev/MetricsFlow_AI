"use client";

import { motion } from "framer-motion";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  const percentage = Math.min(
    Math.max((currentStep / totalSteps) * 100, 0),
    100,
  );

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
        <span className="uppercase tracking-wider">Configuração Inicial</span>
        <span className="text-brand-400">
          Etapa {currentStep} de {totalSteps}
        </span>
      </div>
      <div className="w-full h-2 bg-surface-panel border border-surface-border rounded-full overflow-hidden p-0.5">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-400 rounded-full shadow-lg shadow-brand-500/20"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
