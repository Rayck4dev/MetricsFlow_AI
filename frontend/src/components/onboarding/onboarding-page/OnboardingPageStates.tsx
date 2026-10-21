"use client";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import OnboardingError from "@/components/onboarding/OnboardingError";
import GoogleOnboardingStep from "@/components/auth/GoogleOnboardingStep";

export function OnboardingLoadingState() {
  return (
      <OnboardingLayout>
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center space-y-4">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-surface-border border-t-brand-500 animate-spin" />
            <p className="text-xs text-slate-400">
              Preparando sua configuração...
            </p>
          </div>
        </div>
      </OnboardingLayout>
    );
}

export function GoogleOnboardingSelection({ error, onSelect }: { error: string; onSelect: (type: "create_company" | "join_company") => void }) {
  return (
      <OnboardingLayout>
        <OnboardingError message={error} />
        <GoogleOnboardingStep onSelect={onSelect} />
      </OnboardingLayout>
    );
}
