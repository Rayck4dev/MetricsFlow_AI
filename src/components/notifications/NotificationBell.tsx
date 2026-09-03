"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import type { Notification } from "@/types/notifications";
import { NotificationDropdown } from "./NotificationDropdown";

interface NotificationBellProps {
  notifications?: Notification[];
  loading?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

export function NotificationBell({
  notifications = [],
  loading = false,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          unreadCount > 0
            ? `Notificações. ${unreadCount} não lidas`
            : "Notificações"
        }
        aria-expanded={open}
        className={`
          relative flex h-9 w-9
          items-center justify-center
          rounded-xl border
          transition-all
          ${
            open
              ? "border-brand-500/30 bg-brand-500/10 text-brand-400"
              : "border-surface-border bg-surface-sidebar text-slate-400 hover:border-slate-700 hover:bg-surface-panel hover:text-slate-200"
          }
        `}
      >
        {open ? <X size={16} /> : <Bell size={16} />}

        {unreadCount > 0 && (
          <span
            className="
              absolute -right-1 -top-1
              flex min-h-4 min-w-4
              items-center justify-center
              rounded-full
              border-2 border-surface-main
              bg-brand-500
              px-1
              text-[8px]
              font-bold
              leading-none
              text-white
            "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            loading={loading}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
