"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const BENEFITS = ["Registre pelo WhatsApp", "Texto ou áudio", "Comece grátis"];

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

function CtaBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/[0.06] blur-[130px]" />

      <div className="absolute left-1/2 top-0 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
    </div>
  );
}

function CtaDecorations() {
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

function CtaBadge() {
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

function CtaHeading() {
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

function CtaDescription() {
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
      acompanhe tudo organizado no MetricsFlow.
    </p>
  );
}

function CtaBenefits() {
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

function CtaActions() {
  return (
    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <CreateAccountButton />

      <DemoButton />
    </div>
  );
}

function CreateAccountButton() {
  return (
    <Link
      href="/cadastro"
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-brand-600
        px-7
        py-3.5
        text-sm
        font-semibold
        text-white
        shadow-xl
        shadow-brand-600/20
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-brand-500
        hover:shadow-2xl
        hover:shadow-brand-500/20
        sm:w-auto
      "
    >
      Criar minha conta grátis
      <ArrowRight
        size={17}
        className="
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      />
    </Link>
  );
}

function DemoButton() {
  return (
    <Link
      href="/demo"
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-white/[0.08]
        bg-white/[0.03]
        px-7
        py-3.5
        text-sm
        font-semibold
        text-slate-300
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-white/[0.14]
        hover:bg-white/[0.06]
        hover:text-white
        sm:w-auto
      "
    >
      <MessageCircle
        size={16}
        className="
          text-emerald-400
          transition-transform
          duration-300
          group-hover:scale-110
        "
      />
      Ver demonstração
    </Link>
  );
}
