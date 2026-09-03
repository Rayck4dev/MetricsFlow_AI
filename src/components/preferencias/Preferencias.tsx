"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { PreferenciasAppearance } from "./PreferenciasAppearance";
import { PreferenciasNotifications } from "./PreferenciasNotifications";
import { PreferenciasFinance } from "./PreferenciasFinance";
import { PreferenciasDangerZone } from "./PreferenciasDangerZone";

import { getUserPreferences } from "@/services/preferences/getUserPreferences";
import { updateUserPreferences } from "@/services/preferences/updateUserPreferences";

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
    async (value: AppearanceMode) => {
      clearMessages();

      const previousValue = appearance;

      setAppearance(value);
      setSaving(true);

      try {
        await updateUserPreferences({
          theme: value,
        });

        setSuccessMessage("Preferência de aparência atualizada.");
      } catch (error) {
        console.error("💥 Erro ao atualizar aparência:", error);

        setAppearance(previousValue);

        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a aparência.",
        );
      } finally {
        setSaving(false);
      }
    },
    [appearance, clearMessages],
  );

  const updateNotification = useCallback(
    async (key: keyof NotificationPreferences, value: boolean) => {
      clearMessages();

      const previousValue = notifications[key];

      setNotifications((current) => ({
        ...current,
        [key]: value,
      }));

      setSaving(true);

      const databaseField =
        key === "emailNotifications"
          ? "email_notifications"
          : key === "transactionNotifications"
            ? "transaction_notifications"
            : "whatsapp_notifications";

      try {
        await updateUserPreferences({
          [databaseField]: value,
        });

        setSuccessMessage("Preferência de notificação atualizada.");
      } catch (error) {
        console.error("💥 Erro ao atualizar notificação:", error);

        setNotifications((current) => ({
          ...current,
          [key]: previousValue,
        }));

        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a notificação.",
        );
      } finally {
        setSaving(false);
      }
    },
    [notifications, clearMessages],
  );

  const updateFinance = useCallback(
    async (key: keyof FinancePreferences, value: string) => {
      clearMessages();

      const previousValue = finance[key];

      setFinance((current) => ({
        ...current,
        [key]: value,
      }));

      setSaving(true);

      const databaseField =
        key === "defaultPeriod" ? "default_period" : "currency";

      try {
        await updateUserPreferences({
          [databaseField]: value,
        });

        setSuccessMessage("Preferência financeira atualizada.");
      } catch (error) {
        console.error("💥 Erro ao atualizar preferência financeira:", error);

        setFinance((current) => ({
          ...current,
          [key]: previousValue,
        }));

        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a preferência.",
        );
      } finally {
        setSaving(false);
      }
    },
    [finance, clearMessages],
  );

  async function handleDeleteAccount() {
    setError("A exclusão da conta ainda não está disponível.");
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-6 pb-10">
      <motion.header
        initial={{
          opacity: 0,
          y: -12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-brand-500/[0.08] blur-3xl" />

        <div className="relative">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-400">
            Configurações
          </p>

          <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Preferências
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
            Personalize sua experiência e defina como o sistema deve funcionar
            para você.
          </p>

          {(loading || saving || error || successMessage) && (
            <div className="mt-3">
              {loading && (
                <p className="text-[10px] text-slate-500">
                  Carregando suas preferências...
                </p>
              )}

              {!loading && saving && (
                <p className="text-[10px] text-brand-400">
                  Salvando alteração...
                </p>
              )}

              {!saving && error && (
                <p className="text-[10px] text-red-400">{error}</p>
              )}

              {!saving && !error && successMessage && (
                <p className="text-[10px] text-emerald-400">{successMessage}</p>
              )}
            </div>
          )}
        </div>
      </motion.header>

      {loading ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <PreferenceSkeleton />
          <PreferenceSkeleton />
          <PreferenceSkeleton />
          <PreferenceSkeleton />
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <PreferenciasAppearance
            value={appearance}
            onChange={handleAppearanceChange}
          />

          <PreferenciasNotifications
            values={notifications}
            onChange={updateNotification}
          />

          <PreferenciasFinance values={finance} onChange={updateFinance} />

          <PreferenciasDangerZone onDeleteAccount={handleDeleteAccount} />
        </div>
      )}
    </div>
  );
}

function PreferenceSkeleton() {
  return (
    <div className="h-72 animate-pulse rounded-2xl border border-surface-border bg-surface-panel/50" />
  );
}
