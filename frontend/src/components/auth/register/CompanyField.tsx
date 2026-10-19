import { Building2 } from "lucide-react";

export interface CompanyFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CompanyField({
  value,
  onChange,
  disabled = false,
}: CompanyFieldProps) {
  return (
    <div>
      <label
        htmlFor="company"
        className="mb-1 block text-xs font-semibold text-slate-300"
      >
        Nome da empresa
      </label>

      <div className="relative">
        <Building2
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          id="company"
          name="company"
          type="text"
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ex.: Studio Smart"
          disabled={disabled}
          className="h-10 w-full rounded-xl border border-surface-border bg-surface-sidebar pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 transition-all focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <p className="mt-1 text-[9px] text-slate-600">
        Você será o proprietário e poderá convidar colaboradores.
      </p>
    </div>
  );
}
