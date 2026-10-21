"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { createCompanyForCurrentUser } from "@/services/onboarding/createCompany";
import { getCurrentUser } from "@/services/onboarding/getCurrentUser";
import { joinCompanyByCode } from "@/services/company/joinCompany";
import { saveOnboarding } from "@/services/onboarding/saveOnboarding";

import { useOnboardingRegistration } from "./onboarding/useOnboardingRegistration";
import { useOnboardingSteps } from "./onboarding/useOnboardingSteps";
import type { OnboardingFormData, RegistrationType } from "./onboarding/types";

export type {
  RegistrationType,
  RegistrationData,
  OnboardingFormData,
} from "./onboarding/types";

const TOTAL_STEPS = 5;

const initialFormData: OnboardingFormData = {
  goal: "",
  controlMethod: "",
  mainChallenge: "",
  selectedMetrics: [],
  frequency: "",
};

interface UseOnboardingOptions {
  isGoogleOnboarding: boolean;
}

export function useOnboarding({ isGoogleOnboarding }: UseOnboardingOptions) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finishJoinFlow = useCallback(
    async (code: string) => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const result = await joinCompanyByCode(code);
      localStorage.setItem("metricsflow_company_id", result.company_id);
      if (result.company_name) {
        localStorage.setItem("metricsflow_company", result.company_name);
      }
      localStorage.setItem("metricsflow_role", result.role || "collaborator");
    },
    [router],
  );

  const registration = useOnboardingRegistration({
    router,
    isGoogleOnboarding,
    finishJoinFlow,
  });
  const {
    registrationType,
    setRegistrationType,
    companyName,
    setCompanyName,
    inviteCode,
    setInviteCode,
    isLoadingRegistration,
    error,
    setError,
  } = registration;

  const handleGoogleRegistrationType = useCallback(
    (type: RegistrationType, googleCompanyName?: string) => {
      setError("");
      setRegistrationType(type);
      if (type === "create_company") {
        setCompanyName(googleCompanyName?.trim() || "");
        setInviteCode("");
        setCurrentStep(1);
        return;
      }
      setCompanyName("");
      setInviteCode("");
    },
    [setError, setRegistrationType, setCompanyName, setInviteCode],
  );

  const handleGoogleJoinSuccess = useCallback(
    (companyId: string, companyName?: string | null) => {
      localStorage.setItem("metricsflow_company_id", companyId);
      if (companyName) {
        localStorage.setItem("metricsflow_company", companyName);
      }
      localStorage.setItem("metricsflow_role", "collaborator");
      sessionStorage.removeItem("metricsflow_registration");
      router.replace("/dashboard");
    },
    [router],
  );

  const { canProceed, handleNext, handleBack, handleToggleMetric } =
    useOnboardingSteps({
      currentStep,
      setCurrentStep,
      formData,
      setFormData,
    });

  const handleFinish = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const user = await getCurrentUser();
      if (registrationType === "create_company") {
        const finalCompanyName = companyName.trim();
        if (!finalCompanyName) {
          throw new Error("O nome da empresa não foi informado.");
        }
        const result = await createCompanyForCurrentUser(finalCompanyName);
        localStorage.setItem("metricsflow_company_id", result.company_id);
        if (result.company_name) {
          localStorage.setItem("metricsflow_company", result.company_name);
        }
        localStorage.setItem("metricsflow_role", result.role || "owner");
      }

      if (registrationType === "join_company") {
        const finalInviteCode = inviteCode.trim().toUpperCase();
        if (!finalInviteCode) {
          throw new Error("O código de convite não foi informado.");
        }
        await finishJoinFlow(finalInviteCode);
      }

      await saveOnboarding(user.id, formData);
      sessionStorage.removeItem("metricsflow_registration");
      router.replace("/dashboard");
    } catch (err) {
      console.error("💥 Erro ao finalizar onboarding:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível finalizar sua configuração.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    registrationType,
    companyName,
    formData,
    inviteCode,
    finishJoinFlow,
    router,
    setError,
  ]);

  return {
    totalSteps: TOTAL_STEPS,
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    registrationType,
    setRegistrationType,
    companyName,
    setCompanyName,
    inviteCode,
    setInviteCode,
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
    finishJoinFlow,
  };
}
