"use client";

import { motion } from "framer-motion";
import { Check, Monitor, Moon, Sun, Palette } from "lucide-react";

import type { AppearanceMode } from "./Preferencias";

interface PreferenciasAppearanceProps {
  value: AppearanceMode;
  onChange: (value: AppearanceMode) => void;
}

const options: {
  value: AppearanceMode;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    value: "dark",
    label: "Escuro",
    description: "Interface escura e confortável.",
    icon: Moon,
  },
  {
    value: "light",
    label: "Claro",
    description: "Interface clara e iluminada.",
    icon: Sun,
  },
  {
    value: "system",
    label: "Sistema",
    description: "Segue o tema do dispositivo.",
    icon: Monitor,
  },
];

export function PreferenciasAppearance({
  value,
  onChange,
}: PreferenciasAppearanceProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="border-b border-surface-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
            <Palette size={16} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Aparência</h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Escolha como o sistema deve ser exibido.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-5 sm:p-6">
        {options.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;

          return (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(option.value)}
              className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                active
                  ? "border-brand-500/30 bg-brand-500/[0.07]"
                  : "border-surface-border bg-surface-sidebar hover:border-slate-700 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active
                      ? "bg-brand-500/15 text-brand-400"
                      : "bg-surface-panel text-slate-500"
                  }`}
                >
                  <Icon size={15} />
                </div>

                <div>
                  <p
                    className={`text-[10px] font-bold ${
                      active ? "text-brand-300" : "text-slate-300"
                    }`}
                  >
                    {option.label}
                  </p>

                  <p className="mt-0.5 text-[8px] leading-4 text-slate-600">
                    {option.description}
                  </p>
                </div>
              </div>

              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  active
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-surface-border"
                }`}
              >
                {active && <Check size={11} />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
