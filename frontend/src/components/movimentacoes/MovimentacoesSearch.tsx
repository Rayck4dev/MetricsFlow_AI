"use client";

import { Search, X } from "lucide-react";

interface MovimentacoesSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MovimentacoesSearch({
  value,
  onChange,
}: MovimentacoesSearchProps) {
  return (
    <div className="relative w-full max-w-xl">
      <Search
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
      />

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar descrição, categoria ou forma de pagamento..."
        className="h-10 w-full rounded-xl border border-surface-border bg-surface-sidebar/80 pl-10 pr-10 text-[10px] text-white outline-none transition-all placeholder:text-slate-700 focus:border-brand-500/40 focus:bg-surface-sidebar focus:ring-2 focus:ring-brand-500/10"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-600 transition-colors hover:text-slate-300"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
