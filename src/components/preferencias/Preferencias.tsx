"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { PreferenciasAppearance } from "./PreferenciasAppearance";
import { PreferenciasNotifications } from "./PreferenciasNotifications";
import { PreferenciasFinance } from "./PreferenciasFinance";
import { PreferenciasDangerZone } from "./PreferenciasDangerZone";

export type AppearanceMode = "dark" | "light" | "system";

export interface NotificationPreferences {
  transactionCreated: boolean;
  transactionUpdated: boolean;
  transactionDeleted: boolean;
  financialSummary: boolean;
  whatsappUpdates: boolean;
}

export interface FinancePreferences {
  defaultPaymentMethod: string;
  defaultIncomeCategory: string;
  defaultExpenseCategory: string;
  currency: "BRL";
}

export function Preferencias() {
  const [appearance, setAppearance] = useState<AppearanceMode>("dark");

  const [notifications, setNotifications] = useState<NotificationPreferences>({
    transactionCreated: true,
    transactionUpdated: true,
    transactionDeleted: true,
    financialSummary: true,
    whatsappUpdates: true,
  });

  const [finance, setFinance] = useState<FinancePreferences>({
    defaultPaymentMethod: "pix",
    defaultIncomeCategory: "Vendas / Produtos",
    defaultExpenseCategory: "Outras Despesas",
    currency: "BRL",
  });

  function updateNotification(
    key: keyof NotificationPreferences,
    value: boolean,
  ) {
    setNotifications((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateFinance(key: keyof FinancePreferences, value: string) {
    setFinance((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleDeleteAccount() {
    // Futuramente:
    // chamar backend / Supabase para exclusão da conta.
    console.log("Excluir conta");
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-6 pb-10">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
            para sua empresa.
          </p>
        </div>
      </motion.header>

      <div className="grid gap-5 xl:grid-cols-2">
        <PreferenciasAppearance value={appearance} onChange={setAppearance} />

        <PreferenciasNotifications
          values={notifications}
          onChange={updateNotification}
        />

        <PreferenciasFinance values={finance} onChange={updateFinance} />

        <PreferenciasDangerZone onDeleteAccount={handleDeleteAccount} />
      </div>

    </div>
  );
}
