import { Bell, X } from "lucide-react";

interface NotificationToggleProps {
  open: boolean;
  unreadCount: number;
  onToggle: () => void;
}

export function NotificationToggle({ open, unreadCount, onToggle }: NotificationToggleProps) {
  return (
      <button
        type="button"
        onClick={onToggle}
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
  );
}
