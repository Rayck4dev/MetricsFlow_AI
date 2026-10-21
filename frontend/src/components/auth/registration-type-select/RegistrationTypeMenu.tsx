"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type {
  RegistrationType,
  RegistrationTypeOption,
} from "../RegistrationTypeSelect";

interface RegistrationTypeMenuProps {
  open: boolean;
  disabled: boolean;
  options: RegistrationTypeOption[];
  value: RegistrationType;
  onSelect: (type: RegistrationType) => void;
}

export function RegistrationTypeMenu({
  open,
  disabled,
  options,
  value,
  onSelect,
}: RegistrationTypeMenuProps) {
  return (
    <AnimatePresence>
      {open && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -5, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] overflow-hidden rounded-xl border border-surface-border bg-surface-sidebar p-1 shadow-2xl"
          role="listbox"
        >
          {options.map((option) => {
            const OptionIcon = option.icon;
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect(option.value)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${isSelected ? "bg-brand-500/10" : "hover:bg-surface-panel"}`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${isSelected ? "border-brand-500/20 bg-brand-500/10 text-brand-400" : "border-surface-border bg-surface-panel text-slate-500"}`}
                >
                  <OptionIcon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[10px] font-semibold ${isSelected ? "text-brand-400" : "text-white"}`}
                  >
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-500">
                    {option.description}
                  </p>
                </div>
                {isSelected && (
                  <Check size={14} className="shrink-0 text-brand-400" />
                )}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
