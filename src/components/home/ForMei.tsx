"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  XCircle,
  CheckCircle2,
  DollarSign,
  Clock3,
  FileSpreadsheet,
  Sparkles,
  MessageSquare,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: Clock3,
    title: "Economize tempo",
    description:
      "Registre uma venda ou despesa em segundos. Você fala, a IA organiza e o lançamento fica pronto.",
    iconClass:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    icon: MessageSquare,
    title: "Use o WhatsApp",
    description:
      "Nada de aprender sistemas complexos. Registre suas movimentações pelo canal que você já usa todos os dias.",
    iconClass:
      "bg-brand-500/10 text-brand-400 border-brand-500/20",
  },
  {
    icon: BarChart3,
    title: "Entenda seu lucro",
    description:
      "Visualize receitas, despesas e resultados em um dashboard simples, feito para decisões rápidas.",
    iconClass:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
];

const withoutMetrics = [
  "Anotações espalhadas em papel, celular ou bloco de notas",
  "Planilhas que precisam ser atualizadas manualmente",
  "Dificuldade para saber quanto realmente entrou e saiu",
];

const withMetrics = [
  "Registro imediato por texto ou áudio no WhatsApp",
  "Movimentações organizadas e categorizadas automaticamente",
  "Dashboard com uma visão clara do seu resultado financeiro",
];

export function ForMei() {
  return (
    <section
      id="diferenciais"
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
        <div className="absolute left-1/2 top-20 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-500/[0.035] blur-[130px]" />

        <div className="absolute bottom-0 left-1/4 h-[250px] w-[400px] rounded-full bg-emerald-500/[0.025] blur-[120px]" />
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
            <span className="text-brand-400">
              {" "}
              depender de planilhas.
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
            O MEI cuida de vendas, clientes, produção e entregas. O financeiro
            não deveria ser mais uma tarefa complicada no fim do dia.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
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
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
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

                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand-500/[0.04] blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />


                <div
                  className={`
                    relative
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border
                    ${benefit.iconClass}
                  `}
                >
                  <Icon size={19} />
                </div>


                <h3 className="relative mt-5 font-heading text-base font-bold text-white">
                  {benefit.title}
                </h3>

                <p className="relative mt-2 text-xs leading-6 text-slate-400">
                  {benefit.description}
                </p>


                <span className="absolute bottom-5 right-6 text-[10px] font-bold text-slate-800">
                  0{index + 1}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
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
            duration: 0.6,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
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
                Menos tempo organizando números. Mais tempo cuidando do que
                realmente faz seu negócio crescer.
              </p>
            </div>
          </div>


          <div className="grid md:grid-cols-2">

            <div
              className="
                border-b border-surface-border
                p-6
                md:border-b-0
                md:border-r
                md:p-8
              "
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-400">
                  <XCircle size={17} />
                </div>

                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-red-400">
                    Sem MetricsFlow
                  </span>

                  <p className="mt-0.5 text-xs text-slate-500">
                    O jeito tradicional
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {withoutMetrics.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <XCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-red-400/70"
                    />

                    <span className="text-xs leading-5 text-slate-400">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden p-6 md:p-8">

              <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-500/[0.05] blur-[70px]" />

              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-400">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
                      Com MetricsFlow AI
                    </span>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Automatizado e simples
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {withMetrics.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />

                      <span className="text-xs leading-5 text-slate-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="
              flex flex-col
              gap-4
              border-t border-surface-border
              bg-surface-sidebar/40
              px-6 py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              md:px-8
            "
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <DollarSign size={14} />
              </div>

              <span className="text-[11px] text-slate-400">
                Mais clareza para tomar decisões melhores.
              </span>
            </div>

            <Link
              href="/login"
              className="
                group
                inline-flex items-center gap-1.5
                text-[11px] font-semibold
                text-brand-400
                transition-colors
                hover:text-brand-300
              "
            >
              Quero simplificar meu financeiro

              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <FileSpreadsheet size={13} />

            <span>
              Menos planilhas. Mais clareza sobre o seu negócio.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}