"use client";

import { useCallback, useEffect, useState } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Perfil, type PerfilUser } from "@/components/perfil/Perfil";

import { createClient } from "@/lib/supabase/client";

export default function PerfilPage() {
  const supabase = createClient();

  const [user, setUser] = useState<PerfilUser | null>(null);
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      /*
       * =========================================================
       * USUÁRIO AUTENTICADO
       * =========================================================
       */

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

      /*
       * =========================================================
       * PERFIL
       * =========================================================
       */

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

      /*
       * =========================================================
       * EMPRESA / MEMBRO
       * =========================================================
       */

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

      /*
       * =========================================================
       * EMPRESA
       * =========================================================
       */

      const company = Array.isArray(membership?.companies)
        ? membership.companies[0]
        : membership?.companies;

      /*
       * =========================================================
       * DADOS DO USUÁRIO
       * =========================================================
       */

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

      /*
       * =========================================================
       * NOME DA EMPRESA
       * =========================================================
       */

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

  /*
   * =========================================================
   * CARREGAMENTO INICIAL
   * =========================================================
   */

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /*
   * =========================================================
   * ATUALIZAR PERFIL
   * =========================================================
   */

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

      /*
       * ---------------------------------------------------------
       * Atualiza dados da tabela profiles
       * ---------------------------------------------------------
       */

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

      /*
       * ---------------------------------------------------------
       * Atualiza o e-mail do Supabase Auth caso tenha mudado
       * ---------------------------------------------------------
       */

      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        });

        if (emailError) {
          throw emailError;
        }
      }

      /*
       * ---------------------------------------------------------
       * Atualiza o estado local
       * ---------------------------------------------------------
       */

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

  /*
   * =========================================================
   * ALTERAR SENHA
   * =========================================================
   */

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

  /*
   * =========================================================
   * GERENCIAR SESSÕES
   * =========================================================
   */

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

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar userName="Usuário" companyName="Carregando..." />

          <main className="min-w-0 flex-1">
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-brand-400" />

                <p className="mt-4 text-xs text-slate-500">
                  Carregando perfil...
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * ERRO / USUÁRIO NÃO ENCONTRADO
   * =========================================================
   */

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar
            userName="Usuário"
            companyName={companyName || "Empresa"}
          />

          <main className="min-w-0 flex-1">
            <div className="flex min-h-screen items-center justify-center p-5">
              <div className="w-full max-w-md rounded-2xl border border-red-500/10 bg-surface-panel p-6 text-center">
                <p className="text-sm font-bold text-white">
                  Não foi possível carregar o perfil
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {error ?? "Usuário não encontrado."}
                </p>

                <button
                  type="button"
                  onClick={loadProfile}
                  className="mt-5 rounded-xl border border-brand-500/20 bg-brand-500/10 px-4 py-2.5 text-[10px] font-bold text-brand-300 transition-colors hover:bg-brand-500/20"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * PERFIL
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          userName={user.name}
          companyName={companyName || "Empresa"}
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3">
                <p className="text-[10px] font-medium text-red-400">{error}</p>
              </div>
            )}

            <Perfil
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
              onManageSessions={handleManageSessions}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * PROVEDOR DE AUTENTICAÇÃO
 * =========================================================
 */

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
