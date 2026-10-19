"use client";

import { motion } from "framer-motion";
import { benefits } from "@/types/formei";
import { benefitAnimation } from "./ForMeiAnimations";

export function BenefitsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {benefits.map((benefit, index) => (
        <BenefitCard key={benefit.title} benefit={benefit} index={index} />
      ))}
    </div>
  );
}

interface BenefitCardProps {
  benefit: (typeof benefits)[number];
  index: number;
}

function BenefitCard({ benefit, index }: BenefitCardProps) {
  const Icon = benefit.icon;

  return (
    <motion.article
      custom={index}
      variants={benefitAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-80px",
      }}
      className="group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-surface-panel"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand-500/[0.04] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <div
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border ${benefit.iconClass}`}
      >
        <Icon size={19} aria-hidden="true" />
      </div>

      <h3 className="relative mt-5 font-heading text-base font-bold text-white">
        {benefit.title}
      </h3>

      <p className="relative mt-2 text-xs leading-6 text-slate-400">
        {benefit.description}
      </p>

      <span
        aria-hidden="true"
        className="absolute bottom-5 right-6 text-[10px] font-bold text-slate-800"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.article>
  );
}
