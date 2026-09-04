"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Plus,
  WalletCards,
} from "lucide-react";

import { useCompanyRole } from "@/hooks/useCompanyRole";

interface DashboardQuickActionsProps {
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  onViewFinance?: () => void;
  onViewDre?: () => void;
}

export function DashboardQuickActions({
  onAddIncome,
  onAddExpense,
  onViewFinance,
  onViewDre,
}: DashboardQuickActionsProps) {
  const { isCollaborator, loading: roleLoading } = useCompanyRole();

  const showDre = !roleLoading && !isCollaborator;

  const actions = [
    {
      title: "Adicionar receita",
      description: "Registrar uma nova entrada",
      icon: ArrowUpRight,
      onClick: onAddIncome,
      color: "text-cpm-income",
      bg: "bg-cpm-income/10",
      border: "hover:border-cpm-income/30",
    },
    {
      title: "Adicionar despesa",
      description: "Registrar uma nova saída",
      icon: ArrowDownRight,
      onClick: onAddExpense,
      color: "text-cpm-expense",
      bg: "bg-cpm-expense/10",
      border: "hover:border-cpm-expense/30",
    },
    {
      title: "Financeiro",
      description: "Ver todas as movimentações",
      icon: WalletCards,
      onClick: onViewFinance,
      color: "text-brand-400",
      bg: "bg-brand-500/10",
      border: "hover:border-brand-500/30",
    },
    ...(showDre
      ? [
          {
            title: "DRE",
            description: "Analisar resultado financeiro",
            icon: FileText,
            onClick: onViewDre,
            color: "text-cpm-accent",
            bg: "bg-cpm-accent/10",
            border: "hover:border-cpm-accent/30",
          },
        ]
      : []),
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10"
    >
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-brand-500/[0.04] blur-3xl" />

      <div className="relative mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">Ações rápidas</h2>

          <p className="mt-0.5 text-[9px] text-slate-600">
            Acesse os recursos mais utilizados
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10">
          <Plus size={15} className="text-brand-400" />
        </div>
      </div>

      <div className={`relative grid grid-cols-1 gap-3 sm:grid-cols-2 ${showDre ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.title}
              type="button"
              onClick={action.onClick}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.45 + index * 0.05,
              }}
              whileHover={{
                y: -3,
                scale: 1.01,
              }}
              whileTap={{ scale: 0.98 }}
              className={`group flex items-center gap-3 rounded-xl border border-surface-border bg-surface-sidebar/60 p-3.5 text-left transition-all duration-300 ${action.border}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${action.bg}`}
              >
                <Icon size={16} className={action.color} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold text-slate-300 transition-colors group-hover:text-white">
                  {action.title}
                </p>

                <p className="mt-0.5 truncate text-[8px] text-slate-600">
                  {action.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
