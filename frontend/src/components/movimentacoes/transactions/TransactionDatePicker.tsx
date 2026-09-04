"use client";

import { CalendarDays } from "lucide-react";
import { useId } from "react";

interface TransactionDatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  min?: string;
  max?: string;
}

export function TransactionDatePicker({
  label = "Data da movimentação",
  value,
  onChange,
  error,
  min,
  max,
}: TransactionDatePickerProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
      >
        {label}
      </label>

      <div className="group relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2">
          <CalendarDays
            size={15}
            className="text-slate-600 transition-colors group-focus-within:text-brand-400"
          />
        </div>

        <input
          id={id}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full rounded-xl border bg-surface-sidebar pl-10 pr-3.5 text-xs font-medium text-slate-200 outline-none transition-all duration-200 [color-scheme:dark] ${
            error
              ? "border-rose-500/50 focus:border-rose-400"
              : "border-surface-border hover:border-slate-600 focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10"
          }`}
        />
      </div>

      {error && (
        <p className="text-[10px] font-medium text-rose-400">{error}</p>
      )}
    </div>
  );
}
