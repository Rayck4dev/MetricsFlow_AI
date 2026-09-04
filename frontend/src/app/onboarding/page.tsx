import { Suspense } from "react";

import OnboardingPageContent from "@/components/onboarding/OnboardingPageContent";

function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-surface-main text-slate-100 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/8 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-surface-border" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-slate-300">
            Preparando sua configuração
          </p>
          <p className="text-xs text-slate-500">
            Isso vai levar só um momento…
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingLoading />}>
      <OnboardingPageContent />
    </Suspense>
  );
}
