import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/notifications";

type SupabaseClient = ReturnType<typeof createClient>;

interface UseNotificationActionsOptions {
  supabase: SupabaseClient;
  enabled: boolean;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export function useNotificationActions({
  supabase,
  enabled,
  setNotifications,
}: UseNotificationActionsOptions) {
  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!enabled) return;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("[notifications] Usuário não autenticado.");
        return;
      }

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) {
        console.error("[notifications] Erro ao marcar como lida:", error);
        return;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
    },
    [enabled, setNotifications, supabase],
  );

  const markAllAsRead = useCallback(async () => {
    if (!enabled) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("[notifications] Usuário não autenticado.");
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) {
      console.error("[notifications] Erro ao marcar todas como lidas:", error);
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  }, [enabled, setNotifications, supabase]);

  const dismissNotification = useCallback(
    async (notificationId: string) => {
      if (!enabled) return;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("[notifications] Usuário não autenticado.");
        return;
      }

      const { error } = await supabase
        .from("notifications")
        .update({ dismissed: true })
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) {
        console.error("[notifications] Erro ao dispensar notificação:", error);
        return;
      }

      setNotifications((current) =>
        current.filter((notification) => notification.id !== notificationId),
      );
    },
    [enabled, setNotifications, supabase],
  );

  return { markAsRead, markAllAsRead, dismissNotification };
}
