"use client";

import { motion } from "framer-motion";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  "Objetivo",
  "Controle",
  "Desafio",
  "Métricas",
  "Frequência",
];

export default function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  const percentage = Math.min(
    Math.max((currentStep / totalSteps) * 100, 0),
    100,
  );

  return (
    <div className="w-full mb-8 space-y-4">
      <div className="flex items-center justify-between gap-1">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isDone = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div
              key={step}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isDone
                    ? "rgb(99 102 241 / 0.9)"
                    : isActive
                      ? "rgb(99 102 241)"
                      : "rgb(30 41 59)",
                  borderColor: isDone
                    ? "rgb(99 102 241 / 0.5)"
                    : isActive
                      ? "rgb(99 102 241)"
                      : "rgb(51 65 85)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                title={STEP_LABELS[index]}
                className="h-7 w-7 rounded-full border-2 flex items-center justify-center shadow-sm"
              >
                {isDone ? (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    className="h-3.5 w-3.5 text-white"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                ) : (
                  <span
                    className={`text-[10px] font-bold ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {step}
                  </span>
                )}
              </motion.div>

              <span
                className={`hidden sm:block text-[9px] font-medium tracking-wide transition-colors duration-300 ${
                  isActive
                    ? "text-brand-400"
                    : isDone
                      ? "text-slate-500"
                      : "text-slate-600"
                }`}
              >
                {STEP_LABELS[index]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <div className="w-full h-1.5 bg-surface-panel border border-surface-border/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-400 rounded-full"
            style={{ boxShadow: "0 0 8px rgb(99 102 241 / 0.4)" }}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
