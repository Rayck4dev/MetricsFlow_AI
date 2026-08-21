"use client";

import {
  FileSpreadsheet,
  BookOpen,
  Smartphone,
  Laptop,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

interface OnboardingStepFinanceProps {
  selectedControl: string;
  onSelect: (control: string) => void;
}

const CONTROLS = [
  {
    id: "spreadsheets",
    label: "Planilhas (Excel, Google Sheets)",
    icon: FileSpreadsheet,
  },
  { id: "notebook", label: "Caderno / Anotações em papel", icon: BookOpen },
  { id: "app", label: "Aplicativo financeiro", icon: Smartphone },
  { id: "system", label: "Sistema de gestão (ERP)", icon: Laptop },
  { id: "none", label: "Não tenho um controle definido", icon: HelpCircle },
];

export default function OnboardingStepFinance({
  selectedControl,
  onSelect,
}: OnboardingStepFinanceProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-heading text-white">
          Como você controla suas finanças atualmente?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Queremos entender o seu hábito atual para facilitar sua migração para
          o MetricsFlow.
        </p>
      </div>

      <div className="space-y-3">
        {CONTROLS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedControl === item.id;

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
