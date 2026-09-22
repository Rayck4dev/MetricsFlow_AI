"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MoveUpRight, ShieldCheck } from "lucide-react";

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
    <section className="relative shrink-0 overflow-hidden py-4 sm:py-6 lg:h-[360px] lg:overflow-visible lg:py-0">
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        <div
          className="
            absolute
            right-[-110px]
            top-[-120px]
            h-[470px]
            w-[470px]
            rounded-full
            bg-cyan-400/[0.035]
            blur-[115px]
          "
        />

        <div
          className="
            absolute
            right-[10%]
            top-[35px]
            h-[360px]
            w-[360px]
            rounded-full
            bg-emerald-400/[0.055]
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            right-[17%]
            top-[110px]
            h-[250px]
            w-[250px]
            rounded-full
            bg-emerald-300/[0.045]
            blur-[85px]
          "
        />

        <motion.div
          animate={{
            x: [0, 28, 0],
            opacity: [0.035, 0.09, 0.035],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-[-160px]
            top-[220px]
            h-px
            w-[850px]
            rotate-[-8deg]
            bg-gradient-to-r
            from-transparent
            via-emerald-400/25
            to-transparent
          "
        />

        <motion.div
          animate={{
            x: [0, -20, 0],
            opacity: [0.02, 0.07, 0.02],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-[-190px]
            top-[275px]
            h-px
            w-[900px]
            rotate-[-6deg]
            bg-gradient-to-r
            from-transparent
            via-cyan-400/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            right-[-170px]
            top-[205px]
            h-[210px]
            w-[760px]
            rotate-[-9deg]
            rounded-[50%]
            border
            border-emerald-400/[0.035]
          "
        />

        <div
          className="
            absolute
            right-[-220px]
            top-[230px]
            h-[280px]
            w-[920px]
            rotate-[-7deg]
            rounded-[50%]
            border
            border-cyan-400/[0.018]
          "
        />
      </div>

      <div className="relative mx-auto grid h-full w-full max-w-[1500px] items-center lg:grid-cols-[minmax(0,1fr)_430px]">
        <div className="relative z-20 max-w-[720px] lg:mb-20 lg:mt-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,.8)]" />
            WhatsApp + IA
          </div>

          <h1 className="max-w-[700px] font-heading text-[32px] font-bold leading-tight text-white sm:text-[42px] lg:text-[51px] lg:leading-[0.97]">
            Seu assistente financeiro
            <span className="block bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              no WhatsApp
            </span>
          </h1>

          <p className="mt-4 max-w-[640px] text-xs leading-6 text-slate-400 sm:text-sm">
            Converse naturalmente sobre suas movimentações. O MetricsFlow
            interpreta, valida e pede sua confirmação antes de registrar.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <StatusBadge label="IA online" />

            <StatusBadge label="Supabase" />

            <StatusBadge
              label={
                whatsappConnected
                  ? phoneNumber || "WhatsApp conectado"
                  : "WhatsApp não conectado"
              }
              muted={!whatsappConnected}
            />
          </div>

          <div className="mt-5 flex items-center gap-2 text-[9px] text-slate-600">
            <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />

            <span>Confirmação antes do lançamento financeiro</span>

            <MoveUpRight size={11} className="text-slate-700" />
          </div>
        </div>

        <div className="relative z-0 hidden h-full lg:block">
          <WhatsAppPhoneMockup className="absolute right-[35px] top-[10px]" />

          <motion.div
            initial={{
              opacity: 0,
              x: 15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.45,
            }}
            className="absolute right-[0px] top-[44%] z-30 hidden xl:block"
          >
            <div className="relative rounded-2xl border border-emerald-400/10 bg-[#082033]/90 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-md">
              <p className="text-[11px] font-semibold leading-5 text-white">
                Simples,
                <br />
                <span className="text-emerald-300">rápido e seguro!</span>
              </p>

              <span className="absolute -left-8 top-1/2 h-px w-8 -translate-y-1/2 rotate-[18deg] bg-emerald-400/25" />
            </div>
          </motion.div>

          <div className="pointer-events-none absolute bottom-12 right-24 z-20 hidden items-center gap-1.5 text-[8px] font-medium text-slate-600 xl:flex">
            <ShieldCheck size={11} className="text-emerald-400" />
            Dados protegidos
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusBadge({
  label,
  muted = false,
}: {
  label: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex max-w-[250px] items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-medium ${
        muted
          ? "border-slate-700/70 bg-slate-900/25 text-slate-600"
          : "border-white/[0.06] bg-[#081d2e]/80 text-slate-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          muted
            ? "bg-slate-700"
            : "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,.65)]"
        }`}
      />

      <span className="truncate">{label}</span>
    </div>
  );
}

