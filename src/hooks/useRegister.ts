"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export type RegistrationType = "create_company" | "join_company";

interface UseRegisterReturn {
  name: string;
  company: string;
  inviteCode: string;
  email: string;
  password: string;

  acceptedTerms: boolean;

  loading: boolean;
  googleLoading: boolean;
  error: string;

  setName: (value: string) => void;
  setCompany: (value: string) => void;
  setInviteCode: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setAcceptedTerms: (value: boolean) => void;

  registrationType: RegistrationType;

  handleRegistrationTypeChange: (type: RegistrationType) => void;

  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;

  handleGoogleRegister: () => Promise<void>;
}

export function useRegister(): UseRegisterReturn {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("create_company");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  function handleRegistrationTypeChange(type: RegistrationType) {
    setRegistrationType(type);
    setError("");

    if (type === "create_company") {
      setInviteCode("");
    } else {
      setCompany("");
    }
  }

  function validateForm(): string | null {
    if (!name.trim()) {
      return "Informe seu nome.";
    }

    if (!email.trim()) {
      return "Informe seu e-mail.";
    }

    if (password.length < 6) {
      return "A senha deve possuir pelo menos 6 caracteres.";
    }

    if (registrationType === "create_company" && !company.trim()) {
      return "Informe o nome da empresa.";
    }

    if (registrationType === "join_company" && !inviteCode.trim()) {
      return "Informe o código de convite da empresa.";
    }

    if (!acceptedTerms) {
      return "Você precisa aceitar os termos de uso e a política de privacidade.";
    }

    return null;
  }

  function saveRegistrationData(
    type: RegistrationType | "google",
    options?: {
      companyName?: string;
      inviteCode?: string;
    },
  ) {
    sessionStorage.setItem(
      "metricsflow_registration",
      JSON.stringify({
        type,

        companyName: options?.companyName ?? "",

        inviteCode: options?.inviteCode ?? "",
      }),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const normalizedInviteCode =
        registrationType === "join_company"
          ? inviteCode.trim().toUpperCase()
          : "";

      const companyName =
        registrationType === "create_company" ? company.trim() : "";

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,

        options: {
          data: {
            full_name: name.trim(),

            registration_type: registrationType,

            company_name: companyName || null,

            invite_code: normalizedInviteCode || null,
          },
        },
      });

      if (signUpError) {
        console.error("❌ Erro no cadastro:", signUpError);

        setError(getRegistrationErrorMessage(signUpError));

        return;
      }

      if (!data.user) {
        setError("O cadastro não criou o usuário.");

        return;
      }

      saveRegistrationData(registrationType, {
        companyName,
        inviteCode: normalizedInviteCode,
      });

      if (!data.session) {
        window.location.href = "/login?registered=true";

        return;
      }

      window.location.href = "/onboarding";
    } catch (err) {
      console.error("💥 Erro inesperado no cadastro:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro inesperado no cadastro.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setGoogleLoading(true);
    setError("");

    try {
      saveRegistrationData("google");

      const supabase = createClient();

      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (googleError) {
        throw googleError;
      }
    } catch (err) {
      console.error("❌ Erro Google:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível continuar com o Google.",
      );

      setGoogleLoading(false);
    }
  }

  return {
    name,
    company,
    inviteCode,
    email,
    password,

    acceptedTerms,

    loading,
    googleLoading,
    error,

    setName,
    setCompany,
    setInviteCode,
    setEmail,
    setPassword,
    setAcceptedTerms,

    registrationType,

    handleRegistrationTypeChange,

    handleSubmit,
    handleGoogleRegister,
  };
}

function getRegistrationErrorMessage(error: { message?: string }): string {
  const message = error.message?.trim();

  if (!message) {
    return "Não foi possível criar sua conta.";
  }

  if (message.toLowerCase().includes("user already registered")) {
    return "Este e-mail já está cadastrado.";
  }

  if (message.toLowerCase().includes("password should be at least")) {
    return "A senha deve possuir pelo menos 6 caracteres.";
  }

  if (message.toLowerCase().includes("invalid email")) {
    return "Informe um e-mail válido.";
  }

  return message;
}
