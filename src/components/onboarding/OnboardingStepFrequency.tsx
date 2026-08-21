"use client";

import {
  Calendar,
  CalendarDays,
  CalendarCheck,
  CalendarRange,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface OnboardingStepFrequencyProps {
  selectedFrequency: string;
  onSelect: (frequency: string) => void;
}

const FREQUENCIES = [
  { id: "daily", label: "Todos os dias", icon: CalendarCheck },
  {
    id: "few_times_week",
    label: "Algumas vezes por semana",
    icon: CalendarDays,
  },
  { id: "weekly", label: "Uma vez por semana", icon: Calendar },
  { id: "monthly", label: "Só no final do mês", icon: CalendarRange },
  { id: "rarely", label: "Quase nunca", icon: AlertCircle },
];

export default function OnboardingStepFrequency({
  selectedFrequency,
  onSelect,
}: OnboardingStepFrequencyProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-heading text-white">
          Com que frequência você acompanha suas finanças?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Ajustaremos os resumos do WhatsApp para o momento ideal da sua rotina.
        </p>
      </div>

      <div className="space-y-3">
        {FREQUENCIES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedFrequency === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
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
