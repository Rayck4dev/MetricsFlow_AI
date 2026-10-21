"use client";

import { FeatureCard } from "./features/FeatureCard";
import { BackgroundEffects, FeaturesHeader } from "./features/FeatureSections";
import { FeaturesFooter } from "./features/FeaturesFooter";
import { features } from "@/types/features";

export function Features() {
  return (
    <section
      id="recursos"
      className="
        relative
        scroll-mt-20
        overflow-hidden
        border-t border-surface-border/50
        px-6
        py-24
      "
    >
      <BackgroundEffects />

      <div className="relative z-10 mx-auto max-w-6xl">
        <FeaturesHeader />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <FeaturesFooter />
      </div>
    </section>
  );
}
