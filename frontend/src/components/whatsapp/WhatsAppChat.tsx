"use client";

import type { FormEvent, ReactNode } from "react";

import {
  Bot,
  Check,
  CheckCheck,
  MessageSquareText,
  MoreVertical,
  RefreshCw,
  Send,
} from "lucide-react";

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

function EmptyChat({
  text,
  examples,
  onUseExample,
}: {
  text: string;
  examples: readonly {
    label: string;
    text: string;
  }[];
  onUseExample: (text: string) => void;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-end gap-2">
        <Avatar />

        <ChatBubble>
          <p className="text-[12px] leading-5 text-slate-300 sm:text-[13px]">
            Olá! 👋
            <br />
            Me envie uma venda ou despesa e eu organizo os dados para você.
          </p>

          <ChatTime>10:24</ChatTime>
        </ChatBubble>
      </div>

      {text.trim() && (
        <div className="mt-4 flex justify-end">
          <div className="max-w-[78%] rounded-[18px] rounded-br-md border border-emerald-400/10 bg-gradient-to-br from-emerald-400 to-emerald-500 px-3.5 py-2.5 text-[#031118] shadow-[0_10px_30px_-14px_rgba(16,185,129,.65)]">
            <p className="text-[11px] font-medium leading-5">{text}</p>

            <div className="mt-1 flex items-center justify-end gap-1">
              <span className="text-[8px] text-emerald-950/60">10:25</span>

              <Check size={9} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto pt-8">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">
            Experimente
          </span>

          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {examples.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => onUseExample(example.text)}
              className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5 text-[9px] font-semibold text-slate-500 transition hover:border-emerald-400/15 hover:bg-emerald-400/[0.04] hover:text-emerald-300"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultChat({ result }: { result: DemoResponse }) {
  return (
    <div>
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-[18px] rounded-br-md border border-emerald-400/10 bg-gradient-to-br from-emerald-400 to-emerald-500 px-3.5 py-2.5 text-[#031118] shadow-[0_10px_30px_-14px_rgba(16,185,129,.65)]">
          <p className="text-[11px] font-medium leading-5">
            {result.originalText}
          </p>

          <div className="mt-1 flex items-center justify-end gap-1">
            <span className="text-[8px] text-emerald-950/60">10:25</span>

            <CheckCheck size={10} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <Avatar />

        <ChatBubble>
          <div className="mb-1.5 flex items-center gap-1.5">
            <p className="text-[10px] font-semibold text-emerald-300">
              MetricsFlow
            </p>

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>

          <p className="text-[11px] leading-5 text-slate-300">
            {result.confirmation ||
              "Identifiquei uma movimentação financeira. Confira os dados ao lado antes de registrar."}
          </p>

          <ChatTime>10:25</ChatTime>
        </ChatBubble>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/10 bg-emerald-400/[0.08] text-emerald-300">
      <Bot size={14} />

      <span className="absolute inset-0 rounded-full bg-emerald-400/[0.06] blur-md" />
    </div>
  );
}

function ChatBubble({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[88%] rounded-[17px] rounded-bl-md border border-white/[0.05] bg-[#0b2539] px-3.5 py-2.5 shadow-[0_8px_30px_-20px_rgba(0,0,0,.8)]">
      {children}
    </div>
  );
}

function ChatTime({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[8px] text-slate-600">{children}</p>;
}
