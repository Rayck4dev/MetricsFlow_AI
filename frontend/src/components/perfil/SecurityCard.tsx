"use client";

import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface SecurityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;

  onClick?: () => void | Promise<void>;

  disabled?: boolean;
  loading?: boolean;
}

export function SecurityCard({
  icon,
  title,
  description,
  actionLabel,
  onClick,
  disabled = false,
  loading = false,
}: SecurityCardProps) {
  return (
    <motion.div
      whileHover={
        disabled
          ? undefined
          : {
              y: -2,
            }
      }
      transition={{
        duration: 0.2,
      }}
      className="
        flex flex-col gap-4
        rounded-xl
        border border-surface-border
        bg-surface-sidebar/70
        p-4
        sm:flex-row sm:items-center
      "
    >
      <div
        className="
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-xl
          bg-brand-500/10
        "
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-xs font-bold text-slate-200">{title}</h3>

        <p className="mt-1 text-[9px] leading-4 text-slate-600">
          {description}
        </p>
      </div>

      <button
        type="button"
        disabled={disabled || loading}
        onClick={onClick}
        className={`
          inline-flex h-9 shrink-0
          items-center justify-center gap-2
          rounded-lg border
          px-3
          text-[9px] font-bold
          transition-all

          ${
            disabled
              ? `
                cursor-default
                border-emerald-500/10
                bg-emerald-500/[0.05]
                text-emerald-400
              `
              : `
                border-surface-border
                bg-surface-panel
                text-slate-400
                hover:border-brand-500/30
                hover:bg-brand-500/[0.04]
                hover:text-brand-300
                active:scale-[0.98]
              `
          }
        `}
      >
        {loading && <Loader2 size={11} className="animate-spin" />}

        {actionLabel}

        {!disabled && !loading && <ArrowRight size={11} />}
      </button>
    </motion.div>
  );
}
