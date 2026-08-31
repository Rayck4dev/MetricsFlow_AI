"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  FileSpreadsheet,
  Sparkles,
  XCircle,
} from "lucide-react";

import { benefits, withMetrics, withoutMetrics } from "@/types/formei";

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

const benefitAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const comparisonAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function ForMei() {
  return (
    <section
      id="diferenciais"
      className="
        relative
        scroll-mt-20
        overflow-hidden
        border-t border-surface-border/50
        px-6
        py-24
      "
    >
      <BackgroundEffects />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeader />

        <BenefitsGrid />

        <Comparison />

        <BottomMessage />
      </div>
    </section>
  );
}

function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="
          absolute
          left-1/2
          top-20
          h-[400px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-brand-500/[0.035]
          blur-[130px]
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-1/4
          h-[250px]
          w-[400px]
          rounded-full
          bg-emerald-500/[0.025]
          blur-[120px]
        "
      />
    </div>
  );
}

function SectionHeader() {
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
        Feito para quem faz tudo sozinho
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
        Seu negócio não deveria
        <br className="hidden sm:block" />
        <span className="text-brand-400"> depender de planilhas.</span>
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
        O MEI cuida de vendas, clientes, produção e entregas. O financeiro não
        deveria ser mais uma tarefa complicada no fim do dia.
      </p>
    </motion.div>
  );
}

function BenefitsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {benefits.map((benefit, index) => (
        <BenefitCard key={benefit.title} benefit={benefit} index={index} />
      ))}
    </div>
  );
}

interface BenefitCardProps {
  benefit: (typeof benefits)[number];
  index: number;
}

function BenefitCard({ benefit, index }: BenefitCardProps) {
  const Icon = benefit.icon;

  return (
    <motion.article
      custom={index}
      variants={benefitAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-80px",
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-surface-border
        bg-surface-panel/70
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-700
        hover:bg-surface-panel
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-24
          w-24
          rounded-full
          bg-brand-500/[0.04]
          opacity-0
          blur-2xl
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <div
        className={`
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          ${benefit.iconClass}
        `}
      >
        <Icon size={19} aria-hidden="true" />
      </div>

      <h3 className="relative mt-5 font-heading text-base font-bold text-white">
        {benefit.title}
      </h3>

      <p className="relative mt-2 text-xs leading-6 text-slate-400">
        {benefit.description}
      </p>

      <span
        aria-hidden="true"
        className="
          absolute
          bottom-5
          right-6
          text-[10px]
          font-bold
          text-slate-800
        "
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.article>
  );
}

function Comparison() {
  return (
    <motion.div
      variants={comparisonAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-80px",
      }}
      className="
        relative
        mt-16
        overflow-hidden
        rounded-3xl
        border border-surface-border
        bg-surface-panel/70
        shadow-2xl shadow-black/20
      "
    >
      <ComparisonHeader />

      <div className="grid md:grid-cols-2">
        <ComparisonWithout />

        <ComparisonWith />
      </div>

      <ComparisonFooter />
    </motion.div>
  );
}

function ComparisonHeader() {
  return (
    <div className="border-b border-surface-border px-6 py-7 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Na prática
          </span>

          <h3 className="mt-2 font-heading text-xl font-bold text-white md:text-2xl">
            Uma rotina financeira mais simples
          </h3>
        </div>

        <p className="max-w-sm text-xs leading-5 text-slate-500 md:text-right">
          Menos tempo organizando números. Mais tempo cuidando do que realmente
          faz seu negócio crescer.
        </p>
      </div>
    </div>
  );
}

function ComparisonWithout() {
  return (
    <div
      className="
        border-b
        border-surface-border
        p-6
        md:border-b-0
        md:border-r
        md:p-8
      "
    >
      <ComparisonTitle
        icon={XCircle}
        iconClass="border-red-500/15 bg-red-500/[0.07] text-red-400"
        title="Sem MetricsFlow"
        subtitle="O jeito tradicional"
        titleClass="text-red-400"
      />

      <ComparisonList
        items={withoutMetrics}
        icon={XCircle}
        iconClass="text-red-400/70"
        textClass="text-slate-400"
      />
    </div>
  );
}

function ComparisonWith() {
  return (
    <div className="relative overflow-hidden p-6 md:p-8">
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-48
          w-48
          rounded-full
          bg-emerald-500/[0.05]
          blur-[70px]
        "
      />

      <div className="relative z-10">
        <ComparisonTitle
          icon={Sparkles}
          iconClass="border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-400"
          title="Com MetricsFlow AI"
          subtitle="Automatizado e simples"
          titleClass="text-emerald-400"
        />

        <ComparisonList
          items={withMetrics}
          icon={CheckCircle2}
          iconClass="text-emerald-400"
          textClass="text-slate-300"
        />
      </div>
    </div>
  );
}

interface ComparisonTitleProps {
  icon: typeof XCircle;
  iconClass: string;
  title: string;
  subtitle: string;
  titleClass: string;
}

function ComparisonTitle({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  titleClass,
}: ComparisonTitleProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          ${iconClass}
        `}
      >
        <Icon size={17} aria-hidden="true" />
      </div>

      <div>
        <span
          className={`
            text-[9px]
            font-semibold
            uppercase
            tracking-wider
            ${titleClass}
          `}
        >
          {title}
        </span>

        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

interface ComparisonListProps {
  items: readonly string[];
  icon: typeof XCircle;
  iconClass: string;
  textClass: string;
}

function ComparisonList({
  items,
  icon: Icon,
  iconClass,
  textClass,
}: ComparisonListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <Icon
            size={16}
            className={`mt-0.5 shrink-0 ${iconClass}`}
            aria-hidden="true"
          />

          <span className={`text-xs leading-5 ${textClass}`}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function ComparisonFooter() {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        border-t border-surface-border
        bg-surface-sidebar/40
        px-6
        py-5
        sm:flex-row
        sm:items-center
        sm:justify-between
        md:px-8
      "
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
          <DollarSign size={14} aria-hidden="true" />
        </div>

        <span className="text-[11px] text-slate-400">
          Mais clareza para tomar decisões melhores.
        </span>
      </div>

      <Link
        href="/login"
        className="
          group
          inline-flex
          items-center
          gap-1.5
          text-[11px]
          font-semibold
          text-brand-400
          transition-colors
          hover:text-brand-300
        "
      >
        Quero simplificar meu financeiro
        <ArrowRight
          size={13}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

function BottomMessage() {
  return (
    <div className="mt-10 flex justify-center">
      <div className="flex items-center gap-2 text-[10px] text-slate-600">
        <FileSpreadsheet size={13} aria-hidden="true" />

        <span>Menos planilhas. Mais clareza sobre o seu negócio.</span>
      </div>
    </div>
  );
}
