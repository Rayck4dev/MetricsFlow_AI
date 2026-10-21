"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/notifications";
import { useNotificationActions } from "./notifications/useNotificationActions";

export function useNotifications(enabled = true) {
  const supabase = useMemo(() => createClient(), []);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(enabled);

  const fetchNotifications = useCallback(async () => {
    if (!enabled) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("[notifications] Erro ao obter usuário:", userError);
        setNotifications([]);
        return;
      }
      if (!user) {
        setNotifications([]);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("dismissed", false)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) {
        console.error("[notifications] Erro ao buscar notificações:", error);
        setNotifications([]);
        return;
      }
      setNotifications((data ?? []) as Notification[]);
    } catch (error) {
      console.error("[notifications] Erro inesperado:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, supabase]);

  const actions = useNotificationActions({
    supabase,
    enabled,
    setNotifications,
  });

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead: actions.markAsRead,
    markAllAsRead: actions.markAllAsRead,
    dismissNotification: actions.dismissNotification,
  };
}
