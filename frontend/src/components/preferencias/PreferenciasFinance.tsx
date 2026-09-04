"use client";

import { motion } from "framer-motion";
import { CalendarRange, WalletCards } from "lucide-react";

import type { FinancePreferences } from "./Preferencias";

interface PreferenciasFinanceProps {
  values: FinancePreferences;
  onChange: (key: keyof FinancePreferences, value: string) => void;
}

const periodOptions = [
  {
    value: "day",
    label: "Hoje",
  },
  {
    value: "week",
    label: "Esta semana",
  },
  {
    value: "month",
    label: "Este mês",
  },
  {
    value: "quarter",
    label: "Este trimestre",
  },
  {
    value: "year",
    label: "Este ano",
  },
];

export function PreferenciasFinance({
  values,
  onChange,
}: PreferenciasFinanceProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: 0.1,
      }}
      className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="border-b border-surface-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
            <WalletCards size={16} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              Preferências financeiras
            </h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Defina como os dados financeiros devem ser apresentados.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <SelectField
          label="Período financeiro padrão"
          value={values.defaultPeriod}
          options={periodOptions}
          icon={<CalendarRange size={13} />}
          onChange={(value) => onChange("defaultPeriod", value)}
        />

        <div className="flex items-center justify-between rounded-xl border border-surface-border bg-surface-sidebar px-3.5 py-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Moeda
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-slate-300">
              Real brasileiro
            </p>
          </div>

          <span className="rounded-lg border border-brand-500/20 bg-brand-500/10 px-2.5 py-1.5 text-[9px] font-bold text-brand-300">
            BRL · R$
          </span>
        </div>
      </div>
    </motion.section>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  icon: React.ReactNode;
  onChange: (value: string) => void;
}

function SelectField({
  label,
  value,
  options,
  icon,
  onChange,
}: SelectFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {icon}
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-surface-border bg-surface-sidebar px-3.5 text-xs font-medium text-slate-300 outline-none transition-all hover:border-slate-700 focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#122033] text-slate-200"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
