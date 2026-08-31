"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PasswordInput({
  id,
  name,
  label,
  value,
  placeholder = "••••••••",
  autoComplete = "new-password",
  minLength = 8,
  onChange,
  disabled = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="
          mb-1.5 block
          text-xs font-semibold
          text-slate-300
        "
      >
        {label}
      </label>

      <div className="relative">
        <Lock
          size={16}
          className="
            pointer-events-none
            absolute left-3 top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />

        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="
            h-11 w-full rounded-xl
            border border-surface-border
            bg-surface-main
            pl-9 pr-10
            text-xs text-white
            outline-none
            placeholder:text-slate-600
            transition-all
            focus:border-brand-500/60
            focus:ring-2
            focus:ring-brand-500/10
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          disabled={disabled}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          className="
            absolute right-3 top-1/2
            -translate-y-1/2
            text-slate-500
            transition-colors
            hover:text-slate-300
            disabled:cursor-not-allowed
          "
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
