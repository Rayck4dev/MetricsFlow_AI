import {
  MessageSquareText,
  Cpu,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

export const steps = [
  {
    number: "01",
    title: "Envie",
    highlight: "pelo WhatsApp",
    description:
      'Mande uma mensagem ou áudio. Exemplo: "Comprei R$ 120 de matéria-prima hoje".',
    icon: MessageSquareText,
    badge: "Texto ou áudio",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "bg-emerald-500/[0.06]",
  },
  {
    number: "02",
    title: "A MetricsFlow AI",
    highlight: "entende",
    description:
      "A IA interpreta a mensagem e identifica valor, tipo, categoria, data e forma de pagamento.",
    icon: Cpu,
    badge: "Interpretação por IA",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20",
    glow: "bg-brand-500/[0.06]",
  },
  {
    number: "03",
    title: "Você",
    highlight: "confirma",
    description:
      "O lançamento só acontece depois da sua confirmação. Você continua no controle de cada movimentação.",
    icon: ShieldCheck,
    badge: "Você decide",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "bg-violet-500/[0.06]",
  },
  {
    number: "04",
    title: "Tudo fica",
    highlight: "organizado",
    description:
      "A movimentação é registrada e passa a alimentar seu histórico, dashboard e DRE.",
    icon: LayoutDashboard,
    badge: "Financeiro atualizado",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "bg-cyan-500/[0.06]",
  },
];
