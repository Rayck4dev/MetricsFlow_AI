"use client";

import { motion } from "framer-motion";
import {
  CtaBackground,
  CtaDecorations,
  CtaBadge,
  CtaHeading,
  CtaDescription,
  CtaBenefits,
} from "./cta-banner/CtaBannerSections";
import { CtaActions } from "./cta-banner/CtaBannerActions";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <CtaBackground />

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
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
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative mx-auto
          max-w-5xl
          overflow-hidden
          rounded-[32px]
          border border-brand-500/20
          bg-gradient-to-br
          from-brand-950/80
          via-surface-panel
          to-surface-sidebar
          px-6 py-12
          shadow-2xl shadow-black/30
          md:px-12 md:py-16
        "
      >
        <CtaDecorations />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <CtaBadge />

          <CtaHeading />

          <CtaDescription />

          <CtaBenefits />

          <CtaActions />

          <p className="mt-5 text-[9px] text-slate-600">
            Sem compromisso • Configure sua conta em poucos passos
          </p>
        </div>
      </motion.div>
    </section>
  );
}
