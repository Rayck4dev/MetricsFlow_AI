import { Suspense } from "react";

import OnboardingPageContent from "@/components/onboarding/OnboardingPageContent";

function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-surface-border border-t-brand-500" />

          <p className="text-xs text-slate-400">
            Preparando sua configuração...
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
