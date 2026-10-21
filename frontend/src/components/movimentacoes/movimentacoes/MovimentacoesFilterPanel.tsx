"use client";

import { motion } from "framer-motion";
import type { PeriodFilter, TransactionType } from "@/types";
import { MovimentacoesFilters } from "../MovimentacoesFilters";
import { MovimentacoesSearch } from "../MovimentacoesSearch";
import { MovimentacoesActions } from "../MovimentacoesActions";

interface MovimentacoesFilterPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddIncome: () => void;
  onAddExpense: () => void;
  onExport: () => void;
  type: TransactionType;
  category: string;
  period: PeriodFilter;
  categories: string[];
  onTypeChange: (value: TransactionType) => void;
  onCategoryChange: (value: string) => void;
  onPeriodChange: (value: PeriodFilter) => void;
  onClear: () => void;
}

export function MovimentacoesFilterPanel(props: MovimentacoesFilterPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
      className="relative overflow-visible rounded-2xl border border-surface-border bg-surface-panel/80 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-5"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-brand-500/[0.06] blur-3xl" />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <MovimentacoesSearch
            value={props.search}
            onChange={props.onSearchChange}
          />
          <MovimentacoesActions
            onAddIncome={props.onAddIncome}
            onAddExpense={props.onAddExpense}
            onExport={props.onExport}
          />
        </div>
        <MovimentacoesFilters
          type={props.type}
          category={props.category}
          period={props.period}
          categories={props.categories}
          onTypeChange={props.onTypeChange}
          onCategoryChange={props.onCategoryChange}
          onPeriodChange={props.onPeriodChange}
          onClear={props.onClear}
        />
      </div>
    </motion.section>
  );
}
