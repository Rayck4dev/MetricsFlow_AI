"use client";

interface EmpresaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  type?: "text" | "email" | "tel";
}

export function EmpresaField({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  type = "text",
}: EmpresaFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`
          h-11 w-full rounded-xl border
          bg-surface-sidebar px-3.5
          text-xs font-medium text-slate-200
          outline-none transition-all
          placeholder:text-slate-700
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${
            error
              ? "border-red-500/50 focus:border-red-400"
              : "border-surface-border hover:border-slate-600 focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10"
          }
        `}
      />

      {error && <p className="text-[9px] font-medium text-red-400">{error}</p>}
    </div>
  );
}
