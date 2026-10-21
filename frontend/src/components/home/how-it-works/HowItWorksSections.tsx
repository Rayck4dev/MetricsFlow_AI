"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function SectionHeader() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-100px",
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mx-auto max-w-3xl text-center"
    >
      <span
        className="
          inline-flex
          items-center
          gap-2
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-brand-400
        "
      >
        <span className="h-px w-5 bg-brand-500/40" />
        Como funciona
        <span className="h-px w-5 bg-brand-500/40" />
      </span>

      <h2
        className="
          mt-4
          font-heading
          text-3xl
          font-extrabold
          leading-[1.08]
          tracking-[-0.03em]
          text-white
          sm:text-4xl
          md:text-5xl
        "
      >
        Do WhatsApp para o seu
        <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-white to-brand-400 bg-clip-text text-transparent">
          financeiro organizado.
        </span>
      </h2>

      <p
        className="
          mx-auto
          mt-5
          max-w-2xl
          text-sm
          leading-6
          text-slate-400
          md:text-[15px]
        "
      >
        Uma conversa simples passa por interpretação, confirmação e organização
        antes de virar uma movimentação no seu negócio.
      </p>
    </motion.div>
  );
}

export function FlowSummary() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.5,
        delay: 0.25,
      }}
      className="
        mx-auto
        mt-8
        max-w-4xl
        rounded-2xl
        border border-surface-border
        bg-surface-sidebar/50
        px-5
        py-4
      "
    >
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={15} />
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
              Você continua no controle
            </p>

            <p className="mt-0.5 text-[9px] text-slate-500">
              Nada é lançado sem a sua confirmação.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[8px] text-slate-600">
          <span>WhatsApp</span>

          <ArrowRight size={10} />

          <span>IA</span>

          <ArrowRight size={10} />

          <span>Confirmação</span>

          <ArrowRight size={10} />

          <span>Financeiro</span>
        </div>
      </div>
    </motion.div>
  );
}
