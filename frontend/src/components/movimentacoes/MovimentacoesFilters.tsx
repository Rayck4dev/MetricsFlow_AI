"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  Filter,
  RotateCcw,
  Tag,
  WalletCards,
} from "lucide-react";
import type { PeriodFilter, TransactionType } from "@/types/index";
import { FilterDropdown, type DropdownOption } from "./FilterDropdown";

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
    { value: "all", label: "Todos os tipos" },
    { value: "income", label: "Receitas" },
    { value: "expense", label: "Despesas" },
  ];
  const categoryOptions: DropdownOption[] = [
    { value: "all", label: "Todas as categorias" },
    ...categories.map((item) => ({ value: item, label: item })),
  ];
  const periodOptions: DropdownOption[] = [
    { value: "all", label: "Todos os períodos" },
    { value: "today", label: "Hoje" },
    { value: "week", label: "Esta semana" },
    { value: "month", label: "Este mês" },
  ];
  const hasFilters = type !== "all" || category !== "all" || period !== "all";

  return (
    <section className="relative z-[50] overflow-visible border-t border-surface-border bg-[#0d2038]/60">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.015]"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/[0.08] text-brand-400">
            <Filter size={15} />
          </span>
          <span>
            <span className="flex items-center gap-2">
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
            </span>
            <span className="mt-0.5 block text-[9px] text-slate-600">
              Refine suas movimentações
            </span>
          </span>
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-600"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-visible"
          >
            <div className="relative z-[60] flex flex-col gap-3 px-5 pb-5 lg:flex-row lg:items-end">
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
                onClick={onClear}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[9px] font-semibold transition-all ${
                  hasFilters
                    ? "border-surface-border bg-surface-sidebar text-slate-400 hover:border-brand-500/30 hover:text-slate-200"
                    : "border-surface-border/70 bg-surface-sidebar/50 text-slate-700"
                }`}
              >
                <motion.span whileHover={{ rotate: -45 }}>
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
