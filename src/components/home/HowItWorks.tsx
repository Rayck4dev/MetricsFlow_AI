"use client";

import { motion } from "framer-motion";
import {
  MessageSquareText,
  Cpu,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Envie pelo WhatsApp",
    description:
      'Mande uma mensagem de texto ou áudio rápido no dia a dia. Exemplo: "Comprei R$ 120 de matéria-prima hoje".',
    icon: MessageSquareText,
    badge: "Entrada Flexível",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    number: "02",
    title: "Processamento por IA",
    description:
      "A Inteligência Artificial interpreta a mensagem, extrai o valor, classifica a categoria e define se é receita ou despesa.",
    icon: Cpu,
    badge: "Extração Automática",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20",
  },
  {
    number: "03",
    title: "Dashboard Atualizado",
    description:
      "Os dados vão direto para o banco Supabase e alimentam seus cards de métricas e o DRE da empresa em tempo real.",
    icon: LayoutDashboard,
    badge: "Visão Consolidada",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="py-20 px-6 max-w-6xl mx-auto border-t border-surface-border/50 scroll-mt-20"
    >
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest font-heading">
          Passo a Passo
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white mt-2">
          Como o MetricsFlow AI funciona na prática
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-3 leading-relaxed">
          Sem necessidade de planilhas complexas ou treinamentos. Três passos
          simples para manter o financeiro do seu MEI 100% organizado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-surface-panel border border-surface-border rounded-2xl p-6 relative flex flex-col justify-between hover:border-slate-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`text-2xl font-black font-heading ${step.color}`}
                  >
                    {step.number}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${step.bg} ${step.color} ${step.border}`}
                  >
                    {step.badge}
                  </span>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${step.bg} ${step.color}`}
                >
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-white font-heading mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight size={20} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
