import type { FormEvent } from "react";

import { RefreshCw, Send } from "lucide-react";

interface WhatsAppInputProps {
  text: string;
  loading: boolean;
  onTextChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export function WhatsAppInput({
  text,
  loading,
  onTextChange,
  onSubmit,
}: WhatsAppInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#071f31] px-2.5 py-1.5 transition focus-within:border-emerald-400/20"
    >
      <input
        type="text"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        disabled={loading}
        placeholder="Digite uma movimentação..."
        className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-[11px] text-slate-300 outline-none placeholder:text-slate-700 disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={loading || !text.trim()}
        aria-label="Enviar mensagem"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#031118] shadow-[0_0_18px_rgba(52,211,153,.18)] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {loading ? (
          <RefreshCw size={14} className="animate-spin" />
        ) : (
          <Send size={14} />
        )}
      </button>
    </form>
  );
}
