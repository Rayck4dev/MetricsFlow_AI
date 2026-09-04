"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DemoFakeCard } from "./DemoFakeCard";

interface DemoLockedPageProps {
  title: string;
  description: string;
  badge?: string;
}

export function DemoLockedPage({
  title,
  description,
  badge,
}: DemoLockedPageProps) {
  const displayBadge = badge ?? "Recurso disponível na conta";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden rounded-3xl">
      <div className="pointer-events-none select-none opacity-45 blur-[7px]">
        <div className="rounded-3xl border border-surface-border bg-surface-panel/80 p-6 shadow-2xl sm:p-8">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-400" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-400">
                Demonstração
              </span>
            </div>

            <h1 className="font-heading text-3xl font-bold text-white">
              {title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <DemoFakeCard />
            <DemoFakeCard />
            <DemoFakeCard />
          </div>

          <div className="mt-5 h-72 rounded-2xl border border-surface-border bg-surface-sidebar/70" />

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <DemoFakeCard />
            <DemoFakeCard />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-[#03182b]/35 backdrop-blur-[1px]" />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[520px] rounded-3xl border border-white/[0.08] bg-[#0a1b2c]/95 p-7 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-9">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-400/15 bg-brand-400/[0.08]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-brand-300"
              aria-hidden="true"
            >
              <path
                d="M7 10V8a5 5 0 0 1 10 0v2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <rect
                x="4"
                y="10"
                width="16"
                height="10"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M12 14v2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="mt-6 inline-flex rounded-full border border-brand-400/15 bg-brand-400/[0.06] px-3 py-1">
            <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-brand-300">
              {displayBadge}
            </span>
          </div>

          <h2 className="mt-5 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
            Tenha acesso à experiência completa
          </h2>

          <p className="mx-auto mt-4 max-w-md text-xs leading-5 text-slate-500 sm:text-sm">
            Você está visualizando uma prévia do{" "}
            <strong className="font-semibold text-slate-300">{title}</strong>.
            Cadastre-se gratuitamente para desbloquear todos os recursos do
            MetricsFlow AI.
          </p>

          <Link
            href="/register"
            className="
              group
              relative
              mt-7
              inline-flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-xl
              bg-brand-500
              px-5
              text-xs
              font-bold
              text-white
              shadow-lg
              shadow-brand-500/10
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-brand-400
              hover:shadow-xl
              hover:shadow-brand-500/20
              active:scale-[0.98]
            "
          >
            <span className="relative z-10 flex items-center gap-2">
              Criar Minha Conta Grátis
              <ArrowRight
                size={17}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </span>

            <span
              className="
                pointer-events-none
                absolute
                inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent
                via-white/10
                to-transparent
                transition-transform
                duration-700
                group-hover:translate-x-full
              "
            />
          </Link>

          <p className="mt-4 text-[8px] text-slate-600">
            É rápido, gratuito e você poderá explorar todos os módulos.
          </p>
        </div>
      </div>
    </div>
  );
}
