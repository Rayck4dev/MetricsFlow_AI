"use client";

import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";

interface TransactionSelectOption {
  value: string;
  label: string;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
  openUp: boolean;
}

interface TransactionSelectMenuProps {
  mounted: boolean;
  open: boolean;
  disabled: boolean;
  options: TransactionSelectOption[];
  value: string;
  menuPosition: MenuPosition | null;
  menuRef: RefObject<HTMLDivElement | null>;
  handleSelect: (value: string) => void;
  maxHeight: number;
}

export function TransactionSelectMenu({
  mounted,
  open,
  disabled,
  options,
  value,
  menuPosition,
  menuRef,
  handleSelect,
  maxHeight,
}: TransactionSelectMenuProps) {
  if (!mounted || !open || !menuPosition || disabled) return null;
  return (
    mounted &&
    open &&
    menuPosition &&
    !disabled &&
    createPortal(
      <div
        ref={menuRef}
        role="listbox"
        className="fixed z-[9999] overflow-hidden rounded-xl border border-surface-border bg-surface-panel/98 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl"
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
          width: menuPosition.width,
        }}
      >
        <div
          className="overflow-y-auto pr-0.5"
          style={{
            maxHeight: maxHeight,
          }}
        >
          {options.length > 0 ? (
            options.map((option) => {
              const selected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "bg-brand-500/10 text-brand-300"
                      : "text-slate-300 hover:bg-surface-sidebar hover:text-white"
                  }`}
                >
                  <span className="min-w-0 truncate text-xs font-medium">
                    {option.label}
                  </span>

                  {selected && (
                    <Check size={15} className="shrink-0 text-brand-400" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-3 text-xs text-slate-600">
              Nenhuma opção disponível.
            </div>
          )}
        </div>
      </div>,
      document.body,
    )
  );
}
