"use client";

import Link from "next/link";
import Image from "next/image";
import {Sparkles} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-sidebar border-t border-surface-border text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo_metrics_bg.png"
              alt="MetricsFlow AI Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
            <span className="font-heading font-bold text-white text-base">
              MetricsFlow <span className="text-brand-500">AI</span>
            </span>
          </Link>
          <p className="text-slate-400 max-w-sm leading-relaxed">
            Gestão de Desempenho Corporativo (CPM) simplificada para MEIs.
            Registre receitas e despesas via áudio ou texto no WhatsApp e receba
            um DRE automatizado.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
            <Sparkles size={12} /> Desenvolvido para o Laboratório de
            Empreendimentos Inovadores
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-heading font-semibold text-white uppercase text-[11px] tracking-wider">
            Plataforma
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="#como-funciona"
                className="hover:text-white transition-colors"
              >
                Como Funciona
              </a>
            </li>
            <li>
              <a
                href="#recursos"
                className="hover:text-white transition-colors"
              >
                Recursos para MEI
              </a>
            </li>
            <li>
              <Link
                href="/login"
                className="hover:text-white transition-colors"
              >
                Entrar / Cadastrar
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-white transition-colors"
              >
                Painel Web (Demo)
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-heading font-semibold text-white uppercase text-[11px] tracking-wider">
            Tecnologias
          </p>
          <ul className="space-y-2 text-slate-400">
            <li>Next.js 14 + React</li>
            <li>Tailwind CSS v3</li>
            <li>Supabase PostgreSQL</li>
            <li>Gemini / OpenAI API</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-border py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center text-slate-500">
          <p>
            © {new Date().getFullYear()} MetricsFlow AI. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
