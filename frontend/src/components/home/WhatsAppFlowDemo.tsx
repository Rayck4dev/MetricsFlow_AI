"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  MessageCircle,
  Receipt,
  Smartphone,
  WalletCards,
} from "lucide-react";

const messageItem: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface Transaction {
  description: string;
  value: string;
  type: "income" | "expense";
}

const transactions: Transaction[] = [
  {
    description: "Venda de produtos",
    value: "+R$ 250,00",
    type: "income",
  },
  {
    description: "Combustível",
    value: "-R$ 180,00",
    type: "expense",
  },
  {
    description: "Internet",
    value: "-R$ 90,00",
    type: "expense",
  },
];

export function WhatsAppFlowDemo() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 42,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.8,
        delay: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative mx-auto mt-16 w-full max-w-6xl"
    >
      <div className="pointer-events-none absolute -inset-16 rounded-[48px] bg-brand-500/[0.045] blur-3xl" />

      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.08]
          bg-surface-panel/90
          shadow-2xl
          shadow-black/40
          backdrop-blur-xl
        "
      >
        <div className="flex h-11 items-center border-b border-white/[0.06] px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>

          <div className="mx-auto hidden rounded-md border border-white/[0.05] bg-white/[0.025] px-16 py-1 text-[8px] text-slate-600 sm:block">
            app.metricsflow.ai
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">

          <div className="relative overflow-hidden border-b border-white/[0.06] bg-[#071d2c] p-5 lg:border-b-0 lg:border-r lg:p-7">
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-500/[0.08] blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <MessageCircle size={16} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-white">WhatsApp</p>

                    <p className="mt-0.5 text-[8px] text-slate-500">
                      Financeiro do seu negócio
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-[8px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online
                </span>
              </div>

              <div className="mt-8 space-y-3">
                <motion.div
                  variants={messageItem}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.75 }}
                  className="ml-auto max-w-[86%]"
                >
                  <div className="rounded-2xl rounded-br-md border border-emerald-500/10 bg-emerald-900/30 px-4 py-3">
                    <p className="text-[10px] leading-relaxed text-emerald-50">
                      Vendi R$ 250,00 em produtos no Pix agora!
                    </p>

                    <div className="mt-1.5 flex items-center justify-end gap-1">
                      <span className="text-[7px] text-emerald-500/60">
                        14:32
                      </span>

                      <Check size={9} className="text-emerald-500" />

                      <Check size={9} className="-ml-1.5 text-emerald-500" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={messageItem}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.95 }}
                  className="flex max-w-[92%] gap-2.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <Bot size={14} />
                  </div>

                  <div className="rounded-2xl rounded-bl-md border border-surface-border bg-surface-panel px-4 py-3">
                    <p className="text-[9px] font-bold text-white">
                      MetricsFlow AI
                    </p>

                    <p className="mt-1.5 text-[9px] leading-4 text-slate-400">
                      Entendi uma
                      <span className="font-semibold text-emerald-400">
                        receita
                      </span>
                      de
                      <span className="font-semibold text-white">
                        R$ 250,00
                      </span>
                      em
                      <span className="text-brand-400">Vendas de produtos</span>
                      .
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={messageItem}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 1.15 }}
                  className="ml-8 rounded-2xl border border-brand-500/20 bg-brand-500/[0.05] p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                      <Receipt size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-brand-400">
                        Confirmação
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-white">
                        Posso registrar essa movimentação?
                      </p>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-[8px] font-bold text-white"
                        >
                          <Check size={10} />
                          Confirmar
                        </button>

                        <button
                          type="button"
                          className="rounded-lg border border-surface-border bg-surface-sidebar px-3 py-2 text-[8px] font-bold text-slate-400"
                        >
                          Corrigir
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
                  delay: 1.5,
                }}
                className="mt-5 flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
              >
                <Smartphone size={12} className="text-slate-600" />

                <p className="text-[8px] text-slate-600">
                  Também funciona com mensagens de áudio.
                </p>
              </motion.div>
            </div>
          </div>


          <div className="relative bg-surface-sidebar p-5 lg:p-7">
            <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-brand-500/[0.06] blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <WalletCards size={16} />
                  </div>

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.14em] text-slate-600">
                      Visão geral
                    </p>

                    <h3 className="mt-0.5 text-sm font-bold text-white">
                      Seu financeiro
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.05] px-2.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[8px] font-semibold text-emerald-400">
                    Atualizado
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2.5">
                <Metric
                  label="Receita"
                  value="R$ 12.450"
                  icon={<TrendingUpIcon />}
                  valueClass="text-white"
                />

                <Metric
                  label="Despesas"
                  value="R$ 3.350"
                  icon={<Receipt size={11} />}
                  valueClass="text-rose-400"
                />

                <Metric
                  label="Resultado"
                  value="R$ 9.100"
                  icon={<CheckCircle2 size={11} />}
                  valueClass="text-emerald-400"
                />
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl border border-brand-500/10 bg-brand-500/[0.035] p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <ArrowRight size={14} />
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.12em] text-brand-400">
                    Sincronizado
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-400">
                    A nova movimentação já aparece no seu financeiro.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-surface-border bg-surface-panel p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[7px] uppercase tracking-[0.14em] text-slate-600">
                      Movimentações
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-slate-300">
                      Últimos lançamentos
                    </p>
                  </div>

                  <span className="text-[7px] text-slate-600">Agosto 2026</span>
                </div>

                <div className="mt-4 space-y-2">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.description}
                      initial={{
                        opacity: 0,
                        x: 8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: 1 + index * 0.1,
                      }}
                      className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-sidebar px-3 py-2.5"
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                          transaction.type === "income"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowRight size={12} className="-rotate-45" />
                        ) : (
                          <ArrowRight size={12} className="rotate-45" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[9px] font-semibold text-slate-300">
                          {transaction.description}
                        </p>

                        <p className="mt-0.5 text-[7px] text-slate-600">
                          Registrada pelo WhatsApp
                        </p>
                      </div>

                      <span
                        className={`text-[9px] font-bold ${
                          transaction.type === "income"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {transaction.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[8px] text-slate-600">
                  DRE atualizado automaticamente
                </span>

                <span className="flex items-center gap-1.5 text-[8px] font-medium text-emerald-400">
                  <CheckCircle2 size={10} />
                  Tudo sincronizado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-[10px] text-slate-600">
        Uma conversa simples pode virar uma movimentação organizada no seu
        financeiro.
      </p>
    </motion.div>
  );
}

function Metric({
  label,
  value,
  icon,
  valueClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueClass: string;
}) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-panel p-3">
      <div className="flex items-center justify-between">
        <p className="text-[7px] text-slate-500">{label}</p>

        <span className="text-slate-600">{icon}</span>
      </div>

      <p className={`mt-1.5 text-[11px] font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function TrendingUpIcon() {
  return <ArrowRight size={11} className="-rotate-45" />;
}
