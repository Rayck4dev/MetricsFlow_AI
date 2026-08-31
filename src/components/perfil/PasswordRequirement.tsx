"use client";

import { Check } from "lucide-react";

interface PasswordRequirementProps {
  valid: boolean;
  text: string;
}

export function PasswordRequirement({ valid, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          flex h-4 w-4
          items-center justify-center
          rounded-full

          ${
            valid
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-surface-sidebar text-slate-700"
          }
        `}
      >
        <Check size={9} />
      </div>

      <span
        className={`
          text-[8px]
          ${valid ? "text-emerald-400" : "text-slate-600"}
        `}
      >
        {text}
      </span>
    </div>
  );
}
