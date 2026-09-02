"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { Calendar, Check, ChevronDown, Clock3 } from "lucide-react";

export type DrePeriod =
  | "today"
  | "week"
  | "month"
  | "last-month"
  | "quarter"
  | "year"
  | `year-${number}`
  | "custom";

interface DrePeriodSelectorProps {
  value: DrePeriod;

  onChange: (value: DrePeriod) => void;

  customStartDate?: string;

  customEndDate?: string;

  onCustomChange?: (startDate: string, endDate: string) => void;
}

interface PeriodOption {
  value: DrePeriod;
  label: string;
  description: string;
}

function getAvailableYears(): number[] {
  const currentYear = new Date().getFullYear();

  return [
    currentYear,
    currentYear - 1,
    currentYear - 2,
  ];
}

function formatDateLabel(date: string) {
  if (!date) {
    return "";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

const FIXED_PERIODS: PeriodOption[] = [
  {
    value: "today",
    label: "Hoje",
    description: "Movimentações do dia",
  },
  {
    value: "week",
    label: "Esta semana",
    description: "Da segunda-feira até hoje",
  },
  {
    value: "month",
    label: "Este mês",
    description: "Período atual",
  },
  {
    value: "last-month",
    label: "Mês anterior",
    description: "Último mês fechado",
  },
  {
    value: "quarter",
    label: "Últimos 3 meses",
    description: "Visão trimestral",
  },
  {
    value: "year",
    label: "Este ano",
    description: "Ano atual",
  },
];

export function DrePeriodSelector({
  value,
  onChange,
  customStartDate = "",
  customEndDate = "",
  onCustomChange,
}: DrePeriodSelectorProps) {
  const [open, setOpen] = useState(false);

  const [customOpen, setCustomOpen] = useState(false);

  const [draftStartDate, setDraftStartDate] = useState(customStartDate);

  const [draftEndDate, setDraftEndDate] = useState(customEndDate);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraftStartDate(customStartDate);
    setDraftEndDate(customEndDate);
  }, [customStartDate, customEndDate]);

  const periodOptions = useMemo<PeriodOption[]>(() => {
    const years = getAvailableYears();

    const yearOptions: PeriodOption[] = years.map((year) => ({
      value: `year-${year}` as `year-${number}`,
      label: `Ano ${year}`,
      description: `Movimentações de ${year}`,
    }));

    const customDescription =
      customStartDate && customEndDate
        ? `${formatDateLabel(
            customStartDate,
          )} até ${formatDateLabel(customEndDate)}`
        : "Selecionar intervalo";

    return [
      ...FIXED_PERIODS,
      ...yearOptions,
      {
        value: "custom",
        label: "Personalizado",
        description: customDescription,
      },
    ];
  }, [customStartDate, customEndDate]);

  const currentPeriod =
    periodOptions.find((period) => period.value === value) ?? FIXED_PERIODS[2];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setCustomOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setCustomOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleToggle() {
    setOpen((previous) => !previous);
    setCustomOpen(false);
  }

  function handleSelect(period: DrePeriod) {
    if (period === "custom") {
      setOpen(false);
      setCustomOpen(true);
      return;
    }

    onChange(period);

    setOpen(false);
    setCustomOpen(false);
  }

  function handleApplyCustomPeriod() {
    if (!draftStartDate || !draftEndDate) {
      return;
    }

    if (draftStartDate > draftEndDate) {
      return;
    }

    onCustomChange?.(draftStartDate, draftEndDate);

    onChange("custom");

    setCustomOpen(false);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative z-[100] min-w-0">
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Selecionar período. Atual: ${currentPeriod.label}`}
        className={`flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-all sm:w-[210px] ${
          open
            ? "border-brand-500/40 bg-brand-500/[0.06] shadow-lg shadow-brand-500/5"
            : "border-surface-border bg-surface-sidebar hover:border-brand-500/20"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
              open ? "bg-brand-500/15" : "bg-brand-500/10"
            }`}
          >
            <Calendar size={14} className="text-brand-400" />
          </div>

          <div className="min-w-0 text-left">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
              Período
            </p>

            <p className="truncate text-[10px] font-bold text-slate-300">
              {currentPeriod.label}
            </p>
          </div>
        </div>

        <motion.div
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={14} className="text-slate-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 8,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.97,
            }}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
            role="listbox"
            aria-label="Períodos disponíveis"
            className="absolute right-0 top-full z-[200] max-h-[420px] w-[min(300px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-surface-border bg-[#122033] p-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="mb-1 flex items-center gap-2 px-2 py-2">
              <Clock3 size={12} className="text-brand-400" />

              <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Selecione o período
              </span>
            </div>

            <div className="space-y-1">
              {periodOptions.map((period) => {
                const isActive = period.value === value;

                return (
                  <motion.button
                    key={period.value}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(period.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isActive ? "bg-brand-500/10" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`text-[10px] font-semibold ${
                          isActive ? "text-brand-300" : "text-slate-300"
                        }`}
                      >
                        {period.label}
                      </p>

                      <p className="mt-0.5 truncate text-[8px] text-slate-600">
                        {period.description}
                      </p>
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{
                          scale: 0,
                          rotate: -90,
                        }}
                        animate={{
                          scale: 1,
                          rotate: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white"
                      >
                        <Check size={11} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {customOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 8,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.97,
            }}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
            className="absolute right-0 top-full z-[300] mt-1 w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-surface-border bg-[#122033] p-4 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="mb-4">
              <p className="text-[10px] font-bold text-slate-200">
                Período personalizado
              </p>

              <p className="mt-1 text-[8px] leading-4 text-slate-600">
                Escolha a data inicial e a data final da análise.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-wider text-slate-500">
                  Data inicial
                </label>

                <input
                  type="date"
                  value={draftStartDate}
                  onChange={(event) => setDraftStartDate(event.target.value)}
                  className="h-10 w-full rounded-xl border border-surface-border bg-surface-sidebar px-3 text-xs text-slate-300 outline-none transition-all focus:border-brand-500/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-wider text-slate-500">
                  Data final
                </label>

                <input
                  type="date"
                  value={draftEndDate}
                  min={draftStartDate || undefined}
                  onChange={(event) => setDraftEndDate(event.target.value)}
                  className="h-10 w-full rounded-xl border border-surface-border bg-surface-sidebar px-3 text-xs text-slate-300 outline-none transition-all focus:border-brand-500/50"
                />
              </div>

              {draftStartDate && draftEndDate && (
                <div className="rounded-xl border border-brand-500/10 bg-brand-500/[0.04] px-3 py-2.5">
                  <p className="text-[8px] font-medium leading-4 text-slate-500">
                    {formatDateLabel(draftStartDate)} até{" "}
                    {formatDateLabel(draftEndDate)}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCustomOpen(false)}
                  className="h-9 rounded-xl px-3 text-[9px] font-bold text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-300"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={
                    !draftStartDate ||
                    !draftEndDate ||
                    draftStartDate > draftEndDate
                  }
                  onClick={handleApplyCustomPeriod}
                  className="h-9 rounded-xl bg-brand-500 px-4 text-[9px] font-bold text-white transition-all hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Aplicar período
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
