"use client";

import { useCallback, useEffect, useState } from "react";

import type { PerfilUser } from "@/components/perfil/Perfil";

import { createClient } from "@/lib/supabase/client";

export function usePerfilPage() {
  const supabase = createClient();

  const [user, setUser] = useState<PerfilUser | null>(null);
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!authUser) {
        throw new Error("Usuário não autenticado.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          `
            id,
            name,
            email,
            phone
          `,
        )
        .eq("id", authUser.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      const { data: membership, error: membershipError } = await supabase
        .from("company_members")
        .select(
          `
            company_id,
            role,
            companies (
              id,
              name
            )
          `,
        )
        .eq("user_id", authUser.id)
        .limit(1)
        .maybeSingle();

      if (membershipError) {
        throw membershipError;
      }

      const company = Array.isArray(membership?.companies)
        ? membership.companies[0]
        : membership?.companies;

      const email = profile?.email?.trim() || authUser.email || "";

      const role =
        membership?.role === "owner" ? "Administrador" : "Colaborador";

      const authProvider = getAuthProvider(authUser);

      const avatarUrl =
        typeof authUser.user_metadata?.avatar_url === "string"
          ? authUser.user_metadata.avatar_url
          : typeof authUser.user_metadata?.picture === "string"
            ? authUser.user_metadata.picture
            : null;

      const profileUser: PerfilUser = {
        id: authUser.id,

        name:
          profile?.name?.trim() ||
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          "Usuário",

        email,

        phone: typeof profile?.phone === "string" ? profile.phone : "",

        role,

        avatarUrl,

        authProvider,

        createdAt: authUser.created_at ?? null,
      };

      setUser(profileUser);
      setCompanyName(company?.name?.trim() || "Empresa");
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar seu perfil.",
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleUpdateProfile(values: {
    name: string;
    email: string;
    phone: string;
  }) {
    if (!user) {
      return;
    }

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

      if (profileError) {
        throw profileError;
      }

      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        });

        if (emailError) {
          throw emailError;
        }
      }

      setUser((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          name,
          email,
          phone,
        };
      });
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o perfil.",
      );

      throw err;
    }
  }

  async function handleChangePassword(password?: string) {
    if (!password) {
      throw new Error("Informe uma nova senha.");
    }

    try {
      setError(null);

      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });

      if (passwordError) {
        throw passwordError;
      }
    } catch (err) {
      console.error("Erro ao alterar senha:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível alterar sua senha.",
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

      if (signOutError) {
        throw signOutError;
      }
    } catch (err) {
      console.error("Erro ao gerenciar sessões:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível gerenciar as sessões.",
      );
    }
  }

  return {
    user,
    companyName,
    loading,
    error,

    loadProfile,
    handleUpdateProfile,
    handleChangePassword,
    handleManageSessions,
  };
}

function getAuthProvider(user: {
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
}): "google" | "email" {
  const provider = user.app_metadata?.provider;

  if (provider === "google") {
    return "google";
  }

  return "email";
}
