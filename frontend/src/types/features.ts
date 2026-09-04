import { Bot, Mic, PieChart, ShieldCheck, Smartphone, Zap } from "lucide-react";

export const features = [
  {
    icon: Smartphone,
    title: "Tudo pelo WhatsApp",
    description:
      "Registre vendas e despesas usando a interface que você já conhece. Sem aprender um sistema novo.",
    tag: "Praticidade",
    color: "text-brand-400",
    background: "bg-brand-500/10",
    border: "border-brand-500/20",
  },
  {
    icon: Mic,
    title: "Áudio vira lançamento",
    description:
      "Está correndo? Mande um áudio. A IA transcreve a mensagem, identifica os valores e organiza o lançamento.",
    tag: "Áudio → DRE",
    color: "text-emerald-400",
    background: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: PieChart,
    title: "DRE automatizado",
    description:
      "Receitas, custos e despesas são categorizados para você acompanhar o resultado do negócio sem planilhas.",
    tag: "Financeiro",
    color: "text-purple-400",
    background: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Bot,
    title: "IA que entende seu negócio",
    description:
      "O agente reconhece termos comuns do dia a dia financeiro brasileiro, como Pix, maquininha, boleto e DAS.",
    tag: "IA nativa",
    color: "text-amber-400",
    background: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Zap,
    title: "Indicadores em tempo real",
    description:
      "Acompanhe faturamento, margem, resultado acumulado e outros indicadores importantes para suas decisões.",
    tag: "Métricas",
    color: "text-cyan-400",
    background: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados protegidos",
    description:
      "Informações financeiras armazenadas com infraestrutura moderna e controle de acesso para manter seus dados seguros.",
    tag: "Privacidade",
    color: "text-rose-400",
    background: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
] as const;
