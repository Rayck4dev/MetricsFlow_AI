"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Filter,
  RotateCcw,
  Tag,
  WalletCards,
} from "lucide-react";

import type { PeriodFilter, TransactionType } from "@/types/index";

interface MovimentacoesFiltersProps {
  type: TransactionType;
  category: string;
  period: PeriodFilter;
  categories: string[];

  onTypeChange: (value: TransactionType) => void;
  onCategoryChange: (value: string) => void;
  onPeriodChange: (value: PeriodFilter) => void;
  onClear: () => void;
}

type DropdownOption = {
  value: string;
  label: string;
};

interface FilterDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  icon: React.ElementType;
  onChange: (value: string) => void;
}

function FilterDropdown({
  label,
  value,
  options,
  icon: Icon,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((item) => item.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelect(option: DropdownOption) {
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative z-[80] min-w-[185px]">
      <motion.button
        type="button"
        onClick={() => setOpen((current) => !current)}
        whileTap={{ scale: 0.98 }}
        className={`group flex h-11 w-full items-center gap-3 rounded-xl border px-3.5 text-left outline-none transition-all duration-200 ${
          open
            ? "border-brand-500/50 bg-brand-500/[0.08] shadow-[0_0_24px_rgba(14,165,233,0.08)]"
            : "border-surface-border bg-surface-sidebar hover:border-slate-600 hover:bg-surface-panel"
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all ${
            open
              ? "border-brand-500/20 bg-brand-500/10 text-brand-400"
              : "border-surface-border bg-surface-panel text-slate-500 group-hover:text-slate-300"
          }`}
        >
          <Icon size={14} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[7px] font-bold uppercase tracking-[0.14em] text-slate-600">
            {label}
          </span>

          <span
            className={`mt-0.5 block truncate text-[10px] font-semibold transition-colors ${
              open ? "text-slate-200" : "text-slate-400"
            }`}
          >
            {selected?.label ?? "Selecionar"}
          </span>
        </span>

        <motion.span
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className="shrink-0 text-slate-600"
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -5,
              scale: 0.98,
            }}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
            className="absolute left-0 top-[calc(100%+8px)] z-[9999] w-full min-w-[210px] origin-top overflow-hidden rounded-xl border border-surface-border bg-[#0b1329]/[98%] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-brand-500/10 blur-2xl" />

            <div className="relative max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
              {options.map((option, index) => {
                const active = option.value === value;

                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{
                      opacity: 0,
                      x: -5,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.14,
                      delay: index * 0.025,
                    }}
                    onClick={() => handleSelect(option)}
                    className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-all ${
                      active
                        ? "bg-brand-500/10 text-brand-300"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                        active
                          ? "bg-brand-400 shadow-[0_0_8px_rgba(14,165,233,0.7)]"
                          : "bg-slate-700 group-hover:bg-slate-500"
                      }`}
                    />

                    <span className="flex-1 text-[10px] font-semibold">
                      {option.label}
                    </span>

                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{
                            opacity: 0,
                            scale: 0.5,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.5,
                          }}
                        >
                          <Check size={13} className="text-brand-400" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MovimentacoesFilters({
  type,
  category,
  period,
  categories,
  onTypeChange,
  onCategoryChange,
  onPeriodChange,
  onClear,
}: MovimentacoesFiltersProps) {
  const [expanded, setExpanded] = useState(true);

  const typeOptions: DropdownOption[] = [
    {
      value: "all",
      label: "Todos os tipos",
    },
    {
      value: "income",
      label: "Receitas",
    },
    {
      value: "expense",
      label: "Despesas",
    },
  ];

  const categoryOptions: DropdownOption[] = [
    {
      value: "all",
      label: "Todas as categorias",
    },
    ...categories.map((item) => ({
      value: item,
      label: item,
    })),
  ];

  const periodOptions: DropdownOption[] = [
    {
      value: "all",
      label: "Todos os períodos",
    },
    {
      value: "today",
      label: "Hoje",
    },
    {
      value: "week",
      label: "Esta semana",
    },
    {
      value: "month",
      label: "Este mês",
    },
  ];

  const hasFilters = type !== "all" || category !== "all" || period !== "all";

  function handleClear() {
    onClear();
  }

  return (
    <section className="relative z-[70] overflow-visible border-t border-surface-border bg-[#0d2038]/60">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.015]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/[0.08] text-brand-400">
            <Filter size={15} />
          </span>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
                Filtros
              </span>

              {hasFilters && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-brand-400"
                >
                  Ativos
                </motion.span>
              )}
            </div>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Refine suas movimentações
            </p>
          </div>
        </div>

        <motion.span
          animate={{
            rotate: expanded ? 180 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="text-slate-600"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.22,
              ease: "easeInOut",
            }}
            className="overflow-visible"
          >
            <div className="relative z-[80] flex flex-col gap-3 px-5 pb-5 lg:flex-row lg:items-end">
              <FilterDropdown
                label="Tipo"
                value={type}
                options={typeOptions}
                icon={WalletCards}
                onChange={(value) => onTypeChange(value as TransactionType)}
              />

              <FilterDropdown
                label="Categoria"
                value={category}
                options={categoryOptions}
                icon={Tag}
                onChange={onCategoryChange}
              />

              <FilterDropdown
                label="Período"
                value={period}
                options={periodOptions}
                icon={CalendarDays}
                onChange={(value) => onPeriodChange(value as PeriodFilter)}
              />

              <motion.button
                type="button"
                onClick={handleClear}
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[9px] font-semibold transition-all ${
                  hasFilters
                    ? "border-surface-border bg-surface-sidebar text-slate-400 hover:border-brand-500/30 hover:text-slate-200"
                    : "border-surface-border/70 bg-surface-sidebar/50 text-slate-700"
                }`}
              >
                <motion.span
                  whileHover={{
                    rotate: -45,
                  }}
                >
                  <RotateCcw size={12} />
                </motion.span>
                Limpar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
