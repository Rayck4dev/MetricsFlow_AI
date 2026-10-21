"use client";

import type { ReactNode } from "react";
import { Bot, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export function EmptyPanel() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-7 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-xl" />

        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300">
          <Sparkles size={23} />
        </div>
      </div>

      <h2 className="mt-5 font-heading text-lg font-semibold text-white">
        Aguardando movimentação
      </h2>

      <p className="mt-2 max-w-xs text-[11px] leading-5 text-slate-600">
        A interpretação financeira aparecerá aqui depois que a MetricsFlow AI
        processar sua mensagem.
      </p>

      <div className="mt-6 grid w-full max-w-sm grid-cols-3 gap-2">
        <MiniFeature icon={<Bot size={13} />} label="Interpreta" />

        <MiniFeature icon={<ShieldCheck size={13} />} label="Valida" />

        <MiniFeature icon={<CheckCircle2 size={13} />} label="Confirma" />
      </div>
    </div>
  );
}

export function MiniFeature({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.04] bg-white/[0.015] px-2 py-2.5">
      <span className="text-emerald-400">{icon}</span>

      <span className="text-[8px] font-semibold text-slate-600">{label}</span>
    </div>
  );
}
