"use client";

import { motion, type Variants } from "framer-motion";

const sectionAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="
          absolute
          right-1/4
          top-20
          h-[350px]
          w-[500px]
          rounded-full
          bg-brand-500/[0.025]
          blur-[120px]
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-1/4
          h-[300px]
          w-[450px]
          rounded-full
          bg-purple-500/[0.02]
          blur-[120px]
        "
      />
    </div>
  );
}

export function FeaturesHeader() {
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
        Recursos & tecnologia
        <span className="h-px w-5 bg-brand-500/40" />
      </span>

      <h2
        className="
          mt-4
          font-heading
          text-3xl
          font-extrabold
          leading-tight
          tracking-[-0.025em]
          text-white
          sm:text-4xl
          md:text-5xl
        "
      >
        Complexidade por trás.
        <br className="hidden sm:block" />
        <span className="text-brand-400"> Simplicidade para você.</span>
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
        A MetricsFlow AI combina WhatsApp, inteligência artificial e indicadores
        financeiros para transformar tarefas complicadas em poucos segundos.
      </p>
    </motion.div>
  );
}
