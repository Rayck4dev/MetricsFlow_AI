"use client";

import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  label: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

export function PasswordField({
  label,
  value,
  visible,
  onChange,
  onToggle,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label
        className="
          block
          text-[9px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-slate-500
        "
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="new-password"
          placeholder="Digite sua senha"
          className="
            h-11 w-full
            rounded-xl
            border border-surface-border
            bg-surface-sidebar
            px-3.5 pr-11
            text-xs font-medium
            text-slate-200
            outline-none
            transition-all
            placeholder:text-slate-700
            hover:border-slate-600
            focus:border-brand-500/60
            focus:bg-surface-main
            focus:ring-2
            focus:ring-brand-500/10
          "
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute right-2 top-1/2
            flex h-8 w-8
            -translate-y-1/2
            items-center justify-center
            rounded-lg
            text-slate-600
            transition-colors
            hover:bg-white/[0.04]
            hover:text-slate-300
          "
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}
