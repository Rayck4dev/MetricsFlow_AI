import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  XCircle,
} from "lucide-react";

export const benefits = [
  {
    icon: Clock3,
    title: "Economize tempo",
    description:
      "Registre uma venda ou despesa em segundos. Você fala, a IA organiza e o lançamento fica pronto.",
    iconClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    icon: MessageSquare,
    title: "Use o WhatsApp",
    description:
      "Nada de aprender sistemas complexos. Registre suas movimentações pelo canal que você já usa todos os dias.",
    iconClass: "bg-brand-500/10 text-brand-400 border-brand-500/20",
  },
  {
    icon: BarChart3,
    title: "Entenda seu lucro",
    description:
      "Visualize receitas, despesas e resultados em um dashboard simples, feito para decisões rápidas.",
    iconClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
] as const;

export const withoutMetrics = [
  "Anotações espalhadas em papel, celular ou bloco de notas",
  "Planilhas que precisam ser atualizadas manualmente",
  "Dificuldade para saber quanto realmente entrou e saiu",
] as const;

export const withMetrics = [
  "Registro imediato por texto ou áudio no WhatsApp",
  "Movimentações organizadas e categorizadas automaticamente",
  "Dashboard com uma visão clara do seu resultado financeiro",
] as const;