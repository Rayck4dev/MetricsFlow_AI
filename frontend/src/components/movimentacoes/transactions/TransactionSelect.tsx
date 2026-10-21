"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { TransactionSelectMenu } from "./transaction-select/TransactionSelectMenu";
import { TransactionSelectTrigger } from "./transaction-select/TransactionSelectTrigger";

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

const MENU_MAX_HEIGHT = 160;
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

    const menuHeight = Math.min(MENU_MAX_HEIGHT, Math.max(80, availableSpace));

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
      <TransactionSelectTrigger
        label={label}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        error={error}
        open={open}
        selectedLabel={selectedOption?.label}
        placeholder={placeholder}
        triggerRef={triggerRef}
      />

      <TransactionSelectMenu
        mounted={mounted}
        open={open}
        disabled={disabled}
        options={options}
        value={value}
        menuPosition={menuPosition}
        menuRef={menuRef}
        handleSelect={handleSelect}
        maxHeight={MENU_MAX_HEIGHT}
      />

      {error && (
        <p className="text-[10px] font-medium text-rose-400">{error}</p>
      )}
    </div>
  );
}
