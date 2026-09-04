"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function useResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setHasRecoverySession(true);
        } else {
          setError(
            "O link de recuperação é inválido ou expirou. Solicite um novo link.",
          );
        }
      } catch (error) {
        console.error("Erro ao verificar sessão de recuperação:", error);

        setError("Não foi possível validar o link de recuperação.");
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setHasRecoverySession(true);
        setError("");
        setCheckingSession(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function resetPassword() {
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return false;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error("Erro ao atualizar senha:", error);

        setError(error.message || "Não foi possível atualizar sua senha.");

        return false;
      }

      setSuccess(true);

      return true;
    } catch (error) {
      console.error("Erro inesperado ao atualizar senha:", error);

      setError("Ocorreu um erro inesperado. Tente novamente.");

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    password,
    setPassword,

    confirmPassword,
    setConfirmPassword,

    loading,
    checkingSession,

    success,
    error,

    hasRecoverySession,

    resetPassword,
  };
}
