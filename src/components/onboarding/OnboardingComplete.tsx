"use client";

import { motion, type Variants } from "framer-motion";
import {
  Sparkles,
  Check,
  ArrowRight,
  Building2,
  Users,
  Loader2,
} from "lucide-react";

interface OnboardingCompleteProps {
  registrationType: "create_company" | "join_company";
  companyName: string;
  onFinish: () => void;
  isSubmitting?: boolean;
}

const CHECKLIST_ITEMS = [
  "Métricas principais configuradas",
  "Perfil financeiro preparado",
  "Categorias financeiras prontas",
];

const checklistVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const checklistItem: Variants = {
  hidden: {
    opacity: 0,
    x: -6,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.22,
      ease: "easeOut",
    },
  },
};

export default function OnboardingComplete({
  registrationType,
  companyName,
  onFinish,
  isSubmitting,
}: OnboardingCompleteProps) {
  const isOwner = registrationType === "create_company";

  const accessLabel = isOwner
    ? "Perfil de proprietário configurado"
    : "Acesso de colaborador configurado";

  const allItems = [...CHECKLIST_ITEMS, accessLabel];

  return (
    <div className="space-y-4 py-1 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 190,
          damping: 15,
          delay: 0.05,
        }}
        className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-[2px] shadow-lg shadow-brand-500/20"
      >
        <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-surface-sidebar">
          {isOwner ? (
            <Building2 size={28} className="text-emerald-400" />
          ) : (
            <Users size={28} className="text-emerald-400" />
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.15,
          duration: 0.25,
        }}
        className="flex items-center justify-center gap-1.5"
      >
        <Sparkles size={13} className="text-brand-400" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-400">
          Configuração concluída
        </span>

        <Sparkles size={13} className="text-brand-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.25,
        }}
        className="mx-auto max-w-lg"
      >
        <h2 className="font-heading text-xl font-extrabold text-white md:text-2xl">
          Seu MetricsFlow está pronto.
        </h2>

        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
          {isOwner
            ? "Seu ambiente financeiro foi configurado. Agora você já pode começar a acompanhar seu negócio."
            : "Seu acesso ao ambiente financeiro foi configurado. Agora você já pode começar a acompanhar seu negócio."}
        </p>
      </motion.div>

      {companyName && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.25,
            duration: 0.25,
          }}
          className="mx-auto flex max-w-lg items-center gap-3 rounded-xl border border-brand-500/20 bg-brand-500/5 px-3.5 py-2.5 text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10">
            {isOwner ? (
              <Building2 size={16} className="text-brand-400" />
            ) : (
              <Users size={16} className="text-brand-400" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              {isOwner ? "Sua empresa" : "Empresa"}
            </p>

            <p className="truncate text-xs font-semibold text-white">
              {companyName}
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={checklistVariants}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-lg grid-cols-1 gap-1.5 rounded-xl border border-surface-border bg-surface-panel/70 p-3 sm:grid-cols-2"
      >
        {allItems.map((checkItem, index) => (
          <motion.div
            key={index}
            variants={checklistItem}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
              <Check size={11} strokeWidth={3} />
            </div>

            <span className="text-[10px] leading-snug text-slate-300">
              {checkItem}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        type="button"
        disabled={isSubmitting}
        onClick={onFinish}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.45,
          duration: 0.25,
        }}
        whileHover={!isSubmitting ? { scale: 1.01 } : {}}
        whileTap={!isSubmitting ? { scale: 0.985 } : {}}
        className="
          group mx-auto flex w-full max-w-lg
          cursor-pointer items-center justify-center
          gap-2 rounded-xl bg-brand-600
          py-3 text-xs font-semibold text-white
          shadow-lg shadow-brand-500/20
          transition-colors
          hover:bg-brand-500
          disabled:cursor-not-allowed
          disabled:opacity-50
          md:text-sm
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 size={15} className="animate-spin" />

            {isOwner ? "Criando sua empresa..." : "Entrando na empresa..."}
          </>
        ) : (
          <>
            <span>Ir para o Dashboard</span>

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </motion.button>
    </div>
  );
}
