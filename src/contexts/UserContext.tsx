"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { createClient } from "@/lib/supabase/client";

interface UserData {
  id: string;
  name: string;
  email: string;
  companyId: string | null;
  companyName: string;
  role: string | null;
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

  const supabase = createClient();

  async function loadUser() {
    try {
      setLoading(true);

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        setUser(null);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", authUser.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
      }

      const { data: membership, error: membershipError } = await supabase
        .from("company_members")
        .select(
          `
          company_id,
          role,
          companies (
            name
          )
        `,
        )
        .eq("user_id", authUser.id)
        .limit(1)
        .maybeSingle();

      if (membershipError) {
        console.error("Erro ao buscar empresa:", membershipError);
      }

      const company = membership?.companies as
        | { name: string }
        | { name: string }[]
        | null;

      const companyName = Array.isArray(company)
        ? company[0]?.name
        : company?.name;

      setUser({
        id: authUser.id,
        name:
          profile?.name?.trim() ||
          authUser.user_metadata?.name?.trim() ||
          "Usuário",
        email: profile?.email || authUser.email || "",
        companyId: membership?.company_id ?? null,
        companyName: companyName?.trim() || "Empresa",
        role: membership?.role ?? null,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        loadUser();
      }
    });

    return () => {
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
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }

  return context;
}
