"use client";

import { motion } from "framer-motion";
import { Building2, CheckCircle2, Sparkles } from "lucide-react";

interface EmpresaHeaderProps {
  companyName?: string;
}

export function EmpresaHeader({
  companyName = "Minha empresa",
}: EmpresaHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-cpm-accent/5 blur-3xl" />

      <div className="relative flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
          <Building2
            size={19}
            className="text-brand-400"
          />
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-400">
              Minha empresa
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-2 py-1 text-[8px] font-semibold text-emerald-400">
              <CheckCircle2 size={9} />
              Ativa
            </span>

            <Sparkles
              size={12}
              className="text-brand-400/50"
            />
          </div>

          <h1 className="truncate font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {companyName}
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
            Gerencie os dados da empresa, membros e o acesso de
            colaboradores.
          </p>
        </div>
      </div>
    </motion.header>
  );
}