"use client";

import { motion, type Variants } from "framer-motion";
import { Bot, CheckCircle2, PieChart, MessageSquare } from "lucide-react";

import { features } from "@/types/features";

const integrations = [
  {
    label: "WhatsApp",
    icon: MessageSquare,
    color: "text-emerald-400",
  },
  {
    label: "IA",
    icon: Bot,
    color: "text-brand-400",
  },
  {
    label: "Dashboard",
    icon: PieChart,
    color: "text-purple-400",
  },
] as const;

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

const cardAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const footerAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.15,
    },
  },
};

export function Features() {
  return (
    <section
      id="recursos"
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
        <FeaturesHeader />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <FeaturesFooter />
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

function FeaturesHeader() {
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
        O MetricsFlow combina WhatsApp, inteligência artificial e indicadores
        financeiros para transformar tarefas complicadas em poucos segundos.
      </p>
    </motion.div>
  );
}

interface FeatureCardProps {
  feature: (typeof features)[number];
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.article
      custom={index}
      variants={cardAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-80px",
      }}
      className="
        group
        relative
        flex
        min-h-[235px]
        flex-col
        overflow-hidden
        rounded-2xl
        border border-surface-border
        bg-surface-panel/70
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
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
          h-32
          w-32
          rounded-full
          ${feature.background}
          opacity-0
          blur-3xl
          transition-opacity
          duration-500
          group-hover:opacity-100
        `}
      />

      <span
        aria-hidden="true"
        className="
          absolute
          right-6
          top-6
          text-[10px]
          font-bold
          tracking-wider
          text-slate-700
        "
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className={`
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          ${feature.background}
          ${feature.border}
          transition-transform
          duration-300
          group-hover:scale-105
        `}
      >
        <Icon size={20} className={feature.color} aria-hidden="true" />
      </div>

      <div className="relative mt-5">
        <span
          className={`
            inline-flex
            rounded-md
            border
            ${feature.border}
            ${feature.background}
            px-2
            py-1
            text-[9px]
            font-semibold
            ${feature.color}
          `}
        >
          {feature.tag}
        </span>
      </div>

      <h3
        className="
          relative
          mt-3
          font-heading
          text-base
          font-bold
          text-white
          transition-colors
          duration-300
          group-hover:text-brand-300
        "
      >
        {feature.title}
      </h3>

      <p
        className="
          relative
          mt-2
          text-xs
          leading-5
          text-slate-400
        "
      >
        {feature.description}
      </p>

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-6
          right-6
          h-px
          origin-left
          scale-x-0
          bg-gradient-to-r
          from-brand-500/50
          to-transparent
          transition-transform
          duration-500
          group-hover:scale-x-100
        "
      />
    </motion.article>
  );
}

function FeaturesFooter() {
  return (
    <motion.div
      variants={footerAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
      }}
      className="
        mt-10
        flex
        flex-col
        items-center
        justify-between
        gap-4
        rounded-2xl
        border border-surface-border
        bg-surface-sidebar/50
        px-5
        py-4
        sm:flex-row
      "
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10">
          <CheckCircle2
            size={14}
            className="text-brand-400"
            aria-hidden="true"
          />
        </div>

        <span className="text-[11px] text-slate-400">
          Tudo integrado em uma única experiência.
        </span>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-slate-600">
        {integrations.map((integration, index) => {
          const Icon = integration.icon;

          return (
            <div key={integration.label} className="flex items-center gap-4">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-slate-700"
                />
              )}

              <span className="flex items-center gap-1.5">
                <Icon
                  size={11}
                  className={integration.color}
                  aria-hidden="true"
                />

                {integration.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
