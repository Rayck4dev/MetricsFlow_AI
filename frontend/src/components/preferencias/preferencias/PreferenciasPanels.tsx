"use client";

import type {
  AppearanceMode,
  FinancePreferences,
  NotificationPreferences,
} from "../Preferencias";
import { PreferenciasAppearance } from "../PreferenciasAppearance";
import { PreferenciasNotifications } from "../PreferenciasNotifications";
import { PreferenciasFinance } from "../PreferenciasFinance";
import { PreferenciasDangerZone } from "../PreferenciasDangerZone";

interface PreferenciasPanelsProps {
  loading: boolean;
  appearance: AppearanceMode;
  onAppearanceChange: (value: AppearanceMode) => void | Promise<void>;
  notifications: NotificationPreferences;
  onNotificationChange: (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => void | Promise<void>;
  finance: FinancePreferences;
  onFinanceChange: (
    key: keyof FinancePreferences,
    value: string,
  ) => void | Promise<void>;
  onDeleteAccount: () => void | Promise<void>;
}

function PreferenceSkeleton() {
  return (
    <div className="h-72 animate-pulse rounded-2xl border border-surface-border bg-surface-panel/50" />
  );
}

export function PreferenciasPanels({
  loading,
  appearance,
  onAppearanceChange,
  notifications,
  onNotificationChange,
  finance,
  onFinanceChange,
  onDeleteAccount,
}: PreferenciasPanelsProps) {
  return loading ? (
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
        onChange={onAppearanceChange}
      />
      <PreferenciasNotifications
        values={notifications}
        onChange={onNotificationChange}
      />
      <PreferenciasFinance values={finance} onChange={onFinanceChange} />
      <PreferenciasDangerZone onDeleteAccount={onDeleteAccount} />
    </div>
  );
}
