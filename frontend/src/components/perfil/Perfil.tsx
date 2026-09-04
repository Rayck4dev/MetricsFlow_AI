"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Mail, UserRound } from "lucide-react";
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
  authProvider?: "google" | "email";
  createdAt?: string;
}

export interface PerfilProps {
  user?: PerfilUser;
  initialValues?: PerfilUser;

  userName?: string;
  companyName?: string;

  onUpdateProfile?: (values: {
    name: string;
    email: string;
    phone: string;
  }) => void | Promise<void>;

  onSubmit?: (values: {
    name: string;
    email: string;
    phone: string;
  }) => void | Promise<void>;

  onChangePassword?: (password: string) => void | Promise<void>;

  onManageSessions?: () => void | Promise<void>;
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
  const profileData = user ??
    initialValues ?? {
      name: userName ?? "",
      email: "",
      phone: "",
    };

  const handleSave = onUpdateProfile ?? onSubmit;

  const authProvider =
    user?.authProvider ?? initialValues?.authProvider ?? "email";

  return (
    <div className="space-y-6">
      <PerfilHeader
        userName={profileData.name}
        email={profileData.email}
        companyName={companyName ?? "Empresa"}
        role={user?.role}
        avatarUrl={profileData.avatarUrl}
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
        <div className="space-y-5">
          <PerfilForm initialValues={profileData} onSubmit={handleSave} />

          <AccountInfo
            authProvider={authProvider}
            createdAt={user?.createdAt}
          />
        </div>

        <div className="space-y-5">
          <PerfilSecurity
            authProvider={authProvider}
            onChangePassword={onChangePassword}
            onManageSessions={onManageSessions}
          />
        </div>
      </div>
    </div>
  );
}

interface PerfilHeaderProps {
  userName: string;
  email?: string;
  companyName: string;
  role?: string;
  avatarUrl?: string | null;
}

function PerfilHeader({
  userName,
  email,
  role = "Membro",
  avatarUrl,
}: PerfilHeaderProps) {
  const initials = userName
    ?.trim()
    ?.split(/\s+/)
    ?.slice(0, 2)
    ?.map((part) => part.charAt(0).toUpperCase())
    ?.join("");

  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-cpm-accent/5 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-500/20 bg-brand-500/10">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="relative font-heading text-lg font-bold text-brand-300">
                {initials || "U"}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Meu perfil
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 size={11} />
                Conta ativa
              </span>
            </div>

            <p className="mt-1.5 text-xs text-slate-500">
              Gerencie seus dados pessoais e informações da sua conta.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar/70 px-3 py-2.5">
            <UserRound size={13} className="text-brand-400" />

            <span className="text-[9px] font-semibold text-slate-400">
              {role}
            </span>
          </span>

          <span className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar/70 px-3 py-2.5">
            <Mail size={13} className="shrink-0 text-slate-500" />

            <span className="truncate text-[9px] font-medium text-slate-500">
              {email}
            </span>
          </span>
        </div>
      </div>
    </motion.header>
  );
}

function AccountInfo({
  authProvider,
  createdAt,
}: {
  authProvider: "google" | "email";
  createdAt?: string;
}) {
  const createdLabel = createdAt
    ? new Date(createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Não disponível";

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay: 0.18,
      }}
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
          icon={
            authProvider === "google" ? (
              <FaChrome size={13} />
            ) : (
              <Mail size={13} />
            )
          }
          label="Autenticação"
          value={authProvider === "google" ? "Google" : "E-mail"}
        />

        <AccountItem
          icon={<CalendarDays size={13} />}
          label="Conta criada"
          value={createdLabel}
        />

        <AccountItem
          icon={<UserRound size={13} />}
          label="Tipo de conta"
          value="MEI"
        />
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
