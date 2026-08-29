"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { createClient } from "@/lib/supabase/client";

export type UserRole = "owner" | "collaborator" | null;

interface UserData {
  id: string;
  name: string;
  email: string;
  companyId: string | null;
  companyName: string;
  role: UserRole;
}

interface UserContextValue {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const supabase = createClient();

    try {
      setLoading(true);

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        if (authError.name === "AuthSessionMissingError") {
          setUser(null);
          return;
        }

        console.error("Erro ao recuperar usuário:", authError);
        throw authError;
      }

      if (!authUser) {
        setUser(null);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, email, phone")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        throw profileError;
      }

      let currentProfile = profile;

      if (!currentProfile) {
        const metadata = authUser.user_metadata ?? {};

        const metadataName =
          typeof metadata.full_name === "string"
            ? metadata.full_name.trim()
            : typeof metadata.name === "string"
              ? metadata.name.trim()
              : "";

        const fallbackName =
          metadataName || authUser.email?.split("@")[0] || "Usuário";

        const { data: createdProfile, error: createProfileError } =
          await supabase
            .from("profiles")
            .upsert(
              {
                id: authUser.id,
                name: fallbackName,
                email: authUser.email ?? null,
              },
              {
                onConflict: "id",
              },
            )
            .select("id, name, email, phone")
            .single();

        if (createProfileError) {
          console.error("Erro ao criar perfil:", createProfileError);

          throw createProfileError;
        }

        currentProfile = createdProfile;
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
        console.error("Erro ao buscar empresa:", membershipError);

        throw membershipError;
      }

      const company = membership?.companies as
        | { id: string; name: string }
        | { id: string; name: string }[]
        | null
        | undefined;

      const companyData = Array.isArray(company) ? company[0] : company;

      const role: UserRole =
        membership?.role === "owner" || membership?.role === "collaborator"
          ? membership.role
          : null;

      const metadata = authUser.user_metadata ?? {};

      const metadataName =
        typeof metadata.full_name === "string"
          ? metadata.full_name.trim()
          : typeof metadata.name === "string"
            ? metadata.name.trim()
            : "";

      const normalizedUser: UserData = {
        id: authUser.id,

        name:
          currentProfile?.name?.trim() ||
          metadataName ||
          authUser.email?.split("@")[0] ||
          "Usuário",

        email: currentProfile?.email?.trim() || authUser.email || "",

        companyId: membership?.company_id ?? null,

        companyName: companyData?.name?.trim() || "Empresa",

        role,
      };

      setUser(normalizedUser);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      if (!mounted) return;

      await loadUser();
    }

    initialize();

    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED"
      ) {
        if (mounted) {
          loadUser();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refreshUser: loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro do UserProvider");
  }

  return context;
}
