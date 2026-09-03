"use client";

import { BellOff, CheckCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { Notification } from "@/types/notifications";
import { NotificationItem } from "./NotificationItem";

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  loading?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onClose?: () => void;
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  loading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -8,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -8,
        scale: 0.98,
      }}
      transition={{
        duration: 0.18,
        ease: "easeOut",
      }}
      className="
        absolute right-0 top-full z-50 mt-2
        w-[min(380px,calc(100vw-24px))]
        overflow-hidden rounded-2xl
        border border-surface-border
        bg-surface-panel/95
        shadow-2xl shadow-black/30
        backdrop-blur-xl
      "
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white">Notificações</h3>

            {unreadCount > 0 && (
              <span className="rounded-full bg-brand-500/10 px-1.5 py-0.5 text-[9px] font-bold text-brand-400">
                {unreadCount}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-[9px] text-slate-600">
            Atualizações da sua conta e empresa.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="
              inline-flex items-center gap-1.5
              rounded-lg px-2 py-1.5
              text-[9px] font-medium
              text-slate-500
              transition-colors
              hover:bg-white/[0.03]
              hover:text-slate-300
            "
          >
            <CheckCheck size={12} />
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <Loader2 size={14} className="animate-spin" />
              Carregando notificações...
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-sidebar text-slate-600">
              <BellOff size={18} />
            </div>

            <p className="text-xs font-semibold text-slate-400">Tudo em dia</p>

            <p className="mt-1 max-w-[230px] text-[10px] leading-4 text-slate-600">
              Você não possui novas notificações no momento.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  <NotificationItem
                    notification={notification}
                    onRead={onMarkAsRead}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="border-t border-surface-border px-4 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="
              w-full rounded-lg py-1.5
              text-[9px] font-medium
              text-slate-600
              transition-colors
              hover:bg-white/[0.02]
              hover:text-slate-400
            "
          >
            Fechar
          </button>
        </div>
      )}
    </motion.div>
  );
}
