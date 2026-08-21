"use client";

import { motion } from "framer-motion";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";

interface DrePeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const periods = [
  { value: "month", label: "Este mês" },
  { value: "previous-month", label: "Mês anterior" },
  { value: "quarter", label: "Este trimestre" },
  { value: "semester", label: "Este semestre" },
  { value: "year", label: "Este ano" },
];

export function DrePeriodSelector({ value, onChange }: DrePeriodSelectorProps) {
  const [open, setOpen] = useState(false);

  const selected = periods.find((item) => item.value === value) ?? periods[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 min-w-[170px] items-center justify-between gap-3 rounded-xl border border-surface-border bg-surface-sidebar px-3.5 text-left transition-all hover:border-brand-500/30"
      >
        <div className="flex items-center gap-2.5">
          <CalendarDays size={14} className="text-brand-400" />

          <div>
            <p className="text-[7px] font-bold uppercase tracking-wider text-slate-600">
              Período
            </p>

            <p className="text-[9px] font-semibold text-slate-300">
              {selected.label}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={13} className="text-slate-500" />
        </motion.div>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar seletor"
            className="fixed inset-0 cursor-default"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-[calc(100%+8px)] z-40 w-[190px] overflow-hidden rounded-xl border border-surface-border bg-surface-sidebar p-1.5 shadow-2xl shadow-black/40"
          >
            {periods.map((item) => {
              const active = item.value === value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-[9px] font-semibold transition-all ${
                    active
                      ? "bg-brand-500/10 text-brand-300"
                      : "text-slate-500 hover:bg-surface-panel hover:text-slate-200"
                  }`}
                >
                  {item.label}

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}
