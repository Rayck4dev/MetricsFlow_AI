"use client";

import { motion } from "framer-motion";
import { WhatsAppConversationPreview } from "./whatsapp-flow-demo/WhatsAppConversationPreview";
import { WhatsAppFinancePreview } from "./whatsapp-flow-demo/WhatsAppFinancePreview";

export function WhatsAppFlowDemo() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 42,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.8,
        delay: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative mx-auto mt-16 w-full max-w-6xl"
    >
      <div className="pointer-events-none absolute -inset-16 rounded-[48px] bg-brand-500/[0.045] blur-3xl" />

      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.08]
          bg-surface-panel/90
          shadow-2xl
          shadow-black/40
          backdrop-blur-xl
        "
      >
        <div className="flex h-11 items-center border-b border-white/[0.06] px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>

          <div className="mx-auto hidden rounded-md border border-white/[0.05] bg-white/[0.025] px-16 py-1 text-[8px] text-slate-600 sm:block">
            app.metricsflow.ai
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <WhatsAppConversationPreview />

          <WhatsAppFinancePreview />
        </div>
      </div>

      <p className="mt-5 text-center text-[10px] text-slate-600">
        Uma conversa simples pode virar uma movimentação organizada no seu
        financeiro.
      </p>
    </motion.div>
  );
}
