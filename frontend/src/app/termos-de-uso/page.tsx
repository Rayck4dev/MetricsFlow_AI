import type { Metadata } from "next";
import Link from "next/link";
import { TermsIntroduction } from "./_components/TermsIntroduction";
import { TermsFinalSections } from "./_components/TermsFinalSections";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso | MetricsFlow AI",
  description: "Termos de Uso da plataforma MetricsFlow AI.",
};

export default function TermosDeUsoPage() {
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
            <FileText size={16} className="text-brand-400" />

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
              <FileText size={13} />
              Documento legal
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Termos de Uso
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Estes Termos de Uso estabelecem as condições para utilização da
              plataforma MetricsFlow AI.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Última atualização: 02 de setembro de 2026
            </p>
          </div>

          <div className="mb-8 flex gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-400" />

            <p className="text-xs leading-relaxed text-slate-300">
              Ao utilizar a MetricsFlow AI, você declara que leu e compreendeu
              estes Termos de Uso. A utilização da plataforma implica a
              aceitação das condições aqui estabelecidas.
            </p>
          </div>

          <div className="space-y-8">
            <TermsIntroduction />
            <TermsFinalSections />
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




