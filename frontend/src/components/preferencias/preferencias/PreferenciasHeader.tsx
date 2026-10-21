"use client";

import { motion } from "framer-motion";

interface PreferenciasHeaderProps {
  loading: boolean;
  saving: boolean;
  error: string;
  successMessage: string;
}

export function PreferenciasHeader({
  loading,
  saving,
  error,
  successMessage,
}: PreferenciasHeaderProps) {
  return (
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
  );
}
