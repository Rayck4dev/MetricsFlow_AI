"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleAlert, Info, X, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  open: boolean;
  type?: ToastType;
  title: string;
  message?: string;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconClassName: "text-emerald-400",
    iconBackground: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  error: {
    icon: XCircle,
    iconClassName: "text-red-400",
    iconBackground: "bg-red-500/10",
    border: "border-red-500/20",
  },
  warning: {
    icon: CircleAlert,
    iconClassName: "text-amber-400",
    iconBackground: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  info: {
    icon: Info,
    iconClassName: "text-blue-400",
    iconBackground: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

export default function Toast({
  open,
  type = "success",
  title,
  message,
  onClose,
}: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 24, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 24, y: 8, scale: 0.96 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 28,
          }}
          className="fixed bottom-5 right-5 z-[200] w-[calc(100%-2rem)] max-w-sm"
          role="status"
          aria-live="polite"
        >
          <div
            className={`flex items-start gap-3 rounded-2xl border ${config.border} bg-surface-panel/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBackground}`}
            >
              <Icon size={19} className={config.iconClassName} />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold text-white">{title}</p>

              {message && (
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-surface-sidebar hover:text-slate-300"
              aria-label="Fechar notificação"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
