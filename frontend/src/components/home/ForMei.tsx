"use client";

import { BenefitsGrid } from "./formei/BenefitsGrid";
import { ForMeiBottomMessage } from "./formei/ForMeiBottomMessage";
import { ForMeiComparison } from "./formei/ForMeiComparison";
import { BackgroundEffects, SectionHeader } from "./formei/ForMeiHeader";

export function ForMei() {
  return (
    <section
      id="diferenciais"
      className="relative scroll-mt-20 overflow-hidden border-t border-surface-border/50 px-6 py-24"
    >
      <BackgroundEffects />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeader />
        <BenefitsGrid />
        <ForMeiComparison />
        <ForMeiBottomMessage />
      </div>
    </section>
  );
}
