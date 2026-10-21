import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { OnboardingFormData } from "./types";

const TOTAL_STEPS = 5;

interface UseOnboardingStepsOptions {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  formData: OnboardingFormData;
  setFormData: Dispatch<SetStateAction<OnboardingFormData>>;
}

export function useOnboardingSteps({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
}: UseOnboardingStepsOptions) {
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!formData.goal;
      case 2:
        return !!formData.controlMethod;
      case 3:
        return !!formData.mainChallenge;
      case 4:
        return formData.selectedMetrics.length > 0;
      case 5:
        return !!formData.frequency;
      default:
        return true;
    }
  }, [currentStep, formData]);

  const handleNext = useCallback(() => {
    if (!canProceed()) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((previous) => previous + 1);
      return;
    }
    setCurrentStep(TOTAL_STEPS + 1);
  }, [canProceed, currentStep, setCurrentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1 && currentStep <= TOTAL_STEPS) {
      setCurrentStep((previous) => previous - 1);
    }
  }, [currentStep, setCurrentStep]);

  const handleToggleMetric = useCallback(
    (metricId: string) => {
      setFormData((previous) => {
        const exists = previous.selectedMetrics.includes(metricId);
        return {
          ...previous,
          selectedMetrics: exists
            ? previous.selectedMetrics.filter((id) => id !== metricId)
            : [...previous.selectedMetrics, metricId],
        };
      });
    },
    [setFormData],
  );

  return { canProceed, handleNext, handleBack, handleToggleMetric };
}
