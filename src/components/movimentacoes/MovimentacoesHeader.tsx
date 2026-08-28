"use client";

import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import { useUser } from "@/contexts/UserContext";

interface MovimentacoesHeaderProps {
  userName?: string;
  companyName?: string;
  onAddIncome?: () => void;
  onAddExpense?: () => void;
}

export function MovimentacoesHeader({
  userName,
  companyName,
  onAddIncome,
  onAddExpense,
}: MovimentacoesHeaderProps) {
  const { user } = useUser();

  const displayUserName = user?.name || userName || "Usuário";
  const displayCompanyName =
    user?.companyName || companyName || "Empresa";

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-2xl shadow-black/10 sm:p-6"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/[0.08] blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-500/[0.04] blur-3xl" />

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/[0.07] px-3 py-1.5">
            <Sparkles size={11} className="text-brand-400" />

            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-300">
              Controle financeiro
            </span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Movimentações
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
            Olá, {displayUserName}. Gerencie as entradas e saídas da{" "}
            <span className="font-semibold text-slate-400">
              {displayCompanyName}
            </span>{" "}
            em um só lugar.
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex items-center gap-2 border-t border-surface-border pt-4">
        <CalendarDays size={13} className="text-slate-600" />

        <span className="text-[9px] font-medium text-slate-500">
          Período atual
        </span>

        <span className="text-[9px] font-bold text-slate-300">Agosto 2026</span>

        <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] sm:block" />

        <span className="hidden text-[9px] font-medium text-emerald-400 sm:block">
          Dados sincronizados
        </span>
      </div>
    </motion.header>
  );
}
