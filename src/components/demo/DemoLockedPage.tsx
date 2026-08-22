"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Lock,
  MessageCircle,
  Settings,
  UserRound,
  WalletCards,
} from "lucide-react";

type DemoLockedIcon =
  | "whatsapp"
  | "movimentacoes"
  | "dre"
  | "perfil"
  | "empresa"
  | "preferencias";

interface DemoLockedPageProps {
  title: string;
  description: string;
  icon?: DemoLockedIcon;
  onRegister?: () => void;
}

const iconMap = {
  whatsapp: MessageCircle,
  movimentacoes: WalletCards,
  dre: BarChart3,
  perfil: UserRound,
  empresa: Building2,
  preferencias: Settings,
};

const previewData = {
  whatsapp: {
    cards: [
      ["Mensagens processadas", "128"],
      ["Transações criadas", "42"],
      ["Pendentes", "06"],
    ],
    rows: [
      ["Venda de produtos", "R$ 350,00", "Processada"],
      ["Pagamento fornecedor", "R$ 120,00", "Processada"],
      ["Serviço realizado", "R$ 480,00", "Processada"],
      ["Combustível", "R$ 45,00", "Pendente"],
    ],
  },

  movimentacoes: {
    cards: [
      ["Receitas", "R$ 8.420,00"],
      ["Despesas", "R$ 3.180,00"],
      ["Saldo", "R$ 5.240,00"],
    ],
    rows: [
      ["Venda de produtos", "Vendas", "+ R$ 350,00"],
      ["Compra de materiais", "Fornecedores", "- R$ 120,00"],
      ["Identidade visual", "Serviços", "+ R$ 480,00"],
      ["Combustível", "Transporte", "- R$ 45,00"],
    ],
  },

  dre: {
    cards: [
      ["Receita", "R$ 12.480,00"],
      ["Despesas", "R$ 4.260,00"],
      ["Resultado", "R$ 8.220,00"],
    ],
    rows: [
      ["Receita operacional", "R$ 12.480,00"],
      ["(-) Custos", "R$ 1.840,00"],
      ["(-) Despesas", "R$ 2.420,00"],
      ["Resultado líquido", "R$ 8.220,00"],
    ],
  },

  perfil: {
    cards: [
      ["Nome", "Carlos Silva"],
      ["E-mail", "[carlos@email.com](mailto:carlos@email.com)"],
      ["Telefone", "(11) 99999-9999"],
    ],
    rows: [
      ["Informações pessoais", "Dados da conta"],
      ["Segurança", "Configurações de acesso"],
      ["Sessões", "Dispositivos conectados"],
    ],
  },

  empresa: {
    cards: [
      ["Empresa", "Carlos Design"],
      ["Membros", "03"],
      ["Código", "A9X2B7"],
    ],
    rows: [
      ["Dados da empresa", "Carlos Design"],
      ["Membros", "3 colaboradores"],
      ["Convite", "A9X2B7"],
    ],
  },

  preferencias: {
    cards: [
      ["Aparência", "Escuro"],
      ["Notificações", "Ativadas"],
      ["Moeda", "Real brasileiro"],
    ],
    rows: [
      ["Aparência", "Tema e visual"],
      ["Notificações", "Alertas do sistema"],
      ["Financeiro", "Preferências financeiras"],
    ],
  },
};

export function DemoLockedPage({
  title,
  description,
  icon = "movimentacoes",
  onRegister,
}: DemoLockedPageProps) {
  const Icon = iconMap[icon];
  const preview = previewData[icon];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cpm-accent/[0.04] blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10">
              <Icon size={15} className="text-brand-400" />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-400">
              Demonstração
            </span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-panel shadow-2xl shadow-black/20"
        >
          <div className="relative p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="h-3 w-28 rounded-full bg-slate-700/60" />
                <div className="mt-2 h-2 w-44 rounded-full bg-slate-800" />
              </div>

              <div className="h-9 w-24 rounded-xl border border-surface-border bg-surface-sidebar" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {preview.cards.map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="rounded-2xl border border-surface-border bg-surface-sidebar/70 p-4"
                >
                  <div className="h-2 w-20 rounded-full bg-slate-700/60" />

                  <div className="mt-3 h-5 w-28 rounded-md bg-slate-600/50" />

                  <div className="mt-2 h-2 w-16 rounded-full bg-slate-800" />
                </motion.div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-surface-border bg-surface-sidebar/60">
              <div className="border-b border-surface-border px-4 py-3">
                <div className="h-2 w-32 rounded-full bg-slate-700/60" />
              </div>

              <div className="divide-y divide-surface-border">
                {preview.rows.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 px-4 py-4 sm:grid-cols-3"
                  >
                    <div>
                      <div className="h-2.5 w-32 rounded-full bg-slate-700/50" />
                      <div className="mt-2 h-2 w-20 rounded-full bg-slate-800" />
                    </div>

                    <div className="hidden sm:block">
                      <div className="h-2.5 w-24 rounded-full bg-slate-700/40" />
                    </div>

                    <div className="flex justify-end">
                      <div className="h-2.5 w-20 rounded-full bg-slate-700/50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 backdrop-blur-[5px]" />
            <div className="pointer-events-none absolute inset-0 bg-[#07111f]/45" />
            <div className="absolute inset-0 z-10 flex items-center justify-center p-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.15,
                }}
                className="w-full max-w-md rounded-3xl border border-brand-500/20 bg-[#0d1a2a]/95 p-6 text-center shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10">
                  <Lock size={22} className="text-brand-400" />
                </div>

                <div className="mt-5">
                  <span className="inline-flex items-center rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-brand-300">
                    Recurso disponível na conta
                  </span>

                  <h2 className="mt-4 font-heading text-xl font-bold text-white sm:text-2xl">
                    Tenha acesso à experiência completa
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                    Você está visualizando uma prévia do{" "}
                    <span className="font-semibold text-slate-300">
                      {title}
                    </span>
                    . Cadastre-se gratuitamente para desbloquear todos os
                    recursos do MetricsFlow AI.
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={onRegister}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-[10px] font-bold text-white shadow-lg shadow-brand-600/20 transition-colors hover:bg-brand-500"
                >
                  Criar minha conta
                  <ArrowRight size={14} />
                </motion.button>

                <p className="mt-3 text-[8px] text-slate-600">
                  É rápido, gratuito e você poderá explorar todos os módulos.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-5 flex items-center justify-center gap-2 text-center"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <p className="text-[9px] text-slate-600">
            Esta é uma prévia da experiência do MetricsFlow AI.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
