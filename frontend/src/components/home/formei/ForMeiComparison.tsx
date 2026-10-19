"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, DollarSign, Sparkles, XCircle } from "lucide-react";
import { withMetrics, withoutMetrics } from "@/types/formei";
import { comparisonAnimation } from "./ForMeiAnimations";

export function ForMeiComparison() {
  return (
    <motion.div
      variants={comparisonAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-80px",
      }}
      className="relative mt-16 overflow-hidden rounded-3xl border border-surface-border bg-surface-panel/70 shadow-2xl shadow-black/20"
    >
      <ComparisonHeader />

      <div className="grid md:grid-cols-2">
        <ComparisonWithout />
        <ComparisonWith />
      </div>

      <ComparisonFooter />
    </motion.div>
  );
}

function ComparisonHeader() {
  return (
    <div className="border-b border-surface-border px-6 py-7 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Na prática
          </span>

          <h3 className="mt-2 font-heading text-xl font-bold text-white md:text-2xl">
            Uma rotina financeira mais simples
          </h3>
        </div>

        <p className="max-w-sm text-xs leading-5 text-slate-500 md:text-right">
          Menos tempo organizando números. Mais tempo cuidando do que realmente
          faz seu negócio crescer.
        </p>
      </div>
    </div>
  );
}

function ComparisonWithout() {
  return (
    <div className="border-b border-surface-border p-6 md:border-b-0 md:border-r md:p-8">
      <ComparisonTitle
        icon={XCircle}
        iconClass="border-red-500/15 bg-red-500/[0.07] text-red-400"
        title="Sem MetricsFlow"
        subtitle="O jeito tradicional"
        titleClass="text-red-400"
      />

      <ComparisonList
        items={withoutMetrics}
        icon={XCircle}
        iconClass="text-red-400/70"
        textClass="text-slate-400"
      />
    </div>
  );
}

function ComparisonWith() {
  return (
    <div className="relative overflow-hidden p-6 md:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-500/[0.05] blur-[70px]"
      />

      <div className="relative z-10">
        <ComparisonTitle
          icon={Sparkles}
          iconClass="border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-400"
          title="Com MetricsFlow AI"
          subtitle="Automatizado e simples"
          titleClass="text-emerald-400"
        />

        <ComparisonList
          items={withMetrics}
          icon={CheckCircle2}
          iconClass="text-emerald-400"
          textClass="text-slate-300"
        />
      </div>
    </div>
  );
}

interface ComparisonTitleProps {
  icon: typeof XCircle;
  iconClass: string;
  title: string;
  subtitle: string;
  titleClass: string;
}

function ComparisonTitle({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  titleClass,
}: ComparisonTitleProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${iconClass}`}
      >
        <Icon size={17} aria-hidden="true" />
      </div>

      <div>
        <span
          className={`text-[9px] font-semibold uppercase tracking-wider ${titleClass}`}
        >
          {title}
        </span>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

interface ComparisonListProps {
  items: readonly string[];
  icon: typeof XCircle;
  iconClass: string;
  textClass: string;
}

function ComparisonList({
  items,
  icon: Icon,
  iconClass,
  textClass,
}: ComparisonListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <Icon
            size={16}
            className={`mt-0.5 shrink-0 ${iconClass}`}
            aria-hidden="true"
          />
          <span className={`text-xs leading-5 ${textClass}`}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function ComparisonFooter() {
  return (
    <div className="flex flex-col gap-4 border-t border-surface-border bg-surface-sidebar/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
          <DollarSign size={14} aria-hidden="true" />
        </div>

        <span className="text-[11px] text-slate-400">
          Mais clareza para tomar decisões melhores.
        </span>
      </div>

      <Link
        href="/login"
        className="group inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-400 transition-colors hover:text-brand-300"
      >
        Quero simplificar meu financeiro
        <ArrowRight
          size={13}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
