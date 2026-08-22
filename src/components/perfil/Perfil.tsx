"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, UserRound } from "lucide-react";
import { FaChrome } from "react-icons/fa";

import { PerfilForm } from "./PerfilForm";
import { PerfilSecurity } from "./PerfilSecurity";

export interface PerfilUser {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  avatarUrl?: string | null;
  authProvider?: string;
}

export interface PerfilProps {
  user?: PerfilUser;
  initialValues?: PerfilUser;
  userName?: string;
  companyName?: string;

  onUpdateProfile?: (values: PerfilUser) => void | Promise<void>;
  onSubmit?: (values: PerfilUser) => void | Promise<void>;
  onChangePassword?: (password?: string) => void | Promise<void>;
  onManageSessions?: () => void;
}

export function Perfil({
  user,
  initialValues,
  userName,
  companyName,
  onUpdateProfile,
  onSubmit,
  onChangePassword,
  onManageSessions,
}: PerfilProps) {
  const profileData = user ||
    initialValues || {
      name: userName || "",
      email: "",
      phone: "",
    };

  const handleSave = onUpdateProfile || onSubmit;

  return (
    <div className="space-y-6">
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
        <div className="space-y-5">
          <PerfilForm initialValues={profileData} onSubmit={handleSave} />
          <AccountInfo />
        </div>

        <div className="space-y-5">
          <PerfilSecurity
            authProvider="google"
            onChangePassword={onChangePassword}
            onManageSessions={onManageSessions}
          />
        </div>
      </div>
    </div>
  );
}

function AccountInfo() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.18 }}
      className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="border-b border-surface-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
            <UserRound size={16} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Sobre sua conta</h2>
            <p className="mt-0.5 text-[9px] text-slate-600">
              Informações gerais da sua conta.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
        <AccountItem
          icon={<CheckCircle2 size={13} />}
          label="Status"
          value="Conta ativa"
          positive
        />

        <AccountItem
          icon={<FaChrome size={13} />}
          label="Autenticação"
          value="Google"
        />

        <AccountItem
          icon={<CalendarDays size={13} />}
          label="Conta criada"
          value="Em breve"
        />

        <AccountItem
          icon={<UserRound size={13} />}
          label="Tipo de conta"
          value="MEI"
        />
      </div>

      <div className="border-t border-surface-border bg-brand-500/[0.02] px-5 py-3.5 sm:px-6">
        <p className="text-[8px] leading-4 text-slate-600">
          Algumas informações serão preenchidas automaticamente quando a
          autenticação e o backend estiverem conectados.
        </p>
      </div>
    </motion.section>
  );
}

function AccountItem({
  icon,
  label,
  value,
  positive = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-sidebar/60 p-3.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          positive
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-brand-500/10 text-brand-400"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-slate-600">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-[10px] font-semibold ${
            positive ? "text-emerald-400" : "text-slate-300"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
