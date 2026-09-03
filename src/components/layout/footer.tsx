"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-sidebar text-xs text-slate-400">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo_metrics_bg.png"
              alt="MetricsFlow AI Logo"
              width={48}
              height={48}
              className="h-10 w-10 rounded-lg object-contain"
            />

            <span className="font-heading text-base font-bold text-white">
              MetricsFlow <span className="text-brand-500">AI</span>
            </span>
          </Link>

          <p className="max-w-sm leading-relaxed text-slate-400">
            Gestão financeira simplificada para MEIs. Organize receitas,
            despesas, indicadores e resultados em um único ambiente.
          </p>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-400">
            <Sparkles size={12} />

            <span>
              Desenvolvido para o Laboratório de Empreendimentos Inovadores
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-heading text-[11px] font-semibold uppercase tracking-wider text-white">
            Plataforma
          </p>

          <ul className="space-y-2">
            <li>
              <a
                href="#como-funciona"
                className="transition-colors hover:text-white"
              >
                Como funciona
              </a>
            </li>

            <li>
              <a
                href="#recursos"
                className="transition-colors hover:text-white"
              >
                Recursos para MEI
              </a>
            </li>

            <li>
              <Link
                href="/login"
                className="transition-colors hover:text-white"
              >
                Entrar / Cadastrar
              </Link>
            </li>

            <li>
              <Link
                href="/dashboard"
                className="transition-colors hover:text-white"
              >
                Painel Web
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-heading text-[11px] font-semibold uppercase tracking-wider text-white">
            Legal
          </p>

          <ul className="space-y-2">
            <li>
              <Link
                href="/termos-de-uso"
                className="transition-colors hover:text-white"
              >
                Termos de Uso
              </Link>
            </li>

            <li>
              <Link
                href="/politica-de-privacidade"
                className="transition-colors hover:text-white"
              >
                Política de Privacidade
              </Link>
            </li>

            <li>
              <Link
                href="/politica-de-cookies"
                className="transition-colors hover:text-white"
              >
                Política de Cookies
              </Link>
            </li>

            <li>
              <a
                href="mailto:metricsflowcompany@gmail.com"
                className="transition-colors hover:text-white"
              >
                Contato
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-border px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-[10px] text-slate-500 md:flex-row">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} MetricsFlow AI. Todos os direitos
            reservados.
          </p>

          <p className="text-center md:text-right">
            Controle. Analise. Cresça.
          </p>
        </div>
      </div>
    </footer>
  );
}
