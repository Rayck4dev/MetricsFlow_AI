"use client";

import type { KeyboardEvent, RefObject } from "react";
import { ChevronDown } from "lucide-react";

interface TransactionSelectTriggerProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  error?: string;
  open: boolean;
  selectedLabel?: string;
  placeholder: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export function TransactionSelectTrigger({
  label,
  disabled,
  onClick,
  onKeyDown,
  error,
  open,
  selectedLabel,
  placeholder,
  triggerRef,
}: TransactionSelectTriggerProps) {
  return (
    <>
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={`flex h-11 w-full items-center justify-between rounded-xl border bg-surface-sidebar px-3.5 text-left outline-none transition-all ${
          error
            ? "border-rose-500/50"
            : open
              ? "border-brand-500/60 bg-surface-main ring-2 ring-brand-500/10"
              : "border-surface-border hover:border-slate-600 focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={
            selectedLabel
              ? "truncate text-xs font-medium text-slate-200"
              : "text-xs font-medium text-slate-500"
          }
        >
          {selectedLabel ?? placeholder}
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180 text-slate-300" : ""
          }`}
        />
      </button>
    </>
  );
}
