"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Check, ChevronDown, Users } from "lucide-react";

export type RegistrationType = "create_company" | "join_company";

interface RegistrationTypeOption {
  value: RegistrationType;
  label: string;
  description: string;
  icon: typeof Building2;
}

interface RegistrationTypeSelectProps {
  value: RegistrationType;
  onChange: (type: RegistrationType) => void;
  disabled?: boolean;
}

const registrationOptions: RegistrationTypeOption[] = [
  {
    value: "create_company",
    label: "Criar uma empresa",
    description: "Vou administrar meu próprio negócio.",
    icon: Building2,
  },
  {
    value: "join_company",
    label: "Entrar em uma empresa",
    description: "Tenho um código de convite.",
    icon: Users,
  },
];

export function RegistrationTypeSelect({
  value,
  onChange,
  disabled = false,
}: RegistrationTypeSelectProps) {
  const [open, setOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    registrationOptions.find((option) => option.value === value) ??
    registrationOptions[0];

  const SelectedIcon = selectedOption.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelect(type: RegistrationType) {
    onChange(type);
    setOpen(false);
  }

  return (
    <div ref={selectRef}>
      <label className="mb-1 block text-xs font-semibold text-slate-300">
        Tipo de acesso
      </label>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`
            flex h-10 w-full items-center gap-2
            rounded-xl
            border
            bg-surface-sidebar
            px-3
            text-left
            outline-none
            transition-all
            disabled:cursor-not-allowed
            disabled:opacity-60
            ${
              open
                ? "border-brand-500/50 ring-2 ring-brand-500/10"
                : "border-surface-border hover:border-slate-600"
            }
          `}
        >
          <div
            className={`
              flex h-6 w-6 shrink-0
              items-center justify-center
              rounded-lg
              ${
                open
                  ? "bg-brand-500/10 text-brand-400"
                  : "bg-surface-panel text-slate-500"
              }
            `}
          >
            <SelectedIcon size={13} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-semibold text-white">
              {selectedOption.label}
            </p>

            <p className="truncate text-[9px] text-slate-500">
              {selectedOption.description}
            </p>
          </div>

          <ChevronDown
            size={14}
            className={`
              shrink-0 text-slate-500
              transition-transform duration-200
              ${open ? "rotate-180 text-brand-400" : ""}
            `}
          />
        </button>

        <AnimatePresence>
          {open && !disabled && (
            <motion.div
              initial={{
                opacity: 0,
                y: -5,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -5,
                scale: 0.98,
              }}
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
              className="
                absolute left-0 right-0 top-[calc(100%+6px)]
                z-[100]
                overflow-hidden
                rounded-xl
                border border-surface-border
                bg-surface-sidebar
                p-1
                shadow-2xl
              "
              role="listbox"
            >
              {registrationOptions.map((option) => {
                const OptionIcon = option.icon;

                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      flex w-full items-center gap-2.5
                      rounded-lg
                      px-2.5 py-2
                      text-left
                      transition-colors
                      ${
                        isSelected
                          ? "bg-brand-500/10"
                          : "hover:bg-surface-panel"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex h-7 w-7 shrink-0
                        items-center justify-center
                        rounded-lg
                        border
                        ${
                          isSelected
                            ? "border-brand-500/20 bg-brand-500/10 text-brand-400"
                            : "border-surface-border bg-surface-panel text-slate-500"
                        }
                      `}
                    >
                      <OptionIcon size={14} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`
                          text-[10px] font-semibold
                          ${isSelected ? "text-brand-400" : "text-white"}
                        `}
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
      </div>
    </div>
  );
}
