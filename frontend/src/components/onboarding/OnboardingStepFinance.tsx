"use client";

import {
  FileSpreadsheet,
  BookOpen,
  Smartphone,
  Laptop,
  HelpCircle,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

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
  {
    id: "notebook",
    label: "Caderno / Anotações em papel",
    icon: BookOpen,
  },
  {
    id: "app",
    label: "Aplicativo financeiro",
    icon: Smartphone,
  },
  {
    id: "system",
    label: "Sistema de gestão (ERP)",
    icon: Laptop,
  },
  {
    id: "none",
    label: "Não tenho um controle definido",
    icon: HelpCircle,
  },
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

export default function OnboardingStepFinance({
  selectedControl,
  onSelect,
}: OnboardingStepFinanceProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg md:text-xl font-bold font-heading text-white">
          Como você controla suas finanças hoje?
        </h2>

        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Queremos entender seu hábito atual para facilitar sua adaptação ao
          MetricsFlow.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
      >
        {CONTROLS.map((controlItem) => {
          const Icon = controlItem.icon;
          const isSelected = selectedControl === controlItem.id;

          return (
            <motion.button
              key={controlItem.id}
              variants={item}
              type="button"
              onClick={() => onSelect(controlItem.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className={`w-full flex items-center justify-between min-h-[62px] px-3.5 py-3 rounded-xl border text-left transition-all duration-200 ${
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
                  {controlItem.label}
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
          O MetricsFlow centraliza essas informações em um só lugar,
          economizando seu tempo e evitando controles espalhados.
        </p>
      </motion.div>
    </div>
  );
}
