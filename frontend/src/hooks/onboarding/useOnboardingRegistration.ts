import { useEffect, useState } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { getCurrentUser } from "@/services/onboarding/getCurrentUser";
import { getUserCompany } from "@/services/onboarding/getUserCompany";
import type { RegistrationData, RegistrationType } from "./types";

interface UseOnboardingRegistrationOptions {
  router: AppRouterInstance;
  isGoogleOnboarding: boolean;
  finishJoinFlow: (code: string) => Promise<void>;
}

export function useOnboardingRegistration({
  router,
  isGoogleOnboarding,
  finishJoinFlow,
}: UseOnboardingRegistrationOptions) {
  const [registrationType, setRegistrationType] =
    useState<RegistrationType | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isLoadingRegistration, setIsLoadingRegistration] = useState(true);
  const [error, setError] = useState("");

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
          if (raw) storedData = JSON.parse(raw);
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
          if (mounted) setRegistrationType(null);
          return;
        }

        if (!type) type = "create_company";

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

        if (!mounted) return;

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
        if (mounted) setIsLoadingRegistration(false);
      }
    }

    loadRegistrationData();
    return () => {
      mounted = false;
    };
  }, [router, isGoogleOnboarding, finishJoinFlow]);

  return {
    registrationType,
    setRegistrationType,
    companyName,
    setCompanyName,
    inviteCode,
    setInviteCode,
    isLoadingRegistration,
    error,
    setError,
  };
}
