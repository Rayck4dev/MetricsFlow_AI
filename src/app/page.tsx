"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ForMei } from "@/components/home/ForMei";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Features } from "@/components/home/Features";
import { Footer } from "@/components/layout/footer";
import {
  MessageSquare,
  Bot,
  ArrowRight,
  TrendingUp,
  Zap,
  CheckCircle2,
} from "lucide-react";

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

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-surface-main text-slate-100 selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main>
        <section
          id="inicio"
          className="
            relative
            overflow-hidden
            px-6
            pb-24
            pt-36
            md:pb-32
            md:pt-44
          "
        >

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-500/[0.08] blur-[140px]" />

            <div className="absolute left-1/2 top-[420px] h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/[0.035] blur-[120px]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.22)_100%)]" />
          </div>

          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="relative z-10 mx-auto max-w-6xl text-center"
          >

            <motion.div variants={heroItem}>
              <span
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  border border-brand-500/20
                  bg-brand-500/[0.08]
                  px-4 py-1.5
                  text-[11px] font-semibold
                  text-brand-400
                  shadow-lg shadow-brand-500/[0.05]
                "
              >
                <span className="relative flex">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-800 opacity-80" />
                </span>
                Gestão financeira inteligente para MEIs
              </span>
            </motion.div>


            <motion.h1
              variants={heroItem}
              className="
                mx-auto mt-7
                max-w-4xl
                font-heading
                text-4xl
                font-extrabold
                leading-[1.05]
                tracking-[-0.035em]
                text-white
                sm:text-5xl
                md:text-6xl
                lg:text-[68px]
              "
            >
              Sua gestão financeira
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-white via-white to-brand-400 bg-clip-text text-transparent">
                {" "}
                no ritmo da sua conversa.
              </span>
            </motion.h1>


            <motion.p
              variants={heroItem}
              className="
                mx-auto mt-7
                max-w-2xl
                text-sm
                leading-7
                text-slate-400
                sm:text-base
                md:text-[17px]
              "
            >
              Esqueça planilhas complexas. Envie uma mensagem ou áudio pelo
              WhatsApp sobre suas vendas e despesas. O MetricsFlow AI organiza,
              categoriza e transforma tudo em indicadores para o seu negócio.
            </motion.p>


            <motion.div
              variants={heroItem}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/login"
                className="
                  group
                  flex w-full items-center justify-center gap-2
                  rounded-xl
                  bg-brand-600
                  px-7 py-3.5
                  text-sm font-semibold text-white
                  shadow-xl shadow-brand-600/20
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-brand-500
                  hover:shadow-2xl
                  hover:shadow-brand-500/20
                  sm:w-auto
                "
              >
                Criar Conta Grátis
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/demo"
                className="
                  group
                  flex w-full items-center justify-center gap-2
                  rounded-xl
                  border border-surface-border
                  bg-surface-panel/80
                  px-7 py-3.5
                  text-sm font-semibold text-slate-300
                  backdrop-blur-sm
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-slate-600
                  hover:bg-surface-sidebar
                  hover:text-white
                  sm:w-auto
                "
              >
                Ver como funciona
                <span className="text-slate-500 transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </motion.div>


            <motion.div
              variants={heroItem}
              className="
                mt-5
                flex flex-wrap
                items-center justify-center
                gap-x-5 gap-y-2
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
                Sem planilhas
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-brand-500" />
                Via WhatsApp
              </span>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 45,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative mx-auto mt-16
                max-w-5xl
              "
            >
              <div className="pointer-events-none absolute -inset-10 rounded-[40px] bg-brand-500/[0.05] blur-3xl" />

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border border-white/[0.08]
                  bg-surface-panel/90
                  p-2
                  shadow-2xl shadow-black/40
                  backdrop-blur-xl
                "
              >

                <div
                  className="
                    flex h-9 items-center
                    border-b border-white/[0.06]
                    px-3
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  </div>

                  <div className="mx-auto hidden rounded-md border border-white/[0.05] bg-white/[0.025] px-16 py-1 text-[8px] text-slate-600 sm:block">
                    app.metricsflow.ai/dashboard
                  </div>
                </div>


                <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_1.15fr] md:p-5">

                  <div
                    className="
                      rounded-xl
                      border border-surface-border
                      bg-surface-sidebar
                      p-4
                      text-left
                    "
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                          <MessageSquare size={14} />
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold text-white">
                            WhatsApp
                          </p>
                          <p className="text-[8px] text-slate-500">
                            Conversa com o MetricsFlow
                          </p>
                        </div>
                      </div>

                      <span className="flex items-center gap-1 text-[8px] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Online
                      </span>
                    </div>


                    <div className="ml-auto max-w-[88%] rounded-xl rounded-br-sm border border-emerald-500/10 bg-emerald-900/25 p-3">
                      <p className="text-[10px] leading-relaxed text-emerald-100">
                        Vendi R$ 250,00 em produtos no Pix agora!
                      </p>

                      <span className="mt-1 block text-right text-[7px] text-emerald-500/60">
                        14:32
                      </span>
                    </div>


                    <div className="mt-3 flex max-w-[92%] gap-2 rounded-xl rounded-bl-sm border border-surface-border bg-surface-panel p-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                        <Bot size={13} />
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold text-white">
                          MetricsFlow AI
                        </p>

                        <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
                          Receita registrada! R$ 250,00 em{" "}
                          <span className="text-brand-400">Vendas</span>. Seu
                          DRE foi atualizado.
                        </p>
                      </div>
                    </div>
                  </div>


                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-xl
                      border border-surface-border
                      bg-surface-sidebar
                      p-4
                      text-left
                    "
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-slate-500">
                          Visão geral
                        </p>

                        <h3 className="mt-1 text-sm font-bold text-white">
                          Seu financeiro
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-lg border border-brand-500/10 bg-brand-500/[0.06] px-2 py-1">
                        <TrendingUp size={11} className="text-brand-400" />

                        <span className="text-[8px] font-semibold text-brand-400">
                          +18,4%
                        </span>
                      </div>
                    </div>


                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg border border-surface-border bg-surface-panel p-2.5">
                        <p className="text-[7px] text-slate-500">Receita</p>

                        <p className="mt-1 text-[11px] font-bold text-white">
                          R$ 12.450
                        </p>
                      </div>

                      <div className="rounded-lg border border-surface-border bg-surface-panel p-2.5">
                        <p className="text-[7px] text-slate-500">Despesas</p>

                        <p className="mt-1 text-[11px] font-bold text-rose-400">
                          R$ 3.350
                        </p>
                      </div>

                      <div className="rounded-lg border border-surface-border bg-surface-panel p-2.5">
                        <p className="text-[7px] text-slate-500">Lucro</p>

                        <p className="mt-1 text-[11px] font-bold text-emerald-400">
                          R$ 9.100
                        </p>
                      </div>
                    </div>


                    <div className="mt-3 rounded-lg border border-surface-border bg-surface-panel p-3">
                      <div className="flex h-24 items-end gap-2">
                        {[35, 48, 42, 65, 52, 78, 68, 90].map(
                          (height, index) => (
                            <motion.div
                              key={index}
                              initial={{
                                height: 0,
                              }}
                              animate={{
                                height: `${height}%`,
                              }}
                              transition={{
                                duration: 0.6,
                                delay: 0.65 + index * 0.05,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className={`
                                flex-1 rounded-t-sm
                                ${
                                  index === 7
                                    ? "bg-brand-500 shadow-lg shadow-brand-500/20"
                                    : "bg-slate-800"
                                }
                              `}
                            />
                          ),
                        )}
                      </div>

                      <div className="mt-2 flex justify-between text-[7px] text-slate-600">
                        <span>Jan</span>
                        <span>Fev</span>
                        <span>Mar</span>
                        <span>Abr</span>
                        <span>Mai</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Ago</span>
                      </div>
                    </div>


                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: 1,
                      }}
                      className="
                        absolute bottom-5 right-5
                        flex items-center gap-1.5
                        rounded-lg
                        border border-emerald-500/20
                        bg-emerald-500/10
                        px-2.5 py-1.5
                        shadow-lg shadow-black/20
                      "
                    >
                      <Zap size={10} className="text-emerald-400" />

                      <span className="text-[8px] font-semibold text-emerald-400">
                        Atualizado automaticamente
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>


              <p className="mt-4 text-center text-[10px] text-slate-600">
                Tudo o que você precisa para entender seu negócio em um só
                lugar.
              </p>
            </motion.div>
          </motion.div>
        </section>

        <HowItWorks />

        <ForMei />

        <Features />

        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
