"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { WhatsAppHeader } from "@/components/whatsapp/WhatsAppHeader";

import { useUser } from "@/contexts/UserContext";
import { useWhatsAppConnection } from "@/hooks/whatsapp/useWhatsAppConnection";

const benefits = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Fale naturalmente",
    description:
      "Descreva uma venda ou despesa com suas próprias palavras, como em uma conversa.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Confira os detalhes",
    description:
      "Veja as informações identificadas e revise os dados antes de confirmar.",
  },
  {
    icon: Wallet,
    number: "03",
    title: "Organize suas finanças",
    description:
      "Conheça a proposta de registrar suas movimentações de forma simples e prática.",
  },
];

export default function WhatsAppPage() {
  const { user } = useUser();
  const connection = useWhatsAppConnection();

  const whatsappConnected = connection.connection?.status === "verified";

  return (
    <div className="min-h-screen bg-[#031321] text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={user?.name} companyName={user?.companyName} />

        <main className="relative min-w-0 flex-1 overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-48 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-400/[0.045] blur-[130px]" />
            <div className="absolute -bottom-48 left-[15%] h-[420px] w-[420px] rounded-full bg-cyan-400/[0.025] blur-[120px]" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 pb-10 pt-20 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14 lg:pt-8 xl:px-10">
            <header className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-emerald-300">
                  <MessageCircle size={15} />
                  <span>METRICSFLOW / WHATSAPP</span>
                </div>

                <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Seu financeiro na conversa.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Uma forma mais simples de imaginar o registro de receitas e
                  despesas pelo WhatsApp.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.07] bg-[#061b2b]/80 px-3.5 py-2.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    connection.loading
                      ? "animate-pulse bg-amber-400"
                      : whatsappConnected
                        ? "bg-emerald-400"
                        : "bg-slate-600"
                  }`}
                />
                <span className="text-xs text-slate-400">
                  {connection.loading
                    ? "Verificando conexão"
                    : whatsappConnected
                      ? "WhatsApp Demo conectado"
                      : "Modo demonstrativo"}
                </span>
              </div>
            </header>

            <WhatsAppHeader
              whatsappConnected={whatsappConnected}
              phoneNumber={connection.connection?.phoneNumber}
            />

            <section className="mt-12 sm:mt-14">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-emerald-300">
                    Simples por natureza
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    Menos etapas. Mais clareza.
                  </h2>
                </div>

                <p className="max-w-md text-xs leading-5 text-slate-500 sm:text-right">
                  Conheça o fluxo proposto antes de experimentar a demonstração.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;

                  return (
                    <motion.article
                      key={benefit.number}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                      }}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#061b2b]/75 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-[#082033]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.07] text-emerald-300 transition group-hover:bg-emerald-400/[0.12]">
                          <Icon size={20} />
                        </div>

                        <span className="text-xs font-medium tracking-wider text-slate-700">
                          {benefit.number}
                        </span>
                      </div>

                      <h3 className="mt-5 text-base font-semibold text-white">
                        {benefit.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {benefit.description}
                      </p>
                    </motion.article>
                  );
                })}
              </div>
            </section>

            <section className="relative mt-8 overflow-hidden rounded-[26px] border border-emerald-400/15 bg-[#061b2b]/90 sm:mt-10">
              <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-emerald-400/[0.07] blur-[90px]" />

              <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-9">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                    <Sparkles size={22} />
                  </div>

                  <div className="max-w-xl">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300">
                      Experimente
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                      Veja o fluxo funcionando.
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Envie uma mensagem de exemplo, confira os dados
                      interpretados e explore a experiência demonstrativa.
                    </p>
                  </div>
                </div>

                <Link
                  href="/whatsapp/demo"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#031321] shadow-[0_10px_35px_-15px_rgba(52,211,153,.55)] transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#061b2b]"
                >
                  Abrir demonstração
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] px-6 py-3.5 sm:px-8 lg:px-10">
                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Usa a conta autenticada
                </span>

                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  Confirmação antes do lançamento
                </span>
              </div>
            </section>

            <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.05] pt-5 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span>MetricsFlow AI · Gestão financeira simplificada</span>
              <span>
                Ambiente demonstrativo · Recursos sujeitos à implementação
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
