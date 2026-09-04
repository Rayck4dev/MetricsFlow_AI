"use client";

import { ChevronDown } from "lucide-react";

interface TransactionSelectOption {
  value: string;
  label: string;
}

interface TransactionSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: TransactionSelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function TransactionSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione",
  error,
  disabled = false,
}: TransactionSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full appearance-none rounded-xl border bg-surface-sidebar px-3.5 pr-10 text-xs font-medium text-slate-200 outline-none transition-all ${
            error
              ? "border-rose-500/50"
              : "border-surface-border focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10"
          } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
            disabled ? "text-slate-700" : "text-slate-500"
          }`}
        />
      </div>

      {error && (
        <p className="text-[10px] font-medium text-rose-400">{error}</p>
      )}
    </div>
  );
}
