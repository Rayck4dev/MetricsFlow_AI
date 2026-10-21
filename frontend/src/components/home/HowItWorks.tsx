"use client";

import { SectionHeader, FlowSummary } from "./how-it-works/HowItWorksSections";
import { steps } from "./how-it-works/steps";
import { StepCard } from "./how-it-works/StepCard";

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="
        relative
        overflow-hidden
        border-t border-surface-border/50
        px-6
        py-24
        scroll-mt-20
      "
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-brand-500/[0.025] blur-[130px]" />

        <div className="absolute bottom-0 left-[10%] h-[260px] w-[300px] rounded-full bg-emerald-500/[0.02] blur-[110px]" />

        <div className="absolute bottom-0 right-[10%] h-[260px] w-[300px] rounded-full bg-violet-500/[0.02] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeader />

        <div className="mt-16 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <FlowSummary />
      </div>
    </section>
  );
}
