"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-sidebar text-xs text-slate-400">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-4">
        <div className="space-y-5 md:col-span-2">
          <Link href="/" className="group flex w-fit items-center gap-2.5">
            <Image
              src="/logo_metrics_bg.png"
              alt="MetricsFlow AI"
              width={48}
              height={48}
              className="
                h-10
                w-10
                object-contain
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />

            <span className="font-heading text-base font-bold tracking-tight text-white">
              MetricsFlow <span className="text-brand-400">AI</span>
            </span>
          </Link>

          <p className="max-w-sm text-xs leading-6 text-slate-400">
            Gestão financeira para MEIs, feita para acompanhar a rotina do seu
            negócio. Registre movimentações, acompanhe indicadores e organize
            seu financeiro pelo WhatsApp.
          </p>

          <div
            className="
              flex w-fit items-center gap-2
              rounded-full
              border border-emerald-500/20
              bg-emerald-500/10
              px-3 py-1.5
              text-[10px]
              font-medium
              text-emerald-400
            "
          >
            <Sparkles size={11} />

            <span>
              Desenvolvido para o Laboratório de Empreendimentos Inovadores
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            Plataforma
          </p>

          <ul className="space-y-2.5">
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
                Recursos
              </a>
            </li>

            <li>
              <Link
                href="/demo"
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  transition-colors
                  hover:text-white
                "
              >
                Ver demonstração
                <ArrowRight size={11} />
              </Link>
            </li>

            <li>
              <Link
                href="/login"
                className="transition-colors hover:text-white"
              >
                Entrar
              </Link>
            </li>

            <li>
              <Link
                href="/cadastro"
                className="transition-colors hover:text-white"
              >
                Criar conta
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            Legal
          </p>

          <ul className="space-y-2.5">
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
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  transition-colors
                  hover:text-white
                "
              >
                <Mail size={11} />
                Contato
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-[10px] text-slate-500 md:flex-row">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} MetricsFlow AI. Todos os direitos
            reservados.
          </p>

          <div className="flex items-center gap-2">
            <span>Controle.</span>
            <span>Analise.</span>
            <span className="text-slate-400">Cresça.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
