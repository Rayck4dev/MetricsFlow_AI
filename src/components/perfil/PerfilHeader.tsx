"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Mail, UserRound } from "lucide-react";

interface PerfilHeaderProps {
  userName: string;
  email?: string;
  companyName?: string;
  role?: string;
  avatarUrl?: string | null;
}

export function PerfilHeader({
  userName,
  email,
  role = "Colaborador",
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
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-cpm-accent/5 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <motion.div
            whileHover={{
              y: -2,
              scale: 1.03,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-500/20 to-brand-500/5 shadow-lg shadow-brand-500/5"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-brand-500/10 blur-xl" />

                <span className="relative font-heading text-lg font-bold text-brand-300">
                  {initials || "U"}
                </span>
              </>
            )}
          </motion.div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Meu perfil
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                <BadgeCheck size={11} />
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

          {email && (
            <span className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar/70 px-3 py-2.5">
              <Mail size={13} className="shrink-0 text-slate-500" />

              <span className="truncate text-[9px] font-medium text-slate-500">
                {email}
              </span>
            </span>
          )}
        </div>
      </div>
    </motion.header>
  );
}
