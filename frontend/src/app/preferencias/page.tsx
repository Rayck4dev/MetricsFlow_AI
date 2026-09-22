"use client";

import { useEffect, useState } from "react";

import { Preferencias } from "@/components/preferencias/Preferencias";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/client";
import { useCompanyRole } from "@/hooks/useCompanyRole";

export default function PreferenciasPage() {
  const supabase = createClient();
  const { role, loading: roleLoading } = useCompanyRole();

  const [userName, setUserName] = useState("Usuário");
  const [companyName, setCompanyName] = useState("Empresa");

  useEffect(() => {
    if (roleLoading || !role) return;

    async function loadUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
        }

        if (profile?.name?.trim()) {
          setUserName(profile.name.trim());
        }

        const { data: membership, error: membershipError } = await supabase
          .from("company_members")
          .select(
            `
            company_id,
            companies (
              id,
              name
            )
          `,
          )
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (membershipError) {
          console.error("Erro ao buscar empresa:", membershipError);
          return;
        }

        const company = Array.isArray(membership?.companies)
          ? membership.companies[0]
          : membership?.companies;

        if (company?.name?.trim()) {
          setCompanyName(company.name.trim());
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }

    loadUserData();
  }, [role, roleLoading, supabase]);

  if (roleLoading || !role) {
    return <div className="min-h-screen bg-surface-main" />;
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={userName} companyName={companyName} />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] px-4 pb-4 pt-20 sm:px-6 sm:pb-6 lg:p-8">
            <Preferencias />
          </div>
        </main>
      </div>
    </div>
  );
}

