import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import { CookiePolicySections } from "./_components/CookiePolicySections";

export const metadata: Metadata = {
  title: "Política de Cookies | MetricsFlow AI",
  description: "Política de Cookies da plataforma MetricsFlow AI.",
};

export default function PoliticaDeCookiesPage() {
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
            <Cookie size={16} className="text-brand-400" />

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
              <Cookie size={13} />
              Cookies e tecnologias similares
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Política de Cookies
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Esta Política explica como cookies e tecnologias semelhantes podem
              ser utilizados pela MetricsFlow AI.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Última atualização: 02 de setembro de 2026
            </p>
          </div>

          <div className="mb-8 flex gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
            <Cookie size={18} className="mt-0.5 shrink-0 text-brand-400" />

            <p className="text-xs leading-relaxed text-slate-300">
              A MetricsFlow AI utiliza tecnologias de armazenamento e
              autenticação necessárias ao funcionamento da aplicação. Esta
              Política descreve o papel dos cookies e diferencia seu uso de
              outros mecanismos de armazenamento do navegador.
            </p>
          </div>

          <CookiePolicySections />

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
