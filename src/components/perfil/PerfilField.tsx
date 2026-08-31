"use client";

interface PerfilFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}

export function PerfilField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: PerfilFieldProps) {
  return (
    <div className="space-y-2">
      <label
        className="
          block text-[9px] font-bold uppercase
          tracking-[0.12em] text-slate-500
        "
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`
          h-11 w-full rounded-xl border
          bg-surface-sidebar px-3.5
          text-xs font-medium text-slate-200
          outline-none transition-all
          placeholder:text-slate-700
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
