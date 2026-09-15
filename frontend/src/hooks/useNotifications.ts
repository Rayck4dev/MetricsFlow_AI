"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/notifications";

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
        .order("created_at", {
          ascending: false,
        })
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

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!enabled) {
        return;
      }

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
        .update({
          read: true,
        })
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) {
        console.error("[notifications] Erro ao marcar como lida:", error);

        return;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification,
        ),
      );
    },
    [enabled, supabase],
  );

  const markAllAsRead = useCallback(async () => {
    if (!enabled) {
      return;
    }

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
      .update({
        read: true,
      })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) {
      console.error("[notifications] Erro ao marcar todas como lidas:", error);

      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }, [enabled, supabase]);

  const dismissNotification = useCallback(
    async (notificationId: string) => {
      if (!enabled) {
        return;
      }

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
        .update({
          dismissed: true,
        })
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
    [enabled, supabase],
  );

  useEffect(() => {
    if (!enabled) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    void fetchNotifications();
  }, [enabled, fetchNotifications]);

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  };
}
