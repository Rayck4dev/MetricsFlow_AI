"use client";

import { useEffect, useState } from "react";
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

import { createClient } from "@/lib/supabase/client";

type RegistrationType = "create_company" | "join_company";

interface RegistrationData {
  type?: RegistrationType | "google";
  companyName?: string;
  inviteCode?: string;
}

interface OnboardingFormData {
  goal: string;
  controlMethod: string;
  mainChallenge: string;
  selectedMetrics: string[];
  frequency: string;
}

export default function OnboardingPage() {
  const router = useRouter();

  const totalSteps = 5;

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<OnboardingFormData>({
    goal: "",
    controlMethod: "",
    mainChallenge: "",
    selectedMetrics: [],
    frequency: "",
  });

  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("create_company");

  const [companyName, setCompanyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [isLoadingRegistration, setIsLoadingRegistration] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function finishJoinFlow(code: string) {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) {
      router.replace("/login");
      return;
    }

    const finalInviteCode = code.trim().toUpperCase();

    if (!finalInviteCode) {
      throw new Error("O código de convite não foi informado.");
    }

    const { data, error: rpcError } = await supabase.rpc(
      "join_company_by_code",
      { code_input: finalInviteCode },
    );

    if (rpcError) throw rpcError;

    if (!data?.success) {
      throw new Error(data?.message || "Não foi possível entrar na empresa.");
    }

    localStorage.setItem("metricsflow_company_id", data.company_id);

    if (data.company_name) {
      localStorage.setItem("metricsflow_company", data.company_name);
    }

    localStorage.setItem("metricsflow_role", "collaborator");
    sessionStorage.removeItem("metricsflow_registration");

    router.replace("/dashboard");
  }

  /*
   * ============================================================
   * CARREGAR DADOS DO CADASTRO
   * ============================================================
   *
   * O RegisterForm salva os dados em:
   *
   * sessionStorage.metricsflow_registration
   *
   * Também mantemos os mesmos dados no user_metadata.
   *
   * O metadata NÃO é usado como autorização.
   * Ele serve apenas para recuperar o contexto inicial.
   */
  useEffect(() => {
    async function loadRegistrationData() {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          router.replace("/login");
          return;
        }

        // Verificar se o usuário já possui empresa vinculada
        const { data: membership, error: membershipError } = await supabase
          .from("company_members")
          .select("company_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (membershipError) {
          console.error("Erro ao verificar associação de empresa:", membershipError);
        }

        if (membership?.company_id) {
          console.log("🏢 Usuário já pertence a uma empresa. Redirecionando para o Dashboard.");
          router.replace("/dashboard");
          return;
        }

        let storedData: RegistrationData = {};

        try {
          const raw = sessionStorage.getItem("metricsflow_registration");

          if (raw) {
            storedData = JSON.parse(raw);
          }
        } catch {
          console.warn("⚠️ Não foi possível ler os dados do cadastro.");
        }

        const metadata = user.user_metadata ?? {};

        /*
         * Primeiro tentamos sessionStorage.
         * Depois metadata.
         */
        let type =
          storedData.type === "create_company" ||
          storedData.type === "join_company"
            ? storedData.type
            : null;

        if (!type) {
          const metadataType = metadata.registration_type;

          if (
            metadataType === "create_company" ||
            metadataType === "join_company"
          ) {
            type = metadataType;
          }
        }

        /*
         * Google:
         *
         * Se ainda não temos um tipo, usamos o fluxo
         * padrão de criação de empresa.
         *
         * Depois podemos criar uma tela específica
         * para escolha do tipo no Google.
         */
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

        setRegistrationType(type);

        if (type === "create_company") {
          setCompanyName(storedCompanyName || metadataCompanyName);
        }

        if (type === "join_company") {
          const finalInviteCode = storedInviteCode || metadataInviteCode;
          setInviteCode(finalInviteCode);

          // Colaborador não passa pelo onboarding.
          await finishJoinFlow(finalInviteCode);
          return;
        }

        console.log("========== CONTEXTO DO CADASTRO ==========");
        console.log("Tipo:", type);
        console.log(
          "Empresa:",
          storedCompanyName || metadataCompanyName || "(nenhuma)",
        );
        console.log(
          "Convite:",
          storedInviteCode || metadataInviteCode || "(nenhum)",
        );
      } catch (err) {
        console.error("💥 Erro ao carregar contexto do cadastro:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar sua configuração.",
        );
      } finally {
        setIsLoadingRegistration(false);
      }
    }

    loadRegistrationData();
  }, [router]);

  /*
   * ============================================================
   * VALIDAÇÃO DA ETAPA ATUAL
   * ============================================================
   */
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

  /*
   * ============================================================
   * AVANÇAR
   * ============================================================
   */
  const handleNext = () => {
    if (!canProceed()) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setCurrentStep(totalSteps + 1);
  };

  /*
   * ============================================================
   * VOLTAR
   * ============================================================
   */
  const handleBack = () => {
    if (currentStep > 1 && currentStep <= totalSteps) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /*
   * ============================================================
   * MÉTRICAS
   * ============================================================
   */
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

  /*
   * ============================================================
   * FINALIZAR
   * ============================================================
   */
  const handleFinish = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error("Sua sessão não foi encontrada. Faça login novamente.");
      }

      console.log("========== FINALIZANDO ONBOARDING ==========");
      console.log("👤 Usuário:", user.id);
      console.log("📧 Email:", user.email);
      console.log("👥 Tipo:", registrationType);
      console.log("🏢 Empresa:", companyName);
      console.log("🎟️ Convite:", inviteCode);
      console.log("📊 Onboarding:", formData);

      let companyResult: any = null;

      /*
       * ========================================================
       * OWNER
       * ========================================================
       */
      if (registrationType === "create_company") {
        const finalCompanyName = companyName.trim();

        if (!finalCompanyName) {
          throw new Error("O nome da empresa não foi informado.");
        }

        console.log("🏗️ Criando empresa como OWNER...");

        const { data, error: rpcError } = await supabase.rpc(
          "create_company_for_current_user",
          {
            company_name_input: finalCompanyName,
          },
        );

        if (rpcError) {
          console.error("❌ Erro create_company_for_current_user:", rpcError);

          throw rpcError;
        }

        companyResult = data;

        if (!companyResult?.success) {
          throw new Error(
            companyResult?.message || "Não foi possível criar sua empresa.",
          );
        }

        console.log("✅ Empresa criada/localizada:", companyResult);
      }

      /*
       * ========================================================
       * COLABORADOR
       * ========================================================
       */
      if (registrationType === "join_company") {
        const finalInviteCode = inviteCode.trim().toUpperCase();

        if (!finalInviteCode) {
          throw new Error("O código de convite não foi informado.");
        }

        console.log("🤝 Entrando na empresa por convite...");

        const { data: rpcData, error: rpcError } = await supabase.rpc(
          "join_company_by_code",
          {
            code_input: inviteCode,
          },
        );

        if (rpcError) {
          console.error("❌ Erro join_company_by_invite:", {
            message: rpcError?.message,
            details: rpcError?.details,
            hint: rpcError?.hint,
            code: rpcError?.code,
          });
          throw rpcError;
        }

        companyResult = rpcData;

        if (!companyResult?.success) {
          throw new Error(
            companyResult?.message || "Não foi possível entrar na empresa.",
          );
        }

        console.log("✅ Usuário entrou na empresa:", companyResult);
      }

      /*
       * ========================================================
       * SALVAR ONBOARDING TEMPORARIAMENTE
       * ========================================================
       *
       * Futuramente podemos mover isso para uma tabela
       * user_preferences.
       */
      localStorage.setItem("metricsflow_onboarding", JSON.stringify(formData));

      if (companyResult?.company_id) {
        localStorage.setItem(
          "metricsflow_company_id",
          companyResult.company_id,
        );
      }

      if (companyResult?.company_name) {
        localStorage.setItem("metricsflow_company", companyResult.company_name);
      }

      localStorage.setItem(
        "metricsflow_role",
        companyResult?.role ||
          (registrationType === "create_company" ? "owner" : "collaborator"),
      );

      /*
       * Limpa o contexto temporário.
       */
      sessionStorage.removeItem("metricsflow_registration");

      console.log("🎉 ONBOARDING FINALIZADO");
      console.log("🏢 Company ID:", companyResult?.company_id);
      console.log("🔐 Role:", companyResult?.role);

      router.push("/dashboard");
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
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */
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

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <OnboardingLayout>
      {currentStep <= totalSteps && (
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-xs leading-relaxed text-red-300">{error}</p>
        </div>
      )}

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
              registrationType={registrationType}
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
        <div className="mt-8 flex items-center justify-between border-t border-surface-border/60 pt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="
              flex cursor-pointer items-center gap-2
              rounded-xl border border-transparent
              px-4 py-2.5
              text-xs text-slate-400
              transition-all
              hover:border-surface-border
              hover:text-white
              disabled:cursor-default
              disabled:opacity-0
            "
          >
            <ArrowLeft size={14} />
            Voltar
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="
              group flex cursor-pointer items-center gap-2
              rounded-xl
              bg-brand-600
              px-6 py-2.5
              text-xs font-semibold text-white
              shadow-lg shadow-brand-600/25
              transition-all
              hover:bg-brand-500
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <span>
              {currentStep === totalSteps ? "Finalizar" : "Continuar"}
            </span>

            <ArrowRight
              size={14}
              className="
                transition-transform
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      )}
    </OnboardingLayout>
  );
}
