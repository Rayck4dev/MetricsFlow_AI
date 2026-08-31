"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/services/onboarding/getCurrentUser";
import { getUserCompany } from "@/services/onboarding/getUserCompany";
import { joinCompanyByCode } from "@/services/company/joinCompany";
import { createCompanyForCurrentUser } from "@/services/onboarding/createCompany";

export type RegistrationType = "create_company" | "join_company";

export interface RegistrationData {
  type?: RegistrationType | "google";
  companyName?: string;
  inviteCode?: string;
}

export interface OnboardingFormData {
  goal: string;
  controlMethod: string;
  mainChallenge: string;
  selectedMetrics: string[];
  frequency: string;
}

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

  const [registrationType, setRegistrationType] =
    useState<RegistrationType | null>(null);

  const [companyName, setCompanyName] = useState("");

  const [inviteCode, setInviteCode] = useState("");

  const [isLoadingRegistration, setIsLoadingRegistration] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

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

      sessionStorage.removeItem("metricsflow_registration");

      router.replace("/dashboard");
    },
    [router],
  );

  useEffect(() => {
    let mounted = true;

    async function loadRegistrationData() {
      try {
        setIsLoadingRegistration(true);
        setError("");

        const user = await getCurrentUser();

        const { companyId } = await getUserCompany();

        if (companyId) {
          router.replace("/dashboard");
          return;
        }

        const identities = Array.isArray(user.identities)
          ? user.identities
          : [];

        const isGoogleUser =
          user.app_metadata?.provider === "google" ||
          identities.some((identity) => identity.provider === "google");

        let storedData: RegistrationData = {};

        try {
          const raw = sessionStorage.getItem("metricsflow_registration");

          if (raw) {
            storedData = JSON.parse(raw);
          }
        } catch {
          console.warn("Não foi possível ler o contexto do cadastro.");
        }

        const metadata = user.user_metadata ?? {};

        let type: RegistrationType | null = null;

        if (
          storedData.type === "create_company" ||
          storedData.type === "join_company"
        ) {
          type = storedData.type;
        }

        if (!type) {
          const metadataType = metadata.registration_type;

          if (
            metadataType === "create_company" ||
            metadataType === "join_company"
          ) {
            type = metadataType;
          }
        }

        if (isGoogleUser && !type) {
          if (mounted) {
            setRegistrationType(null);
          }


          return;
        }

        if (!type) {
          type = "create_company";
        }

        const storedCompanyName =
          typeof storedData.companyName === "string"
            ? storedData.companyName.trim()
            : "";

        const metadataCompanyName =
          typeof metadata.company_name === "string"
            ? metadata.company_name.trim()
            : "";

        const storedInviteCode =
          typeof storedData.inviteCode === "string"
            ? storedData.inviteCode.trim().toUpperCase()
            : "";

        const metadataInviteCode =
          typeof metadata.invite_code === "string"
            ? metadata.invite_code.trim().toUpperCase()
            : "";

        if (!mounted) {
          return;
        }

        setRegistrationType(type);

        if (type === "create_company") {
          setCompanyName(storedCompanyName || metadataCompanyName);
        }

        if (type === "join_company") {
          const finalInviteCode = storedInviteCode || metadataInviteCode;

          setInviteCode(finalInviteCode);

          if (finalInviteCode) {
            await finishJoinFlow(finalInviteCode);
            return;
          }

          console.warn("Colaborador sem código de convite.");
        }


      } catch (err) {
        console.error("💥 Erro ao carregar contexto do cadastro:", err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar sua configuração.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoadingRegistration(false);
        }
      }
    }

    loadRegistrationData();

    return () => {
      mounted = false;
    };
  }, [router, isGoogleOnboarding, finishJoinFlow]);

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
    [],
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
    if (!canProceed()) {
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((previous) => previous + 1);

      return;
    }

    setCurrentStep(TOTAL_STEPS + 1);
  }, [canProceed, currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1 && currentStep <= TOTAL_STEPS) {
      setCurrentStep((previous) => previous - 1);
    }
  }, [currentStep]);

  const handleToggleMetric = useCallback((metricId: string) => {
    setFormData((previous) => {
      const exists = previous.selectedMetrics.includes(metricId);

      return {
        ...previous,

        selectedMetrics: exists
          ? previous.selectedMetrics.filter((id) => id !== metricId)
          : [...previous.selectedMetrics, metricId],
      };
    });
  }, []);

  const handleFinish = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

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

        return;
      }

      localStorage.setItem("metricsflow_onboarding", JSON.stringify(formData));

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
