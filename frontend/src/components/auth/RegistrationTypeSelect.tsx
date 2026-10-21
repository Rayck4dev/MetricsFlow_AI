"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, ChevronDown, Users } from "lucide-react";
import { RegistrationTypeMenu } from "./registration-type-select/RegistrationTypeMenu";

export type RegistrationType = "create_company" | "join_company";

export interface RegistrationTypeOption {
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

        <RegistrationTypeMenu
          open={open}
          disabled={disabled}
          options={registrationOptions}
          value={value}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
