"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, Clock3 } from "lucide-react";
import { DreCustomDates } from "./period-selector/DreCustomDates";
import { DrePeriodOptions } from "./period-selector/DrePeriodOptions";
import { PERIODS } from "./period-selector/periods";

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

            <DrePeriodOptions
              periods={PERIODS}
              value={value}
              onSelect={handleSelect}
            />

            <DreCustomDates
              visible={showCustomDates}
              range={customRange}
              onRangeChange={onCustomRangeChange}
              invalid={invalidRange}
              canApply={canApplyCustomRange}
              onApply={applyCustomRange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
