"use client";

import { Check, Lightbulb } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface OnboardingStepMetricsProps {
  selectedMetrics: string[];
  onToggle: (metricId: string) => void;
}

const METRICS_OPTIONS = [
  { id: "revenue", emoji: "💰", label: "Faturamento" },
  { id: "expenses", emoji: "📉", label: "Despesas" },
  { id: "profit", emoji: "📊", label: "Lucro" },
  { id: "cash_flow", emoji: "🧾", label: "Fluxo de Caixa" },
  { id: "profit_margin", emoji: "📈", label: "Margem de Lucro" },
  { id: "dre", emoji: "🧮", label: "DRE Automatizado" },
  { id: "mei_limit", emoji: "🎯", label: "Limite do MEI" },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 5,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export default function OnboardingStepMetrics({
  selectedMetrics,
  onToggle,
}: OnboardingStepMetricsProps) {
  const count = selectedMetrics.length;

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold font-heading text-white">
            Quais indicadores você quer acompanhar?
          </h2>

          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Selecione quantos quiser. Você pode escolher mais de um indicador
            para acompanhar no seu Dashboard.
          </p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
      >
        {METRICS_OPTIONS.map((metricItem) => {
          const isSelected = selectedMetrics.includes(metricItem.id);

          return (
            <motion.button
              key={metricItem.id}
              variants={item}
              type="button"
              onClick={() => onToggle(metricItem.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className={`flex items-center justify-between min-h-[52px] px-3 py-2 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? "bg-brand-500/15 border-brand-500 text-white shadow-md shadow-brand-500/10"
                  : "bg-surface-panel/60 border-surface-border text-slate-300 hover:border-slate-600 hover:bg-surface-panel"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs p-1.5 bg-surface-sidebar rounded-lg border border-surface-border/50 leading-none shrink-0">
                  {metricItem.emoji}
                </span>

                <span className="text-[11px] md:text-xs font-medium leading-snug">
                  {metricItem.label}
                </span>
              </div>

              <motion.div
                animate={{
                  backgroundColor: isSelected
                    ? "rgb(99 102 241)"
                    : "transparent",
                  borderColor: isSelected
                    ? "rgb(99 102 241 / 0.7)"
                    : "rgb(51 65 85)",
                }}
                transition={{ duration: 0.15 }}
                className="w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 ml-2"
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Check size={11} strokeWidth={3} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.35,
          duration: 0.25,
        }}
        className="flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2"
      >
        <Lightbulb size={14} className="shrink-0 text-amber-400" />

        <p className="text-[10px] leading-relaxed text-amber-200/80">
          Você poderá alterar essas preferências a qualquer momento nas
          configurações do seu perfil.
        </p>
      </motion.div>
    </div>
  );
}
