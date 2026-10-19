import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

interface LoginCredentialsProps {
  email: string;
  password: string;
  showPassword: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
}

export function LoginCredentials({
  email,
  password,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
}: LoginCredentialsProps) {
  return (
    <>
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-xs font-semibold text-slate-300"
        >
          E-mail
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="exemplo@gmail.com"
            className="h-10 w-full rounded-xl border border-surface-border bg-surface-sidebar pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 transition-all focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10"
          />
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-300"
          >
            Senha
          </label>
          <Link
            href="/recuperar-senha"
            className="text-[11px] font-medium text-brand-400 transition-colors hover:text-brand-300"
          >
            Esqueci minha senha
          </Link>
        </div>

        <div className="relative">
          <Lock
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="••••••••"
            className="h-10 w-full rounded-xl border border-surface-border bg-surface-sidebar pl-9 pr-10 text-xs text-white outline-none placeholder:text-slate-600 transition-all focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 pt-1">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-surface-border bg-surface-sidebar accent-brand-500"
        />
        <span className="text-xs text-slate-400">Manter conectado</span>
      </label>
    </>
  );
}
