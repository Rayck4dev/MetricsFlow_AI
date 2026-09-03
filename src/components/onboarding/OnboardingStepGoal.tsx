"use client";

import {
  Target,
  TrendingUp,
  PieChart,
  DollarSign,
  Clock,
  Building2,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

interface OnboardingStepGoalProps {
  selectedGoal: string;
  onSelect: (goal: string) => void;
}

const GOALS = [
  { id: "organize", label: "Organizar minhas finanças", icon: Target },
  { id: "profit", label: "Acompanhar meu lucro", icon: TrendingUp },
  { id: "expenses", label: "Entender meus gastos", icon: PieChart },
  { id: "sales", label: "Acompanhar minhas vendas", icon: DollarSign },
  { id: "time", label: "Economizar tempo", icon: Clock },
  { id: "overview", label: "Melhorar meu planejamento", icon: Building2 },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 6,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: "easeOut",
    },
  },
};

export default function OnboardingStepGoal({
  selectedGoal,
  onSelect,
}: OnboardingStepGoalProps) {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-lg md:text-xl font-bold font-heading text-white">
          Qual é o seu principal objetivo?
        </h2>

        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Isso nos ajuda a personalizar o painel e destacar as métricas mais
          relevantes para você.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
      >
        {GOALS.map((goalItem) => {
          const Icon = goalItem.icon;
          const isSelected = selectedGoal === goalItem.id;

          return (
            <motion.button
              key={goalItem.id}
              variants={item}
              type="button"
              onClick={() => onSelect(goalItem.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className={`flex items-center justify-between min-h-[62px] px-3.5 py-3 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? "bg-brand-500/15 border-brand-500 text-white shadow-md shadow-brand-500/10"
                  : "bg-surface-panel/60 border-surface-border text-slate-300 hover:border-slate-600 hover:bg-surface-panel"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-2 rounded-lg border shrink-0 transition-colors duration-200 ${
                    isSelected
                      ? "bg-brand-500 text-white border-brand-400"
                      : "bg-surface-sidebar text-slate-400 border-surface-border"
                  }`}
                >
                  <Icon size={16} />
                </div>

                <span className="text-xs md:text-sm font-medium leading-snug">
                  {goalItem.label}
                </span>
              </div>

              <CheckCircle2
                size={17}
                className={`shrink-0 ml-2 transition-all duration-200 ${
                  isSelected
                    ? "text-brand-400 opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
              />
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.25,
        }}
        className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5"
      >
        <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-400" />

        <p className="text-[11px] leading-relaxed text-amber-200/80">
          Seu objetivo ajuda o MetricsFlow a destacar as informações mais
          importantes para sua rotina.
        </p>
      </motion.div>
    </div>
  );
}
