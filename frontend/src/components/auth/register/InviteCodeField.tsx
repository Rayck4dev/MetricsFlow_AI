import { Users } from "lucide-react";

export interface InviteCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function InviteCodeField({
  value,
  onChange,
  disabled = false,
}: InviteCodeFieldProps) {
  return (
    <div>
      <label
        htmlFor="invite-code"
        className="mb-1 block text-xs font-semibold text-slate-300"
      >
        Código de convite
      </label>

      <div className="relative">
        <Users
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          id="invite-code"
          name="invite-code"
          type="text"
          required
          maxLength={10}
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          placeholder="Ex.: ABC123"
          disabled={disabled}
          className="h-10 w-full rounded-xl border border-surface-border bg-surface-sidebar pl-9 pr-3 text-xs font-semibold uppercase tracking-wider text-white outline-none placeholder:text-slate-600 transition-all focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <p className="mt-1 text-[9px] text-slate-600">
        O código é fornecido pelo proprietário da empresa.
      </p>
    </div>
  );
}
