"use client";

import {
  Bell,
  CheckCircle2,
  MessageCircle,
  Pencil,
  PlusCircle,
  Trash2,
  WalletCards,
} from "lucide-react";

import type { Notification } from "@/types/notifications";

interface NotificationItemProps {
  notification: Notification;
  onRead?: (notificationId: string) => void;
}

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "transaction_created":
      return PlusCircle;

    case "transaction_updated":
      return Pencil;

    case "transaction_deleted":
      return Trash2;

    case "financial_summary":
      return CheckCircle2;

    case "whatsapp":
      return MessageCircle;

    default:
      return Bell;
  }
}

function getNotificationIconStyle(type: Notification["type"]) {
  switch (type) {
    case "transaction_created":
      return "bg-emerald-500/10 text-emerald-400";

    case "transaction_updated":
      return "bg-brand-500/10 text-brand-400";

    case "transaction_deleted":
      return "bg-red-500/10 text-red-400";

    case "financial_summary":
      return "bg-violet-500/10 text-violet-400";

    case "whatsapp":
      return "bg-green-500/10 text-green-400";

    default:
      return "bg-surface-sidebar text-slate-400";
  }
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "agora";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `há ${diffInHours} h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `há ${diffInDays} d`;
  }

  return date.toLocaleDateString("pt-BR");
}

export function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);

  const iconStyle = getNotificationIconStyle(notification.type);

  const handleClick = () => {
    if (!notification.read) {
      onRead?.(notification.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
        notification.read
          ? "bg-transparent hover:bg-white/[0.02]"
          : "bg-brand-500/[0.035] hover:bg-brand-500/[0.06]"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-[11px] font-semibold leading-4 ${
              notification.read ? "text-slate-300" : "text-white"
            }`}
          >
            {notification.title}
          </p>

          {!notification.read && (
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
          )}
        </div>

        <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
          {notification.message}
        </p>

        <p className="mt-1 text-[9px] text-slate-600">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
    </button>
  );
}
