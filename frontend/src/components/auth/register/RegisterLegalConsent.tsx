import Link from "next/link";

interface RegisterLegalConsentProps {
  accepted: boolean;
  disabled: boolean;
  onChange: (accepted: boolean) => void;
}

export function RegisterLegalConsent({
  accepted,
  disabled,
  onChange,
}: RegisterLegalConsentProps) {
  return (
    <label className="flex items-start gap-2 pt-0.5">
      <input
        type="checkbox"
        required
        checked={accepted}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        className="mt-0.2 h-3.5 w-3.5 shrink-0 rounded border-surface-border bg-surface-sidebar accent-brand-500 disabled:cursor-not-allowed"
      />

      <span className="text-[9px] leading-[1.45] text-slate-500">
        Li e concordo com os{" "}
        <Link
          href="/termos-de-uso"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-400 transition-colors hover:text-brand-300 hover:underline"
        >
          Termos de Uso
        </Link>{" "}
        e estou ciente da{" "}
        <Link
          href="/politica-de-privacidade"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-400 transition-colors hover:text-brand-300 hover:underline"
        >
          Política de Privacidade
        </Link>
        .
      </span>
    </label>
  );
}
