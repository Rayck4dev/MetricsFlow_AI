"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";

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
  placeholder = "Selecione uma opção",
  error,
  disabled = false,
}: TransactionSelectProps) {
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
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full appearance-none rounded-xl border bg-surface-sidebar px-3.5 pr-10 text-xs font-medium text-slate-200 outline-none transition-all duration-200 ${
            error
              ? "border-rose-500/50 focus:border-rose-400"
              : "border-surface-border hover:border-slate-600 focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10"
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
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition-transform duration-200 group-focus-within:rotate-180 group-focus-within:text-brand-400"
        />
      </div>

      {error && (
        <p className="text-[10px] font-medium text-rose-400">{error}</p>
      )}
    </div>
  );
}
