"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, ChevronDown, Clock3 } from "lucide-react";

export type DrePeriod =
  | "today"
  | "week"
  | "month"
  | "last-month"
  | "quarter"
  | "year"
  | "custom";

export interface DreCustomRange {
  start: string;
  end: string;
}

interface DrePeriodSelectorProps {
  value: DrePeriod;
  onChange: (value: DrePeriod) => void;
  customRange: DreCustomRange;
  onCustomRangeChange: (range: DreCustomRange) => void;
}

const PERIODS: {
  value: DrePeriod;
  label: string;
  description: string;
}[] = [
  { value: "today", label: "Hoje", description: "Movimentações do dia" },
  {
    value: "week",
    label: "Esta semana",
    description: "Da segunda-feira até hoje",
  },
  { value: "month", label: "Este mês", description: "Período atual" },
  {
    value: "last-month",
    label: "Mês anterior",
    description: "Último mês fechado",
  },
  {
    value: "quarter",
    label: "Últimos 3 meses",
    description: "Inclui o mês atual",
  },
  { value: "year", label: "Este ano", description: "Resultado anual" },
  { value: "custom", label: "Personalizado", description: "Escolha as datas" },
];

export function DrePeriodSelector({
  value,
  onChange,
  customRange,
  onCustomRangeChange,
}: DrePeriodSelectorProps) {
  const [open, setOpen] = useState(false);
  const [showCustomDates, setShowCustomDates] = useState(value === "custom");

  const containerRef = useRef<HTMLDivElement>(null);

  const currentPeriod =
    PERIODS.find((period) => period.value === value) ?? PERIODS[2];

  const invalidRange =
    Boolean(customRange.start && customRange.end) &&
    customRange.start > customRange.end;

  const canApplyCustomRange =
    Boolean(customRange.start) && Boolean(customRange.end) && !invalidRange;

  useEffect(() => {
    setShowCustomDates(value === "custom");
  }, [value]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSelect(selectedPeriod: DrePeriod) {
    if (selectedPeriod === "custom") {
      setShowCustomDates(true);
      onChange("custom");
      return;
    }

    setShowCustomDates(false);
    onChange(selectedPeriod);
    setOpen(false);
  }

  function applyCustomRange() {
    if (!canApplyCustomRange) {
      return;
    }

    onChange("custom");
    setShowCustomDates(true);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative z-20 min-w-0">
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Período selecionado: ${currentPeriod.label}`}
        className={`flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-all sm:w-[210px] ${
          open
            ? "border-brand-500/40 bg-brand-500/[0.06]"
            : "border-surface-border bg-surface-sidebar hover:border-brand-500/20"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
            <Calendar size={14} className="text-brand-400" />
          </span>

          <span className="min-w-0 text-left">
            <span className="block text-[8px] font-semibold uppercase tracking-wider text-slate-600">
              Período
            </span>

            <span className="block truncate text-[10px] font-bold text-slate-300">
              {currentPeriod.label}
            </span>
          </span>
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={14} className="text-slate-500" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            role="dialog"
            aria-label="Selecionar período do DRE"
            className="dre-period-scrollbar absolute right-0 top-full z-[200] mt-2 max-h-[min(75dvh,520px)] w-[min(300px,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-surface-border bg-[#122033] p-2 shadow-2xl shadow-black/50"
          >
            <div className="mb-1 flex items-center gap-2 px-2 py-2">
              <Clock3 size={12} className="text-brand-400" />

              <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Selecione o período
              </span>
            </div>

            <div className="space-y-1">
              {PERIODS.map((period) => {
                const active = period.value === value;

                return (
                  <button
                    key={period.value}
                    type="button"
                    onClick={() => handleSelect(period.value)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      active ? "bg-brand-500/10" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="min-w-0">
                      <span
                        className={`block text-[10px] font-semibold ${
                          active ? "text-brand-300" : "text-slate-300"
                        }`}
                      >
                        {period.label}
                      </span>

                      <span className="mt-0.5 block text-[8px] text-slate-500">
                        {period.description}
                      </span>
                    </span>

                    {active && (
                      <Check size={14} className="shrink-0 text-brand-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {showCustomDates && (
              <div className="mt-2 space-y-3 rounded-xl border border-surface-border bg-black/10 p-3">
                <p className="text-xs font-semibold text-slate-200">
                  Intervalo personalizado
                </p>

                <label className="block space-y-1.5">
                  <span className="text-[10px] text-slate-400">
                    Data inicial
                  </span>

                  <input
                    type="date"
                    value={customRange.start}
                    max={customRange.end || undefined}
                    onChange={(event) =>
                      onCustomRangeChange({
                        ...customRange,
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
                    value={customRange.end}
                    min={customRange.start || undefined}
                    onChange={(event) =>
                      onCustomRangeChange({
                        ...customRange,
                        end: event.target.value,
                      })
                    }
                    className="h-10 w-full min-w-0 rounded-lg border border-surface-border bg-[#0b1728] px-3 text-xs text-white outline-none focus:border-brand-500/50"
                  />
                </label>

                {invalidRange && (
                  <p role="alert" className="text-[10px] text-red-400">
                    A data inicial deve ser anterior à data final.
                  </p>
                )}

                <button
                  type="button"
                  onClick={applyCustomRange}
                  disabled={!canApplyCustomRange}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-3 text-xs font-bold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check size={14} />
                  Aplicar período
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
