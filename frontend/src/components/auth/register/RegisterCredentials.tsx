"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

interface RegisterCredentialsProps {
  email: string;
  password: string;
  disabled: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const inputClassName =
  "h-10 w-full rounded-xl border border-surface-border bg-surface-sidebar pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 transition-all focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60";

export function RegisterCredentials({
  email,
  password,
  disabled,
  onEmailChange,
  onPasswordChange,
}: RegisterCredentialsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div>
        <label
          htmlFor="register-email"
          className="mb-1 block text-xs font-semibold text-slate-300"
        >
          E-mail
        </label>
        <div className="relative">
          <Mail
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            id="register-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="exemplo@gmail.com"
            disabled={disabled}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="mb-1 block text-xs font-semibold text-slate-300"
        >
          Senha
        </label>
        <div className="relative">
          <Lock
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Mínimo de 6 caracteres"
            disabled={disabled}
            className={`${inputClassName} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={disabled}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}
