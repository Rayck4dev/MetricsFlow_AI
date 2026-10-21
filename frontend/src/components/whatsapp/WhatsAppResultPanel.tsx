"use client";

import type { DemoResponse } from "@/types/whatsapp";
import { EmptyPanel } from "./result-panel/WhatsAppResultSections";
import { FilledPanel } from "./result-panel/WhatsAppFilledPanel";

interface WhatsAppResultPanelProps {
  result: DemoResponse | null;
  canConfirm: boolean;
  confidence: number;
  confirming: boolean;
  success: string | null;
  onConfirm: () => void;
  onReset: () => void;
}

export function WhatsAppResultPanel({
  result,
  canConfirm,
  confidence,
  confirming,
  success,
  onConfirm,
  onReset,
}: WhatsAppResultPanelProps) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-surface-border bg-[#061b2b]/95 shadow-[0_20px_70px_-30px_rgba(0,0,0,.65)]">
      <div className="shrink-0 border-b border-white/[0.05] px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Interpretação financeira
          </p>

          {result && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-medium text-slate-500">
                Confiança {confidence}%
              </span>

              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, confidence))}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">
            {result ? "Movimentação identificada" : "Aguardando movimentação"}
          </p>
        </div>
      </div>

      {!result ? (
        <EmptyPanel />
      ) : (
        <FilledPanel
          result={result}
          canConfirm={canConfirm}
          confirming={confirming}
          success={success}
          onConfirm={onConfirm}
          onReset={onReset}
        />
      )}
    </section>
  );
}
