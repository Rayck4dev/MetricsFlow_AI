"use client";

import {
  Target,
  TrendingUp,
  PieChart,
  DollarSign,
  Clock,
  Building2,
  CheckCircle2,
} from "lucide-react";

interface OnboardingStepGoalProps {
  selectedGoal: string;
  onSelect: (goal: string) => void;
}

const GOALS = [
  { id: "organize", label: "Organizar minhas finanças", icon: Target },
  { id: "profit", label: "Saber se estou tendo lucro", icon: TrendingUp },
  { id: "expenses", label: "Controlar melhor minhas despesas", icon: PieChart },
  { id: "sales", label: "Acompanhar minhas vendas", icon: DollarSign },
  { id: "time", label: "Economizar tempo", icon: Clock },
  { id: "overview", label: "Ter uma visão geral do negócio", icon: Building2 },
];

export default function OnboardingStepGoal({
  selectedGoal,
  onSelect,
}: OnboardingStepGoalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-heading text-white">
          Qual é o seu principal objetivo?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Isso nos ajuda a personalizar o painel principal e as métricas do seu
          negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOALS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedGoal === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-brand-500/15 border-brand-500 text-white shadow-lg shadow-brand-500/10"
                  : "bg-surface-panel/60 border-surface-border text-slate-300 hover:border-slate-600 hover:bg-surface-panel"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border ${
                    isSelected
                      ? "bg-brand-500 text-white border-brand-400"
                      : "bg-surface-sidebar text-slate-400 border-surface-border"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-xs md:text-sm font-medium">
                  {item.label}
                </span>
              </div>
              <CheckCircle2
                size={18}
                className={`transition-opacity ${
                  isSelected ? "text-brand-400 opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
