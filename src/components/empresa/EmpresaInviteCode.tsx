"use client";

import { useState } from "react";
import { Check, Copy, KeyRound, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface EmpresaInviteCodeProps {
  code: string;
  onCopy?: () => void | Promise<void>;
  onRegenerate?: () => void | Promise<void>;
}

export function EmpresaInviteCode({
  code,
  onCopy,
  onRegenerate,
}: EmpresaInviteCodeProps) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] =
    useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard?.writeText(code);
    } catch {
      // Backend/produção poderá fornecer outro método.
    }

    await onCopy?.();

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  async function handleRegenerate() {
    setRegenerating(true);

    try {
      await onRegenerate?.();
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.14 }}
      className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="border-b border-surface-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
            <KeyRound
              size={16}
              className="text-brand-400"
            />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              Código de convite
            </h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Convide colaboradores para sua empresa.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-xl border border-brand-500/15 bg-brand-500/[0.035] p-4 text-center">
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
            Código da empresa
          </p>

          <motion.p
            key={code}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 font-mono text-2xl font-bold tracking-[0.22em] text-brand-300"
          >
            {code}
          </motion.p>
        </div>

        <p className="text-[9px] leading-4 text-slate-600">
          Envie este código para o colaborador. Ele poderá
          utilizá-lo para entrar na empresa.
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          <motion.button
            type="button"
            onClick={handleCopy}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar text-[9px] font-bold text-slate-400 transition-all hover:border-brand-500/30 hover:bg-brand-500/5 hover:text-brand-300"
          >
            {copied ? (
              <Check size={13} />
            ) : (
              <Copy size={13} />
            )}

            {copied ? "Copiado" : "Copiar código"}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-sidebar text-[9px] font-bold text-slate-400 transition-all hover:border-brand-500/30 hover:bg-brand-500/5 hover:text-brand-300 disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={
                regenerating
                  ? "animate-spin"
                  : ""
              }
            />

            {regenerating
              ? "Gerando..."
              : "Novo código"}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}