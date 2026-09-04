"use client";

import {
  Calendar,
  CalendarDays,
  CalendarCheck,
  CalendarRange,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

interface OnboardingStepFrequencyProps {
  selectedFrequency: string;
  onSelect: (frequency: string) => void;
}

const FREQUENCIES = [
  {
    id: "daily",
    label: "Todos os dias",
    icon: CalendarCheck,
  },
  {
    id: "few_times_week",
    label: "Algumas vezes por semana",
    icon: CalendarDays,
  },
  {
    id: "weekly",
    label: "Uma vez por semana",
    icon: Calendar,
  },
  {
    id: "monthly",
    label: "Só no final do mês",
    icon: CalendarRange,
  },
  {
    id: "rarely",
    label: "Quase nunca",
    icon: AlertCircle,
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

export default function OnboardingStepFrequency({
  selectedFrequency,
  onSelect,
}: OnboardingStepFrequencyProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg md:text-xl font-bold font-heading text-white">
          Com que frequência você acompanha suas finanças?
        </h2>

        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Sem julgamento — queremos entender sua rotina atual para adaptar a
          experiência a você.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
      >
        {FREQUENCIES.map((freqItem) => {
          const Icon = freqItem.icon;
          const isSelected = selectedFrequency === freqItem.id;

          return (
            <motion.button
              key={freqItem.id}
              variants={item}
              type="button"
              onClick={() => onSelect(freqItem.id)}
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
                  {freqItem.label}
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
          Uma rotina simples de acompanhamento, mesmo que semanal, já faz uma
          grande diferença no controle do negócio.
        </p>
      </motion.div>
    </div>
  );
}
