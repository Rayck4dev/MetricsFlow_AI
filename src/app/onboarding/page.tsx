"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingStepGoal from "@/components/onboarding/OnboardingStepGoal";
import OnboardingStepFinance from "@/components/onboarding/OnboardingStepFinance";
import OnboardingStepChallenges from "@/components/onboarding/OnboardingStepChallenges";
import OnboardingStepMetrics from "@/components/onboarding/OnboardingStepMetrics";
import OnboardingStepFrequency from "@/components/onboarding/OnboardingStepFrequency";
import OnboardingComplete from "@/components/onboarding/OnboardingComplete";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    goal: "",
    controlMethod: "",
    mainChallenge: "",
    selectedMetrics: [] as string[],
    frequency: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = () => {
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
  };

  const handleNext = () => {
    if (canProceed() && currentStep <= totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleToggleMetric = (metricId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedMetrics.includes(metricId);
      return {
        ...prev,
        selectedMetrics: exists
          ? prev.selectedMetrics.filter((id) => id !== metricId)
          : [...prev.selectedMetrics, metricId],
      };
    });
  };

  const handleFinish = async () => {
    setIsSubmitting(true);

    try {
      console.log("Dados do Onboarding salvos:", formData);
      localStorage.setItem("metricsflow_onboarding", JSON.stringify(formData));

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout>
      {currentStep <= totalSteps && (
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {currentStep === 1 && (
            <OnboardingStepGoal
              selectedGoal={formData.goal}
              onSelect={(goal) => setFormData((prev) => ({ ...prev, goal }))}
            />
          )}

          {currentStep === 2 && (
            <OnboardingStepFinance
              selectedControl={formData.controlMethod}
              onSelect={(controlMethod) =>
                setFormData((prev) => ({ ...prev, controlMethod }))
              }
            />
          )}

          {currentStep === 3 && (
            <OnboardingStepChallenges
              selectedChallenge={formData.mainChallenge}
              onSelect={(mainChallenge) =>
                setFormData((prev) => ({ ...prev, mainChallenge }))
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
                setFormData((prev) => ({ ...prev, frequency }))
              }
            />
          )}

          {currentStep > totalSteps && (
            <OnboardingComplete
              onFinish={handleFinish}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {currentStep <= totalSteps && (
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-surface-border/60">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-2 px-4 py-2.5 rounded-xl border border-transparent hover:border-surface-border transition-all disabled:opacity-0 cursor-pointer"
          >
            <ArrowLeft size={14} /> Voltar
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>
              {currentStep === totalSteps ? "Finalizar" : "Continuar"}
            </span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      )}
    </OnboardingLayout>
  );
}
