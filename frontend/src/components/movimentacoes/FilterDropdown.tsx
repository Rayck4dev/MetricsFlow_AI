"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  icon: React.ElementType;
  onChange: (value: string) => void;
}

export function FilterDropdown({
  label,
  value,
  options,
  icon: Icon,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = options.find((item) => item.value === value);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = Math.min(options.length * 42 + 12, 256);
    const gap = 8;
    const viewportPadding = 12;
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldOpenTop =
      spaceBelow < menuHeight + gap && rect.top > spaceBelow;
    let left = rect.left;
    let width = Math.max(rect.width, 210);

    if (left + width > window.innerWidth - viewportPadding) {
      left = window.innerWidth - width - viewportPadding;
    }
    if (left < viewportPadding) {
      left = viewportPadding;
      width = Math.min(width, window.innerWidth - viewportPadding * 2);
    }

    setPosition(shouldOpenTop ? "top" : "bottom");
    setMenuStyle({
      position: "fixed",
      left,
      width,
      zIndex: 9999,
      ...(shouldOpenTop
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
    });
  }, [options.length]);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  return (
    <div className="w-full min-w-0 lg:min-w-[185px] lg:flex-1">
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!open) updatePosition();
          setOpen((current) => !current);
        }}
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
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="shrink-0 text-slate-600"
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.98, y: position === "top" ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: position === "top" ? 5 : -5 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            style={menuStyle}
            className="origin-center overflow-hidden rounded-xl border border-surface-border bg-[#0b1329] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-brand-500/10 blur-2xl" />
            <div className="relative max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
              {options.map((option, index) => {
                const active = option.value === value;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.14, delay: index * 0.025 }}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
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
                    <span className="min-w-0 flex-1 text-[10px] font-semibold">
                      {option.label}
                    </span>
                    {active && (
                      <Check size={13} className="shrink-0 text-brand-400" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>,
          document.body,
        )}
    </div>
  );
}
