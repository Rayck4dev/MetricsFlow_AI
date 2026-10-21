import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

export const BENEFITS = [
  "Registre pelo WhatsApp",
  "Texto ou áudio",
  "Comece grátis",
];

export function CtaBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/[0.06] blur-[130px]" />

      <div className="absolute left-1/2 top-0 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
    </div>
  );
}

export function CtaDecorations() {
  return (
    <>
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/15 blur-[90px]" />

      <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-emerald-500/[0.07] blur-[90px]" />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          opacity-[0.025]
          [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
          [background-size:40px_40px]
        "
      />
    </>
  );
}

export function CtaBadge() {
  return (
    <motion.span
      initial={{
        opacity: 0,
        y: 8,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.4,
        delay: 0.1,
      }}
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-brand-500/20
        bg-brand-500/10
        px-3.5
        py-1.5
        text-[10px]
        font-semibold
        text-brand-400
      "
    >
      <Sparkles size={13} />
      Seu financeiro começa no WhatsApp
    </motion.span>
  );
}

export function CtaHeading() {
  return (
    <h2
      className="
        mx-auto
        mt-6
        max-w-3xl
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
      Transforme suas conversas
      <br className="hidden sm:block" />
      <span className="bg-gradient-to-r from-white to-brand-400 bg-clip-text text-transparent">
        em gestão financeira.
      </span>
    </h2>
  );
}

export function CtaDescription() {
  return (
    <p
      className="
        mx-auto
        mt-5
        max-w-xl
        text-sm
        leading-6
        text-slate-400
        md:text-[15px]
      "
    >
      Registre suas vendas e despesas pelo WhatsApp, confirme os lançamentos e
      acompanhe tudo organizado na MetricsFlow AI.
    </p>
  );
}

export function CtaBenefits() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {BENEFITS.map((benefit) => (
        <span
          key={benefit}
          className="flex items-center gap-1.5 text-[10px] text-slate-500"
        >
          <CheckCircle2 size={12} className="text-brand-400" />

          {benefit}
        </span>
      ))}
    </div>
  );
}
