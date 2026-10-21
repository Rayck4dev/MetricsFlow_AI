"use client";

import { useCallback, useEffect, useState } from "react";

import { PreferenciasHeader } from "./preferencias/PreferenciasHeader";
import { PreferenciasPanels } from "./preferencias/PreferenciasPanels";

import { getUserPreferences } from "@/services/preferences/getUserPreferences";
import {
  saveAppearancePreference,
  saveFinancePreference,
  saveNotificationPreference,
} from "./preferencias/preferenceUpdates";

export type AppearanceMode = "dark";

export interface NotificationPreferences {
  emailNotifications: boolean;
  transactionNotifications: boolean;
  whatsappNotifications: boolean;
}

export interface FinancePreferences {
  defaultPeriod: string;
  currency: "BRL";
}

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  emailNotifications: true,
  transactionNotifications: true,
  whatsappNotifications: true,
};

const DEFAULT_FINANCE: FinancePreferences = {
  defaultPeriod: "month",
  currency: "BRL",
};

export function Preferencias() {
  const [appearance, setAppearance] = useState<AppearanceMode>("dark");

  const [notifications, setNotifications] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATIONS,
  );

  const [finance, setFinance] = useState<FinancePreferences>(DEFAULT_FINANCE);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadPreferences() {
      try {
        setLoading(true);
        setError("");

        const preferences = await getUserPreferences();

        if (!mounted) {
          return;
        }

        setNotifications({
          emailNotifications: preferences.email_notifications,

          transactionNotifications: preferences.transaction_notifications,

          whatsappNotifications: preferences.whatsapp_notifications,
        });

        setFinance({
          defaultPeriod: preferences.default_period,

          currency: preferences.currency === "BRL" ? "BRL" : "BRL",
        });
      } catch (error) {
        console.error("💥 Erro ao carregar preferências:", error);

        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar suas preferências.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPreferences();

    return () => {
      mounted = false;
    };
  }, []);

  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  const handleAppearanceChange = useCallback(
    (value: AppearanceMode) =>
      saveAppearancePreference(value, appearance, setAppearance, {
        clearMessages,
        setSaving,
        setError,
        setSuccessMessage,
      }),
    [appearance, clearMessages],
  );

  const updateNotification = useCallback(
    (key: keyof NotificationPreferences, value: boolean) =>
      saveNotificationPreference(key, value, notifications, setNotifications, {
        clearMessages,
        setSaving,
        setError,
        setSuccessMessage,
      }),
    [notifications, clearMessages],
  );

  const updateFinance = useCallback(
    (key: keyof FinancePreferences, value: string) =>
      saveFinancePreference(key, value, finance, setFinance, {
        clearMessages,
        setSaving,
        setError,
        setSuccessMessage,
      }),
    [finance, clearMessages],
  );

  async function handleDeleteAccount() {
    setError("A exclusão da conta ainda não está disponível.");
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-6 pb-10">
      <PreferenciasHeader
        loading={loading}
        saving={saving}
        error={error}
        successMessage={successMessage}
      />

      <PreferenciasPanels
        loading={loading}
        appearance={appearance}
        onAppearanceChange={handleAppearanceChange}
        notifications={notifications}
        onNotificationChange={updateNotification}
        finance={finance}
        onFinanceChange={updateFinance}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
