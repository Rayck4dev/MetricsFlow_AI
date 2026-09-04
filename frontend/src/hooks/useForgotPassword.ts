"use client";

import { FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const redirectTo = `${window.location.origin}/auth/callback?next=/redefinir-senha`;

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo,
        });

      if (resetError) {
        console.error("Erro ao solicitar recuperação:", resetError);

        setError(
          resetError.message ||
            "Não foi possível enviar o link de recuperação.",
        );

        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Erro inesperado na recuperação:", err);

      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    loading,
    success,
    error,
    handleSubmit,
  };
}