"use client";

import { motion } from "framer-motion";
import { Check, Moon, Palette } from "lucide-react";

import type { AppearanceMode } from "./Preferencias";

interface PreferenciasAppearanceProps {
  value: AppearanceMode;
  onChange: (value: AppearanceMode) => void;
}

export function PreferenciasAppearance({
  value,
  onChange,
}: PreferenciasAppearanceProps) {
  const active = value === "dark";

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
            <Palette
              size={16}
              className="text-brand-400"
            />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              Aparência
            </h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Interface atual do MetricsFlow.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onChange("dark")}
          className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
            active
              ? "border-brand-500/30 bg-brand-500/[0.07]"
              : "border-surface-border bg-surface-sidebar hover:border-slate-700"
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
              <Moon size={15} />
            </div>

            <div>
              <p
                className={`text-[10px] font-bold ${
                  active
                    ? "text-brand-300"
                    : "text-slate-300"
                }`}
              >
                Escuro
              </p>

              <p className="mt-0.5 text-[8px] leading-4 text-slate-600">
                Interface escura e confortável.
              </p>
            </div>
          </div>

          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-brand-500 bg-brand-500 text-white">
            <Check size={11} />
          </div>
        </motion.button>

        <p className="mt-3 text-[9px] leading-relaxed text-slate-600">
          O MetricsFlow utiliza atualmente o modo escuro como tema padrão.
        </p>
      </div>
    </motion.section>
  );
}