"use client";

import { Check } from "lucide-react";

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

export default function OnboardingStepMetrics({
  selectedMetrics,
  onToggle,
}: OnboardingStepMetricsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-heading text-white">
          O que você gostaria de acompanhar no MetricsFlow?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Você pode escolher múltiplas opções. Elas definirão os cartões em
          destaque no seu Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {METRICS_OPTIONS.map((item) => {
          const isSelected = selectedMetrics.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-brand-500/15 border-brand-500 text-white shadow-lg shadow-brand-500/10"
                  : "bg-surface-panel/60 border-surface-border text-slate-300 hover:border-slate-600 hover:bg-surface-panel"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-1 bg-surface-sidebar rounded-xl border border-surface-border/50">
                  {item.emoji}
                </span>
                <span className="text-xs md:text-sm font-medium">
                  {item.label}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-brand-500 border-brand-400 text-white"
                    : "border-surface-border bg-surface-sidebar"
                }`}
              >
                {isSelected && <Check size={13} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
