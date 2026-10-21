"use client";

import type { FormEvent } from "react";
import { EmptyChat, ResultChat } from "./whatsapp-chat/WhatsAppChatStates";

import { MessageSquareText, MoreVertical, RefreshCw, Send } from "lucide-react";

import type { DemoResponse } from "@/types/whatsapp";

interface WhatsAppChatProps {
  text: string;
  result: DemoResponse | null;
  loading: boolean;
  examples: readonly {
    label: string;
    text: string;
  }[];
  onTextChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onUseExample: (text: string) => void;
}

export function WhatsAppChat({
  text,
  result,
  loading,
  examples,
  onTextChange,
  onSubmit,
  onUseExample,
}: WhatsAppChatProps) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-surface-border bg-[#061b2b]/95 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.65)]">
      <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.05] bg-[#071f31] px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.08] text-emerald-300">
            <MessageSquareText size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-white">
                MetricsFlow
              </p>

              <span className="rounded-md border border-emerald-400/10 bg-emerald-400/[0.08] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-emerald-300">
                IA
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" />

              <span className="text-[9px] text-slate-500">
                Assistente financeiro
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Mais opções"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#061b2b]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.028]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,.28) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.025] blur-3xl" />

        <div className="relative z-10 h-full overflow-y-auto px-4 py-5 sm:px-5">
          {!result ? (
            <EmptyChat
              text={text}
              examples={examples}
              onUseExample={onUseExample}
            />
          ) : (
            <ResultChat result={result} />
          )}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="shrink-0 border-t border-white/[0.05] bg-[#071f31] px-3.5 py-3"
      >
        <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#051625] px-2.5 py-1.5 transition focus-within:border-emerald-400/20 focus-within:bg-[#061a2b]">
          <input
            type="text"
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            disabled={loading}
            placeholder="Digite uma movimentação..."
            className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-[11px] text-slate-200 outline-none placeholder:text-slate-600 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !text.trim()}
            aria-label="Enviar mensagem"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#031118] shadow-[0_0_20px_rgba(52,211,153,.18)] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {loading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between px-1 pt-1.5">
          <span className="text-[8px] text-slate-700">Simulador • NestJS</span>

          <span className="text-[8px] text-slate-700">
            Confirmação obrigatória
          </span>
        </div>
      </form>
    </section>
  );
}
