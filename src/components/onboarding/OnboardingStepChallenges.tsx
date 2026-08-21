"use client";

import {
  Hourglass,
  HelpCircle,
  Layers,
  Receipt,
  BarChart2,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface OnboardingStepChallengesProps {
  selectedChallenge: string;
  onSelect: (challenge: string) => void;
}

const CHALLENGES = [
  { id: "time", label: "Não tenho tempo para registrar tudo", icon: Hourglass },
  {
    id: "profit_margin",
    label: "Não sei exatamente quanto estou lucrando",
    icon: HelpCircle,
  },
  {
    id: "mixed_expenses",
    label: "Misturo despesas pessoais e da empresa",
    icon: Layers,
  },
  {
    id: "forget_sales",
    label: "Esqueço de registrar vendas e entradas",
    icon: Receipt,
  },
  {
    id: "interpret_data",
    label: "Tenho dificuldade para interpretar os números",
    icon: BarChart2,
  },
  {
    id: "cash_flow",
    label: "Não consigo acompanhar meu fluxo de caixa",
    icon: Activity,
  },
];

export default function OnboardingStepChallenges({
  selectedChallenge,
  onSelect,
}: OnboardingStepChallengesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-heading text-white">
          Qual é a sua maior dificuldade hoje?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          O agente inteligente do WhatsApp vai focar em resolver esse gargalo no
          seu dia a dia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHALLENGES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedChallenge === item.id;

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
