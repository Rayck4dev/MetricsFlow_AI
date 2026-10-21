import type { Dispatch, SetStateAction } from "react";

import type { PerfilUser } from "@/components/perfil/Perfil";
import { createClient } from "@/lib/supabase/client";

type SupabaseClient = ReturnType<typeof createClient>;

interface UsePerfilActionsOptions {
  supabase: SupabaseClient;
  user: PerfilUser | null;
  setUser: Dispatch<SetStateAction<PerfilUser | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export function usePerfilActions({
  supabase,
  user,
  setUser,
  setError,
}: UsePerfilActionsOptions) {
  async function handleUpdateProfile(values: {
    name: string;
    email: string;
    phone: string;
  }) {
    if (!user) return;

    try {
      setError(null);
      const name = values.name.trim();
      const email = values.email.trim();
      const phone = values.phone.trim();

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name,
          email,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (profileError) throw profileError;

      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
      }

      setUser((current) => {
        if (!current) return current;
        return { ...current, name, email, phone };
      });
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possi­vel atualizar o perfil.",
      );
      throw err;
    }
  }

  async function handleChangePassword(password?: string) {
    if (!password) throw new Error("Informe uma nova senha.");

    try {
      setError(null);
      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });
      if (passwordError) throw passwordError;
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possi­vel alterar sua senha.",
      );
      throw err;
    }
  }

  async function handleManageSessions() {
    try {
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut({
        scope: "others",
      });
      if (signOutError) throw signOutError;
    } catch (err) {
      console.error("Erro ao gerenciar sessões:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possivel gerenciar as sessões.",
      );
    }
  }

  return { handleUpdateProfile, handleChangePassword, handleManageSessions };
}
