"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

interface TransactionSelectOption {
  value: string;
  label: string;
}

interface TransactionSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: TransactionSelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
  openUp: boolean;
}

const MENU_MAX_HEIGHT = 220;
const MENU_GAP = 6;
const VIEWPORT_PADDING = 12;

export function TransactionSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione",
  error,
  disabled = false,
}: TransactionSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateMenuPosition() {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();

    const spaceAbove = rect.top - VIEWPORT_PADDING;
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;

    const shouldOpenUp =
      spaceBelow < MENU_MAX_HEIGHT + MENU_GAP && spaceAbove > spaceBelow;

    const availableSpace = shouldOpenUp ? spaceAbove : spaceBelow;

    const menuHeight = Math.min(MENU_MAX_HEIGHT, Math.max(120, availableSpace));

    const top = shouldOpenUp
      ? rect.top - MENU_GAP - menuHeight
      : rect.bottom + MENU_GAP;

    setMenuPosition({
      top: Math.max(
        VIEWPORT_PADDING,
        Math.min(top, window.innerHeight - menuHeight - VIEWPORT_PADDING),
      ),
      left: rect.left,
      width: rect.width,
      openUp: shouldOpenUp,
    });
  }

  function handleToggle() {
    if (disabled) {
      return;
    }

    if (!open) {
      updateMenuPosition();
      setOpen(true);
      return;
    }

    setOpen(false);
  }

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    updateMenuPosition();

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>

      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
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
            selectedOption
              ? "truncate text-xs font-medium text-slate-200"
              : "text-xs font-medium text-slate-500"
          }
        >
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180 text-slate-300" : ""
          }`}
        />
      </button>

      {mounted &&
        open &&
        menuPosition &&
        !disabled &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            className="fixed z-[9999] overflow-hidden rounded-xl border border-surface-border bg-surface-panel/98 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl mt-6"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
            <div
              className="overflow-y-auto pr-0.5"
              style={{
                maxHeight: MENU_MAX_HEIGHT,
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
        )}

      {error && (
        <p className="text-[10px] font-medium text-rose-400">{error}</p>
      )}
    </div>
  );
}
