import type { Dispatch, SetStateAction } from "react";

import { updateUserPreferences } from "@/services/preferences/updateUserPreferences";
import type {
  AppearanceMode,
  FinancePreferences,
  NotificationPreferences,
} from "../Preferencias";

type StateSetter<T> = Dispatch<SetStateAction<T>>;

interface UpdateMessages {
  clearMessages: () => void;
  setSaving: StateSetter<boolean>;
  setError: StateSetter<string>;
  setSuccessMessage: StateSetter<string>;
}

export async function saveAppearancePreference(
  value: AppearanceMode,
  previousValue: AppearanceMode,
  setAppearance: StateSetter<AppearanceMode>,
  { clearMessages, setSaving, setError, setSuccessMessage }: UpdateMessages,
) {
  clearMessages();

  setAppearance(value);
  setSaving(true);

  try {
    await updateUserPreferences({
      theme: value,
    });

    setSuccessMessage("Preferência de aparência atualizada.");
  } catch (error) {
    console.error("Erro ao atualizar aparencia:", error);

    setAppearance(previousValue);

    setError(
      error instanceof Error
        ? error.message
        : "Não foi possivel atualizar a aparencia.",
    );
  } finally {
    setSaving(false);
  }
}

export async function saveNotificationPreference(
  key: keyof NotificationPreferences,
  value: boolean,
  notifications: NotificationPreferences,
  setNotifications: StateSetter<NotificationPreferences>,
  { clearMessages, setSaving, setError, setSuccessMessage }: UpdateMessages,
) {
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
    console.error("Erro ao atualizar notificação:", error);

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
}

export async function saveFinancePreference(
  key: keyof FinancePreferences,
  value: string,
  finance: FinancePreferences,
  setFinance: StateSetter<FinancePreferences>,
  { clearMessages, setSaving, setError, setSuccessMessage }: UpdateMessages,
) {
  clearMessages();

  const previousValue = finance[key];

  setFinance((current) => ({
    ...current,
    [key]: value,
  }));

  setSaving(true);

  const databaseField = key === "defaultPeriod" ? "default_period" : "currency";

  try {
    await updateUserPreferences({
      [databaseField]: value,
    });

    setSuccessMessage("Preferência financeira atualizada.");
  } catch (error) {
    console.error("Erro ao atualizar preferência financeira:", error);

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
}
