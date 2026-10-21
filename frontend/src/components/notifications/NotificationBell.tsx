"use client";

import { useEffect, useRef, useState } from "react";
import { NotificationToggle } from "./notification-bell/NotificationToggle";
import { AnimatePresence } from "framer-motion";

import type { Notification } from "@/types/notifications";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "demo-1",
    user_id: "demo-user",
    actor_user_id: "demo-user",
    company_id: "demo-company",
    type: "transaction_created",
    title: "Nova movimentação",
    message: "Carlos registrou uma receita de R$ 1.250,00.",
    read: false,
    dismissed: false,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-2",
    user_id: "demo-user",
    actor_user_id: "demo-user",
    company_id: "demo-company",
    type: "transaction_created",
    title: "Movimentação registrada",
    message: "Sua despesa de R$ 180,00 foi registrada com sucesso.",
    read: true,
    dismissed: false,
    created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-3",
    user_id: "demo-user",
    actor_user_id: "demo-user",
    company_id: "demo-company",
    type: "financial_summary",
    title: "Resumo financeiro",
    message: "Seu resultado atual é de R$ 4.820,00.",
    read: false,
    dismissed: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

interface NotificationBellProps {
  notifications?: Notification[];
  loading?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (notificationId: string) => void;
  demo?: boolean;
}

export function NotificationBell({
  notifications: externalNotifications,
  loading: externalLoading,
  onMarkAsRead: externalMarkAsRead,
  onMarkAllAsRead: externalMarkAllAsRead,
  onDismiss: externalDismiss,
  demo = false,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    notifications: fetchedNotifications,
    loading: fetchedLoading,
    markAsRead: fetchedMarkAsRead,
    markAllAsRead: fetchedMarkAllAsRead,
    dismissNotification: fetchedDismissNotification,
  } = useNotifications(!demo);

  const [demoNotifications, setDemoNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  const notifications = demo
    ? demoNotifications
    : (externalNotifications ?? fetchedNotifications);

  const loading = demo ? false : (externalLoading ?? fetchedLoading);

  const onMarkAsRead = demo
    ? handleDemoMarkAsRead
    : (externalMarkAsRead ?? fetchedMarkAsRead);

  const onMarkAllAsRead = demo
    ? handleDemoMarkAllAsRead
    : (externalMarkAllAsRead ?? fetchedMarkAllAsRead);

  const onDismiss = demo
    ? handleDemoDismiss
    : (externalDismiss ?? fetchedDismissNotification);
    

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

  function handleDemoMarkAsRead(notificationId: string) {
    setDemoNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  }

  function handleDemoMarkAllAsRead() {
    setDemoNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }

  function handleDemoDismiss(notificationId: string) {
    setDemoNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId),
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <NotificationToggle
        open={open}
        unreadCount={unreadCount}
        onToggle={() => setOpen((current) => !current)}
      />

      <AnimatePresence>
        {open && (
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            loading={loading}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onDismiss={onDismiss}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
