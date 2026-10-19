"use client";

import { motion } from "framer-motion";
import { sectionAnimation } from "./ForMeiAnimations";

export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-20 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-500/[0.035] blur-[130px]" />
      <div className="absolute bottom-0 left-1/4 h-[250px] w-[400px] rounded-full bg-emerald-500/[0.025] blur-[120px]" />
    </div>
  );
}

export function SectionHeader() {
  return (
    <motion.div
      variants={sectionAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-100px",
      }}
      className="mx-auto mb-14 max-w-3xl text-center"
    >
      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-400">
        <span className="h-px w-5 bg-brand-500/40" />
        Feito para quem faz tudo sozinho
        <span className="h-px w-5 bg-brand-500/40" />
      </span>

      <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-[-0.025em] text-white sm:text-4xl md:text-5xl">
        Seu negócio não deveria
        <br className="hidden sm:block" />
        <span className="text-brand-400"> depender de planilhas.</span>
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-400 md:text-[15px]">
        O MEI cuida de vendas, clientes, produção e entregas. O financeiro não
        deveria ser mais uma tarefa complicada no fim do dia.
      </p>
    </motion.div>
  );
}
