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

interface DrePeriodSelectorProps {
  value: DrePeriod;
  onChange: (value: DrePeriod) => void;
}

const periods: {
  value: DrePeriod;
  label: string;
  description: string;
}[] = [
  {
    value: "today",
    label: "Hoje",
    description: "Movimentações do dia",
  },
  {
    value: "week",
    label: "Esta semana",
    description: "Últimos 7 dias",
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
    description: "Resultado anual",
  },
  {
    value: "custom",
    label: "Personalizado",
    description: "Selecionar intervalo",
  },
];

export function DrePeriodSelector({ value, onChange }: DrePeriodSelectorProps) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const current = periods.find((item) => item.value === value) ?? periods[2];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(selectedPeriod: DrePeriod) {
    onChange(selectedPeriod);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative z-[100] min-w-0">
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((previous) => !previous)}
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
              {current.label}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
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
            className="absolute right-0 top-full z-[200] w-[min(280px,calc(100vw-2rem))] rounded-2xl border border-surface-border bg-[#122033] p-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="mb-1 flex items-center gap-2 px-2 py-2">
              <Clock3 size={12} className="text-brand-400" />

              <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Selecione o período
              </span>
            </div>

            <div className="space-y-1">
              {periods.map((item) => {
                const active = value === item.value;

                return (
                  <motion.button
                    key={item.value}
                    type="button"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(item.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                      active ? "bg-brand-500/10" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`text-[10px] font-semibold ${
                          active ? "text-brand-300" : "text-slate-300"
                        }`}
                      >
                        {item.label}
                      </p>

                      <p className="mt-0.5 truncate text-[8px] text-slate-600">
                        {item.description}
                      </p>
                    </div>

                    {active && (
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
    </div>
  );
}
