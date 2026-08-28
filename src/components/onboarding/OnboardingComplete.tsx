"use client";

import { motion } from "framer-motion";
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

export default function OnboardingComplete({
  registrationType,
  companyName,
  onFinish,
  isSubmitting,
}: OnboardingCompleteProps) {
  const isOwner = registrationType === "create_company";

  return (
    <div className="space-y-6 py-6 text-center">
      {/* ÍCONE */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-0.5 shadow-xl shadow-brand-500/20"
      >
        <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-surface-sidebar text-emerald-400">
          {isOwner ? <Building2 size={36} /> : <Users size={36} />}
        </div>
      </motion.div>

      {/* TÍTULO */}
      <div className="mx-auto max-w-md space-y-2">
        <h2 className="font-heading text-2xl font-extrabold text-white">
          {isOwner
            ? "Sua empresa está quase pronta!"
            : "Você está quase dentro!"}
        </h2>

        <p className="text-xs leading-relaxed text-slate-400 md:text-sm">
          {isOwner
            ? "Finalizamos suas preferências. Agora vamos preparar o ambiente financeiro da sua empresa."
            : "Finalizamos suas preferências. Agora vamos preparar seu acesso ao ambiente financeiro da empresa."}
        </p>
      </div>

      {/* EMPRESA */}
      {companyName && (
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
            {isOwner ? (
              <Building2 size={18} className="text-brand-400" />
            ) : (
              <Users size={18} className="text-brand-400" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              {isOwner ? "Sua empresa" : "Empresa"}
            </p>

            <p className="truncate text-sm font-semibold text-white">
              {companyName}
            </p>
          </div>
        </div>
      )}

      {/* CHECKLIST */}
      <div className="mx-auto max-w-md space-y-2.5 rounded-2xl border border-surface-border bg-surface-panel/80 p-4 text-left">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="rounded bg-emerald-500/10 p-1 text-emerald-400">
            <Check size={14} />
          </div>

          <span>Métricas principais adicionadas ao Dashboard</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="rounded bg-emerald-500/10 p-1 text-emerald-400">
            <Check size={14} />
          </div>

          <span>Perfil financeiro configurado</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="rounded bg-emerald-500/10 p-1 text-emerald-400">
            <Check size={14} />
          </div>

          <span>Categorias financeiras preparadas</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="rounded bg-emerald-500/10 p-1 text-emerald-400">
            <Check size={14} />
          </div>

          <span>
            {isOwner
              ? "Perfil de proprietário configurado"
              : "Acesso de colaborador configurado"}
          </span>
        </div>
      </div>

      {/* BOTÃO */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={onFinish}
        className="
          group mx-auto flex w-full max-w-md
          cursor-pointer items-center justify-center
          gap-2 rounded-xl bg-brand-600
          py-3.5 text-xs font-semibold text-white
          shadow-lg shadow-brand-500/30
          transition-all
          hover:bg-brand-500
          disabled:cursor-not-allowed
          disabled:opacity-50
          md:text-sm
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {isOwner
              ? "Criando sua empresa..."
              : "Entrando na empresa..."}
          </>
        ) : (
          <>
            <span>
              {isOwner
                ? "Acessar meu MetricsFlow"
                : "Entrar no MetricsFlow"}
            </span>

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>
    </div>
  );
}