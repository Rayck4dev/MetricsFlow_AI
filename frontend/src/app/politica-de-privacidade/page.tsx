import type { Metadata } from "next";
import Link from "next/link";
import { PrivacyPolicySections } from "./_components/PrivacyPolicySections";
import { PrivacyPolicyRights } from "./_components/PrivacyPolicyRights";
import { ArrowLeft, ShieldCheck, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade | MetricsFlow AI",
  description: "Política de Privacidade e proteção de dados da MetricsFlow AI.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-screen bg-surface-main text-slate-100">
      <header className="border-b border-surface-border bg-surface-sidebar/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-400" />

            <span className="text-sm font-semibold text-white">
              MetricsFlow <span className="text-brand-500">AI</span>
            </span>
          </div>
        </div>
      </header>

      <section className="px-5 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-300">
              <ShieldCheck size={13} />
              LGPD e proteção de dados
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Política de Privacidade
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Esta Política explica como a MetricsFlow AI trata dados pessoais
              durante a utilização da plataforma.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Última atualização: 02 de setembro de 2026
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-surface-border bg-surface-panel/70 p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserRound size={17} className="text-brand-400" />

              <h2 className="text-sm font-bold text-white">
                Identificação do responsável
              </h2>
            </div>

            <div className="grid gap-3 text-xs sm:grid-cols-2">
              <InfoItem label="Controlador" value="MetricsFlow AI" />

              <InfoItem label="CNPJ/CPF" value="AB12C34D000-06" />

              <InfoItem label="E-mail" value="metricsflowcompany@gmail.com" />

              <InfoItem
                label="Canal de privacidade"
                value="metricsflowcompany@gmail.com"
              />
            </div>
          </div>

          <div className="mb-8 flex gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-400" />

            <p className="text-xs leading-relaxed text-slate-300">
              A MetricsFlow AI busca tratar dados pessoais de forma
              transparente, segura e compatível com as finalidades para as quais
              foram coletados, observando a legislação brasileira aplicável,
              incluindo a Lei nº 13.709/2018 — Lei Geral de Proteção de Dados
              Pessoais (LGPD).
            </p>
          </div>

          <div className="space-y-8">
            <PrivacyPolicySections />
            <PrivacyPolicyRights />
          </div>

          <div className="mt-12 border-t border-surface-border pt-6">
            <p className="text-center text-[11px] text-slate-600">
              MetricsFlow AI — Controle. Analise. Cresça.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}







function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-sidebar/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate font-medium text-slate-300">{value}</p>
    </div>
  );
}
