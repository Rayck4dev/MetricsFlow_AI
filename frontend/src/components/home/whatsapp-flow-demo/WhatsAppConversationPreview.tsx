"use client";

import { motion, type Variants } from "framer-motion";
import { Bot, Check, MessageCircle, Receipt, Smartphone } from "lucide-react";

const messageItem: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function WhatsAppConversationPreview() {
  return (
    <div className="relative overflow-hidden border-b border-white/[0.06] bg-[#071d2c] p-5 lg:border-b-0 lg:border-r lg:p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-500/[0.08] blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <MessageCircle size={16} />
            </div>

            <div>
              <p className="text-[11px] font-bold text-white">WhatsApp</p>

              <p className="mt-0.5 text-[8px] text-slate-500">
                Financeiro do seu negócio
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-[8px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Online
          </span>
        </div>

        <div className="mt-8 space-y-3">
          <motion.div
            variants={messageItem}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.75 }}
            className="ml-auto max-w-[86%]"
          >
            <div className="rounded-2xl rounded-br-md border border-emerald-500/10 bg-emerald-900/30 px-4 py-3">
              <p className="text-[10px] leading-relaxed text-emerald-50">
                Vendi R$ 250,00 em produtos no Pix agora!
              </p>

              <div className="mt-1.5 flex items-center justify-end gap-1">
                <span className="text-[7px] text-emerald-500/60">14:32</span>

                <Check size={9} className="text-emerald-500" />

                <Check size={9} className="-ml-1.5 text-emerald-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={messageItem}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.95 }}
            className="flex max-w-[92%] gap-2.5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
              <Bot size={14} />
            </div>

            <div className="rounded-2xl rounded-bl-md border border-surface-border bg-surface-panel px-4 py-3">
              <p className="text-[9px] font-bold text-white">MetricsFlow AI</p>

              <p className="mt-1.5 text-[9px] leading-4 text-slate-400">
                Entendi uma{" "}
                <span className="font-semibold text-emerald-400">receita</span>{" "}
                de <span className="font-semibold text-white">R$ 250,00</span>{" "}
                em <span className="text-brand-400">Vendas de produtos</span>.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={messageItem}
            initial="hidden"
            animate="show"
            transition={{ delay: 1.15 }}
            className="ml-8 rounded-2xl border border-brand-500/20 bg-brand-500/[0.05] p-3.5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <Receipt size={14} />
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-brand-400">
                  Confirmação
                </p>

                <p className="mt-1 text-[10px] font-semibold text-white">
                  Posso registrar essa movimentação?
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-[8px] font-bold text-white"
                  >
                    <Check size={10} />
                    Confirmar
                  </button>

                  <button
                    type="button"
                    className="rounded-lg border border-surface-border bg-surface-sidebar px-3 py-2 text-[8px] font-bold text-slate-400"
                  >
                    Corrigir
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 1.5,
          }}
          className="mt-5 flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
        >
          <Smartphone size={12} className="text-slate-600" />

          <p className="text-[8px] text-slate-600">
            Também funciona com mensagens de áudio.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
