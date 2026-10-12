"use client";

import { formatPhoneNumber } from "@/types/formatters";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { WhatsAppPhoneMockup } from "./WhatsAppPhoneMockup";

interface WhatsAppHeaderProps {
  whatsappConnected: boolean;
  phoneNumber?: string | null;
}

export function WhatsAppHeader({
  whatsappConnected,
  phoneNumber,
}: WhatsAppHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#061b2b]/75">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-emerald-400/[0.09] blur-[100px]" />
        <div className="absolute -bottom-40 left-[35%] h-80 w-80 rounded-full bg-cyan-400/[0.05] blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(16,185,129,0.035),transparent_45%)]" />
      </div>

      <div className="grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:min-h-[470px] lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-5 lg:px-12 lg:py-10 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3.5 py-2 text-[11px] font-semibold tracking-wide text-emerald-300">
            <Sparkles size={14} />
            Seu financeiro, sem complicação
          </div>

          <h1 className="mt-6 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-[58px]">
            Organize suas finanças
            <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text pb-1 text-transparent">
              pelo WhatsApp.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Registre receitas e despesas com uma mensagem. A MetricsFlow
            organiza as informações e apresenta os dados para você conferir
            antes de confirmar o lançamento.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <StatusBadge label="Experiência conversacional" />
            <StatusBadge label="Confirmação antes de registrar" />
          </div>

          <div className="mt-7 flex items-start gap-3 border-t border-white/[0.07] pt-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.07] text-emerald-300">
              <ShieldCheck size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Você confere antes de confirmar
              </p>
              <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                Veja os dados identificados e revise as informações antes de
                concluir um lançamento na demonstração.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <span
              className={`h-2 w-2 rounded-full ${
                whatsappConnected ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span>
              {whatsappConnected
                ? `WhatsApp Demonstrativo Conectado${phoneNumber ? ` · ${formatPhoneNumber(phoneNumber)}` : ""}`
                : "Conexão do WhatsApp Demonstrativo ainda não configurada"}
            </span>
          </div>
        </motion.div>

        <div className="relative flex min-h-[340px] items-center justify-center sm:min-h-[390px] lg:min-h-[430px]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.08] blur-[75px]" />

          <WhatsAppPhoneMockup className="relative z-10 scale-[0.92] sm:scale-100" />

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-5 right-0 z-20 hidden items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0a2638]/95 px-3.5 py-3 shadow-xl shadow-black/20 backdrop-blur-md sm:flex lg:-right-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 size={17} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Mais praticidade
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Uma conversa de cada vez
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] bg-black/[0.08] px-6 py-4 sm:px-10 lg:px-12">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MessageCircle size={15} className="text-emerald-300" />
          Veja como seria registrar uma movimentação
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
          Demonstração visual
          <ArrowUpRight size={12} />
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[11px] text-slate-400">
      <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
      {label}
    </span>
  );
}
