"use client";

import { motion } from "framer-motion";
import { Bell, Mail, Receipt, MessageCircle } from "lucide-react";

import type { NotificationPreferences } from "./Preferencias";

interface PreferenciasNotificationsProps {
  values: NotificationPreferences;
  onChange: (key: keyof NotificationPreferences, value: boolean) => void;
}

const options: {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
  icon: typeof Bell;
}[] = [
  {
    key: "emailNotifications",
    label: "Notificações por e-mail",
    description: "Receber atualizações importantes por e-mail.",
    icon: Mail,
  },
  {
    key: "transactionNotifications",
    label: "Notificações de movimentações",
    description: "Receber avisos relacionados às movimentações financeiras.",
    icon: Receipt,
  },
  {
    key: "whatsappNotifications",
    label: "Notificações do WhatsApp",
    description: "Receber atualizações relacionadas à integração com WhatsApp.",
    icon: MessageCircle,
  },
];

export function PreferenciasNotifications({
  values,
  onChange,
}: PreferenciasNotificationsProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: 0.05,
      }}
      className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="border-b border-surface-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
            <Bell size={16} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Notificações</h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Controle quais atualizações deseja receber.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-surface-border">
        {options.map((option) => {
          const Icon = option.icon;
          const enabled = values[option.key];

          return (
            <div
              key={option.key}
              className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-sidebar text-slate-500">
                  <Icon size={14} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-300">
                    {option.label}
                  </p>

                  <p className="mt-0.5 text-[8px] leading-4 text-slate-600">
                    {option.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={option.label}
                onClick={() => onChange(option.key, !enabled)}
                className={`relative h-6 w-10 shrink-0 rounded-full border transition-all ${
                  enabled
                    ? "border-brand-500/40 bg-brand-500"
                    : "border-surface-border bg-surface-sidebar"
                }`}
              >
                <motion.span
                  animate={{
                    x: enabled ? 20 : 5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="absolute left-0 top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
