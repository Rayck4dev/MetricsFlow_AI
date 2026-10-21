"use client";

import type { ReactNode } from "react";
import { Bot, Check, CheckCheck } from "lucide-react";
import type { DemoResponse } from "@/types/whatsapp";

export function EmptyChat({
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

export function ResultChat({ result }: { result: DemoResponse }) {
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

export function Avatar() {
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/10 bg-emerald-400/[0.08] text-emerald-300">
      <Bot size={14} />

      <span className="absolute inset-0 rounded-full bg-emerald-400/[0.06] blur-md" />
    </div>
  );
}

export function ChatBubble({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[88%] rounded-[17px] rounded-bl-md border border-white/[0.05] bg-[#0b2539] px-3.5 py-2.5 shadow-[0_8px_30px_-20px_rgba(0,0,0,.8)]">
      {children}
    </div>
  );
}

export function ChatTime({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[8px] text-slate-600">{children}</p>;
}
