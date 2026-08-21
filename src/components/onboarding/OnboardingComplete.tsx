"use client";

import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight } from "lucide-react";

interface OnboardingCompleteProps {
  onFinish: () => void;
  isSubmitting?: boolean;
}

export default function OnboardingComplete({
  onFinish,
  isSubmitting,
}: OnboardingCompleteProps) {
  return (
    <div className="text-center py-6 space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-0.5 shadow-xl shadow-brand-500/20"
      >
        <div className="w-full h-full bg-surface-sidebar rounded-[22px] flex items-center justify-center text-emerald-400">
          <Sparkles size={36} />
        </div>
      </motion.div>

      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="text-2xl font-extrabold font-heading text-white">
          Perfeito! Já entendemos como você trabalha.
        </h2>
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
          Sua conta foi personalizada com foco no que realmente importa para
          você e seu negócio.
        </p>
      </div>

      <div className="bg-surface-panel/80 border border-surface-border p-4 rounded-2xl max-w-md mx-auto text-left space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
            <Check size={14} />
          </div>
          <span>Métricas principais adicionadas ao Dashboard</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
            <Check size={14} />
          </div>
          <span>Agente WhatsApp configurado para seu perfil</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
            <Check size={14} />
          </div>
          <span>Resumos periódicos ativados</span>
        </div>
      </div>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={onFinish}
        className="w-full max-w-md mx-auto bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3.5 rounded-xl text-xs md:text-sm transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
      >
        <span>Acessar Meu MetricsFlow</span>
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
}
