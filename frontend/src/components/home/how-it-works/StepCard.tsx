"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { steps } from "./steps";

interface StepCardProps {
  step: (typeof steps)[number];
  index: number;
  isLast: boolean;
}

export function StepCard({ step, index, isLast }: StepCardProps) {
  const Icon = step.icon;

  return (
    <div className="relative">
      <motion.article
        initial={{
          opacity: 0,
          y: 28,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          margin: "-80px",
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          group
          relative
          flex
          min-h-[290px]
          flex-col
          overflow-hidden
          rounded-2xl
          border border-surface-border
          bg-surface-panel/70
          p-5
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-slate-700
          hover:bg-surface-panel
        "
      >
        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-36
            w-36
            rounded-full
            ${step.glow}
            opacity-0
            blur-3xl
            transition-opacity
            duration-500
            group-hover:opacity-100
          `}
        />

        <div className="relative flex items-center justify-between">
          <span
            className={`
              font-heading
              text-2xl
              font-black
              tracking-tight
              ${step.color}
            `}
          >
            {step.number}
          </span>

          <span
            className={`
              rounded-full
              border
              ${step.border}
              ${step.bg}
              px-2.5
              py-1
              text-[8px]
              font-semibold
              ${step.color}
            `}
          >
            {step.badge}
          </span>
        </div>

        <div
          className={`
            relative
            mt-7
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border
            ${step.border}
            ${step.bg}
            ${step.color}
            transition-transform
            duration-300
            group-hover:scale-105
          `}
        >
          <Icon size={21} aria-hidden="true" />
        </div>

        <div className="relative mt-6">
          <h3 className="font-heading text-base font-bold text-white">
            {step.title} <span className={step.color}>{step.highlight}</span>
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {step.description}
          </p>
        </div>

        <div className="relative mt-auto flex items-center gap-2 pt-6">
          <div
            className={`
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              ${step.bg}
              ${step.color}
            `}
          >
            <Check size={11} strokeWidth={3} />
          </div>

          <span className="text-[8px] font-medium text-slate-600">
            Etapa {index + 1} de {steps.length}
          </span>
        </div>
      </motion.article>

      {!isLast && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-4
            top-1/2
            z-20
            hidden
            -translate-y-1/2
            lg:block
          "
        >
          <div className="flex items-center">
            <span className="h-px w-3 bg-surface-border" />

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border bg-surface-main text-slate-600">
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
