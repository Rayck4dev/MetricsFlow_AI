"use client";

import { Check } from "lucide-react";
import type { DreCustomRange } from "../DrePeriodSelector";

interface DreCustomDatesProps {
  visible: boolean;
  range: DreCustomRange;
  onRangeChange: (range: DreCustomRange) => void;
  invalid: boolean;
  canApply: boolean;
  onApply: () => void;
}

export function DreCustomDates({
  visible,
  range,
  onRangeChange,
  invalid,
  canApply,
  onApply,
}: DreCustomDatesProps) {
  return (
    <>
      {visible && (
        <div className="mt-2 space-y-3 rounded-xl border border-surface-border bg-black/10 p-3">
          <p className="text-xs font-semibold text-slate-200">
            Intervalo personalizado
          </p>

          <label className="block space-y-1.5">
            <span className="text-[10px] text-slate-400">Data inicial</span>

            <input
              type="date"
              value={range.start}
              max={range.end || undefined}
              onChange={(event) =>
                onRangeChange({
                  ...range,
                  start: event.target.value,
                })
              }
              className="h-10 w-full min-w-0 rounded-lg border border-surface-border bg-[#0b1728] px-3 text-xs text-white outline-none focus:border-brand-500/50"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] text-slate-400">Data final</span>

            <input
              type="date"
              value={range.end}
              min={range.start || undefined}
              onChange={(event) =>
                onRangeChange({
                  ...range,
                  end: event.target.value,
                })
              }
              className="h-10 w-full min-w-0 rounded-lg border border-surface-border bg-[#0b1728] px-3 text-xs text-white outline-none focus:border-brand-500/50"
            />
          </label>

          {invalid && (
            <p role="alert" className="text-[10px] text-red-400">
              A data inicial deve ser anterior à data final.
            </p>
          )}

          <button
            type="button"
            onClick={onApply}
            disabled={!canApply}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-3 text-xs font-bold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={14} />
            Aplicar período
          </button>
        </div>
      )}
    </>
  );
}
