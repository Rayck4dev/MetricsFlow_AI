"use client";

import { motion, type Variants } from "framer-motion";
import { HeroActions } from "./HeroActions";
import { CheckCircle2, Sparkles } from "lucide-react";
import { WhatsAppFlowDemo } from "@/components/home/WhatsAppFlowDemo";

const heroContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const heroItem: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function HeroSection() {
  return (
<section
          id="inicio"
          className="
            relative
            overflow-hidden
            px-6
            pb-28
            pt-36
            md:pb-36
            md:pt-44
          "
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-brand-500/[0.08] blur-[150px]" />

            <div className="absolute left-[18%] top-[500px] h-[300px] w-[420px] rounded-full bg-emerald-500/[0.025] blur-[120px]" />

            <div className="absolute right-[8%] top-[520px] h-[300px] w-[360px] rounded-full bg-brand-500/[0.025] blur-[120px]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.25)_100%)]" />
          </div>

          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="relative z-10 mx-auto max-w-7xl"
          >
            <div className="mx-auto max-w-4xl text-center">
              <motion.div variants={heroItem}>
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-brand-500/20
                    bg-brand-500/[0.08]
                    px-4
                    py-1.5
                    text-[11px]
                    font-semibold
                    text-brand-400
                    shadow-lg
                    shadow-brand-500/[0.05]
                  "
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />

                    <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Gestão financeira para MEIs
                  <Sparkles size={11} className="text-brand-400" />
                </span>
              </motion.div>

              <motion.h1
                variants={heroItem}
                className="
                  mx-auto
                  mt-7
                  max-w-5xl
                  font-heading
                  text-4xl
                  font-extrabold
                  leading-[1.02]
                  tracking-[-0.045em]
                  text-white
                  sm:text-5xl
                  md:text-6xl
                  lg:text-[72px]
                "
              >
                Você conversa.
                <br />
                <span className="bg-gradient-to-r from-white via-white to-brand-400 bg-clip-text text-transparent">
                  A MetricsFlow organiza.
                </span>
              </motion.h1>

              <motion.p
                variants={heroItem}
                className="
                  mx-auto
                  mt-7
                  max-w-2xl
                  text-sm
                  leading-7
                  text-slate-400
                  sm:text-base
                  md:text-[17px]
                "
              >
                Registre vendas e despesas pelo WhatsApp, em texto ou áudio. O
                MetricsFlow interpreta, organiza e transforma suas conversas em
                gestão financeira para o seu negócio.
              </motion.p>

              <HeroActions variants={heroItem} />

              <motion.div
                variants={heroItem}
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-5
                  gap-y-2
                  text-[10px]
                  text-slate-500
                "
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-brand-500" />
                  Grátis para começar
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-brand-500" />
                  Texto ou áudio
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-brand-500" />
                  Via WhatsApp
                </span>
              </motion.div>
            </div>

            <WhatsAppFlowDemo />
          </motion.div>
        </section>
  );
}
