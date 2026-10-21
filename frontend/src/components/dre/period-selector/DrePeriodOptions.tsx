"use client";

import { Check } from "lucide-react";
import type { DrePeriod } from "../DrePeriodSelector";

interface PeriodOption {
  value: DrePeriod;
  label: string;
  description: string;
}

interface DrePeriodOptionsProps {
  periods: PeriodOption[];
  value: DrePeriod;
  onSelect: (period: DrePeriod) => void;
}

export function DrePeriodOptions({
  periods,
  value,
  onSelect,
}: DrePeriodOptionsProps) {
  return (
    <div className="space-y-1">
      {periods.map((period) => {
        const active = period.value === value;

        return (
          <button
            key={period.value}
            type="button"
            onClick={() => onSelect(period.value)}
            aria-pressed={active}
            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${active ? "bg-brand-500/10" : "hover:bg-white/[0.04]"}`}
          >
            <span className="min-w-0">
              <span
                className={`block text-[10px] font-semibold ${active ? "text-brand-300" : "text-slate-300"}`}
              >
                {period.label}
              </span>
              <span className="mt-0.5 block text-[8px] text-slate-500">
                {period.description}
              </span>
            </span>
            {active && <Check size={14} className="shrink-0 text-brand-400" />}
          </button>
        );
      })}
    </div>
  );
}
