"use client";

import { useState } from "react";
import type { RegistrationType } from "./register/types";
import { useRegisterActions } from "./register/useRegisterActions";

export type { RegistrationType } from "./register/types";

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

  const actions = useRegisterActions({
    name,
    company,
    inviteCode,
    email,
    password,
    acceptedTerms,
    registrationType,
    setError,
    setLoading,
    setGoogleLoading,
  });

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
    handleSubmit: actions.handleSubmit,
    handleGoogleRegister: actions.handleGoogleRegister,
  };
}
