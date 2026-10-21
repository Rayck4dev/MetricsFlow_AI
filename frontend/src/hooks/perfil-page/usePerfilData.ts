import { useCallback, useState } from "react";

import type { PerfilUser } from "@/components/perfil/Perfil";
import { createClient } from "@/lib/supabase/client";

import { getAuthProvider } from "./getAuthProvider";

type SupabaseClient = ReturnType<typeof createClient>;

export function usePerfilData(supabase: SupabaseClient) {
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
      if (authError) throw authError;
      if (!authUser) throw new Error("Usuário não autenticado.");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(`id, name, email, phone`)
        .eq("id", authUser.id)
        .maybeSingle();
      if (profileError) throw profileError;

      const { data: membership, error: membershipError } = await supabase
        .from("company_members")
        .select(`company_id, role, companies ( id, name )`)
        .eq("user_id", authUser.id)
        .limit(1)
        .maybeSingle();
      if (membershipError) throw membershipError;

      const company = Array.isArray(membership?.companies)
        ? membership.companies[0]
        : membership?.companies;
      const email = profile?.email?.trim() || authUser.email || "";
      const role =
        membership?.role === "owner" ? "Administrador" : "Colaborador";
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
        authProvider: getAuthProvider(authUser),
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

  return {
    user,
    setUser,
    companyName,
    loading,
    error,
    setError,
    loadProfile,
  };
}
