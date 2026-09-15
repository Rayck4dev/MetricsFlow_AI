"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Cpu,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Envie",
    highlight: "pelo WhatsApp",
    description:
      'Mande uma mensagem ou áudio. Exemplo: "Comprei R$ 120 de matéria-prima hoje".',
    icon: MessageSquareText,
    badge: "Texto ou áudio",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "bg-emerald-500/[0.06]",
  },
  {
    number: "02",
    title: "O MetricsFlow",
    highlight: "entende",
    description:
      "A IA interpreta a mensagem e identifica valor, tipo, categoria, data e forma de pagamento.",
    icon: Cpu,
    badge: "Interpretação por IA",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20",
    glow: "bg-brand-500/[0.06]",
  },
  {
    number: "03",
    title: "Você",
    highlight: "confirma",
    description:
      "O lançamento só acontece depois da sua confirmação. Você continua no controle de cada movimentação.",
    icon: ShieldCheck,
    badge: "Você decide",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "bg-violet-500/[0.06]",
  },
  {
    number: "04",
    title: "Tudo fica",
    highlight: "organizado",
    description:
      "A movimentação é registrada e passa a alimentar seu histórico, dashboard e DRE.",
    icon: LayoutDashboard,
    badge: "Financeiro atualizado",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "bg-cyan-500/[0.06]",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="
        relative
        overflow-hidden
        border-t border-surface-border/50
        px-6
        py-24
        scroll-mt-20
      "
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-brand-500/[0.025] blur-[130px]" />

        <div className="absolute bottom-0 left-[10%] h-[260px] w-[300px] rounded-full bg-emerald-500/[0.02] blur-[110px]" />

        <div className="absolute bottom-0 right-[10%] h-[260px] w-[300px] rounded-full bg-violet-500/[0.02] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeader />

        <div className="mt-16 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <FlowSummary />
      </div>
    </section>
  );
}

function SectionHeader() {
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

interface StepCardProps {
  step: (typeof steps)[number];
  index: number;
  isLast: boolean;
}

function StepCard({ step, index, isLast }: StepCardProps) {
  const Icon = step.icon;

  return (
    <div className="relative">
      <motion.article
        initial={{
          opacity: 0,
          y: 28,
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
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          group
          relative
          flex
          min-h-[290px]
          flex-col
          overflow-hidden
          rounded-2xl
          border border-surface-border
          bg-surface-panel/70
          p-5
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-slate-700
          hover:bg-surface-panel
        "
      >
        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-36
            w-36
            rounded-full
            ${step.glow}
            opacity-0
            blur-3xl
            transition-opacity
            duration-500
            group-hover:opacity-100
          `}
        />

        <div className="relative flex items-center justify-between">
          <span
            className={`
              font-heading
              text-2xl
              font-black
              tracking-tight
              ${step.color}
            `}
          >
            {step.number}
          </span>

          <span
            className={`
              rounded-full
              border
              ${step.border}
              ${step.bg}
              px-2.5
              py-1
              text-[8px]
              font-semibold
              ${step.color}
            `}
          >
            {step.badge}
          </span>
        </div>

        <div
          className={`
            relative
            mt-7
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border
            ${step.border}
            ${step.bg}
            ${step.color}
            transition-transform
            duration-300
            group-hover:scale-105
          `}
        >
          <Icon size={21} aria-hidden="true" />
        </div>

        <div className="relative mt-6">
          <h3 className="font-heading text-base font-bold text-white">
            {step.title} <span className={step.color}>{step.highlight}</span>
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {step.description}
          </p>
        </div>

        <div className="relative mt-auto flex items-center gap-2 pt-6">
          <div
            className={`
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              ${step.bg}
              ${step.color}
            `}
          >
            <Check size={11} strokeWidth={3} />
          </div>

          <span className="text-[8px] font-medium text-slate-600">
            Etapa {index + 1} de {steps.length}
          </span>
        </div>
      </motion.article>

      {!isLast && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-4
            top-1/2
            z-20
            hidden
            -translate-y-1/2
            lg:block
          "
        >
          <div className="flex items-center">
            <span className="h-px w-3 bg-surface-border" />

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border bg-surface-main text-slate-600">
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FlowSummary() {
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
