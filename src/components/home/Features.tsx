"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Bot,
  ShieldCheck,
  PieChart,
  Mic,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Tudo pelo WhatsApp",
    description:
      "Registre vendas e despesas usando a interface que você já conhece. Sem aprender um sistema novo.",
    tag: "Praticidade",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20",
  },
  {
    icon: Mic,
    title: "Áudio vira lançamento",
    description:
      "Está correndo? Mande um áudio. A IA transcreve a mensagem, identifica os valores e organiza o lançamento.",
    tag: "Áudio → DRE",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: PieChart,
    title: "DRE automatizado",
    description:
      "Receitas, custos e despesas são categorizados para você acompanhar o resultado do negócio sem planilhas.",
    tag: "Financeiro",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Bot,
    title: "IA que entende seu negócio",
    description:
      "O agente reconhece termos comuns do dia a dia financeiro brasileiro, como Pix, maquininha, boleto e DAS.",
    tag: "IA nativa",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Zap,
    title: "Indicadores em tempo real",
    description:
      "Acompanhe faturamento, margem, resultado acumulado e outros indicadores importantes para suas decisões.",
    tag: "Métricas",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados protegidos",
    description:
      "Informações financeiras armazenadas com infraestrutura moderna e controle de acesso para manter seus dados seguros.",
    tag: "Privacidade",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
];

export function Features() {
  return (
    <section
      id="recursos"
      className="
        relative
        overflow-hidden
        border-t border-surface-border/50
        px-6
        py-24
        scroll-mt-20
      "
    >

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-20 h-[350px] w-[500px] rounded-full bg-brand-500/[0.025] blur-[120px]" />

        <div className="absolute bottom-0 left-1/4 h-[300px] w-[450px] rounded-full bg-purple-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">

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
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span
            className="
              inline-flex items-center gap-2
              text-[10px] font-semibold
              uppercase tracking-[0.18em]
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
            <span className="text-brand-400">
              {" "}
              Simplicidade para você.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-5
              max-w-2xl
              text-sm
              leading-6
              text-slate-400
              md:text-[15px]
            "
          >
            O MetricsFlow combina WhatsApp, inteligência artificial e
            indicadores financeiros para transformar tarefas complicadas em
            poucos segundos.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
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
                  margin: "-80px",
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
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
                  className={`
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-32
                    w-32
                    rounded-full
                    ${feature.bg}
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  `}
                />


                <span
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
                  0{index + 1}
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
                    ${feature.bg}
                    ${feature.border}
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  `}
                >
                  <Icon
                    size={20}
                    className={feature.color}
                  />
                </div>


                <div className="relative mt-5">
                  <span
                    className={`
                      inline-flex
                      rounded-md
                      border
                      ${feature.border}
                      ${feature.bg}
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
              </motion.div>
            );
          })}
        </div>



        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
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
              />
            </div>

            <span className="text-[11px] text-slate-400">
              Tudo integrado em uma única experiência.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <MessageSquareIcon />
              WhatsApp
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-700" />

            <span className="flex items-center gap-1.5">
              <BotIcon />
              IA
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-700" />

            <span className="flex items-center gap-1.5">
              <ChartIcon />
              Dashboard
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   MINI ICONS
========================================================= */

function MessageSquareIcon() {
  return (
    <MessageSquare
      size={11}
      className="text-emerald-400"
    />
  );
}

function BotIcon() {
  return (
    <Bot
      size={11}
      className="text-brand-400"
    />
  );
}

function ChartIcon() {
  return (
    <PieChart
      size={11}
      className="text-purple-400"
    />
  );
}