"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function useLogin() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError(
          loginError.message === "Invalid login credentials"
            ? "E-mail ou senha incorretos."
            : loginError.message,
        );

        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro inesperado ao entrar:", error);

      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (googleError) {
        console.error("Erro ao entrar com Google:", googleError);

        setError("Não foi possível entrar com o Google.");
      }
    } catch (error) {
      console.error("Erro inesperado ao entrar com Google:", error);

      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setGoogleLoading(false);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((current) => !current);
  }

  function clearError() {
    if (error) {
      setError("");
    }
  }

  return {
    email,
    password,

    setEmail,
    setPassword,

    showPassword,
    togglePasswordVisibility,

    loading,
    googleLoading,

    error,
    setError,
    clearError,

    handleSubmit,
    handleGoogleLogin,
  };
}
