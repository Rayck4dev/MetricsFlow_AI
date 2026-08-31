"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

import OnboardingStepGoal from "@/components/onboarding/OnboardingStepGoal";
import OnboardingStepFinance from "@/components/onboarding/OnboardingStepFinance";
import OnboardingStepChallenges from "@/components/onboarding/OnboardingStepChallenges";
import OnboardingStepMetrics from "@/components/onboarding/OnboardingStepMetrics";
import OnboardingStepFrequency from "@/components/onboarding/OnboardingStepFrequency";
import OnboardingComplete from "@/components/onboarding/OnboardingComplete";

import GoogleOnboardingStep from "@/components/auth/GoogleOnboardingStep";
import GoogleJoinCompany from "@/components/auth/GoogleJoinCompany";

import OnboardingNavigation from "@/components/onboarding/OnboardingNavigation";
import OnboardingError from "@/components/onboarding/OnboardingError";

import { useOnboarding } from "@/hooks/useOnboarding";

export default function OnboardingPageContent() {
  const searchParams = useSearchParams();

  const isGoogleOnboarding = searchParams.get("source") === "google";

  const {
    totalSteps,

    currentStep,
    setCurrentStep,

    formData,
    setFormData,

    registrationType,

    setRegistrationType,

    companyName,

    isLoadingRegistration,
    isSubmitting,

    error,
    setError,

    canProceed,
    handleNext,
    handleBack,
    handleToggleMetric,
    handleFinish,

    handleGoogleRegistrationType,
    handleGoogleJoinSuccess,
  } = useOnboarding({
    isGoogleOnboarding,
  });

  if (isLoadingRegistration) {
    return (
      <OnboardingLayout>
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-surface-border border-t-brand-500" />

            <p className="text-xs text-slate-400">
              Preparando sua configuração...
            </p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  if (isGoogleOnboarding && registrationType === null) {
    return (
      <OnboardingLayout>
        <OnboardingError message={error} />

        <GoogleOnboardingStep onSelect={handleGoogleRegistrationType} />
      </OnboardingLayout>
    );
  }

  if (isGoogleOnboarding && registrationType === "join_company") {
    return (
      <OnboardingLayout>
        <OnboardingError message={error} />

        <GoogleJoinCompany
          onBack={() => {
            setError("");
            setRegistrationType(null);
          }}
          onSuccess={handleGoogleJoinSuccess}
        />
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout>
      {currentStep <= totalSteps && (
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      )}

      <OnboardingError message={error} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -20,
          }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
        >
          {currentStep === 1 && (
            <OnboardingStepGoal
              selectedGoal={formData.goal}
              onSelect={(goal) =>
                setFormData((prev) => ({
                  ...prev,
                  goal,
                }))
              }
            />
          )}

          {currentStep === 2 && (
            <OnboardingStepFinance
              selectedControl={formData.controlMethod}
              onSelect={(controlMethod) =>
                setFormData((prev) => ({
                  ...prev,
                  controlMethod,
                }))
              }
            />
          )}

          {currentStep === 3 && (
            <OnboardingStepChallenges
              selectedChallenge={formData.mainChallenge}
              onSelect={(mainChallenge) =>
                setFormData((prev) => ({
                  ...prev,
                  mainChallenge,
                }))
              }
            />
          )}

          {currentStep === 4 && (
            <OnboardingStepMetrics
              selectedMetrics={formData.selectedMetrics}
              onToggle={handleToggleMetric}
            />
          )}

          {currentStep === 5 && (
            <OnboardingStepFrequency
              selectedFrequency={formData.frequency}
              onSelect={(frequency) =>
                setFormData((prev) => ({
                  ...prev,
                  frequency,
                }))
              }
            />
          )}

          {currentStep > totalSteps && (
            <OnboardingComplete
              registrationType={registrationType || "create_company"}
              companyName={
                registrationType === "create_company" ? companyName : ""
              }
              onFinish={handleFinish}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {currentStep <= totalSteps && (
        <OnboardingNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          canProceed={canProceed()}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
    </OnboardingLayout>
  );
}
