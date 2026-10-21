import { Loader2 } from "lucide-react";

interface TransactionFormActionsProps {
  isIncome: boolean;
  isSubmitting: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TransactionFormActions({ isIncome, isSubmitting, onCancel, submitLabel }: TransactionFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-surface-border pt-4">
      {onCancel && (
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="h-10 rounded-xl px-4 text-[10px] font-bold text-slate-500 transition-colors hover:bg-surface-sidebar hover:text-slate-300 disabled:pointer-events-none disabled:opacity-50">
          Cancelar
        </button>
      )}
      <button type="submit" disabled={isSubmitting} className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-[10px] font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 ${isIncome ? "bg-emerald-500 shadow-emerald-500/10 hover:bg-emerald-400" : "bg-rose-500 shadow-rose-500/10 hover:bg-rose-400"}`}>
        {isSubmitting && <Loader2 size={13} className="animate-spin" />}
        {submitLabel ?? (isIncome ? "Adicionar receita" : "Adicionar despesa")}
      </button>
    </div>
  );
}
