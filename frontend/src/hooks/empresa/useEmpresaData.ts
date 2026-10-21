import { useCallback, useState } from "react";

import type { EmpresaMember } from "@/components/empresa/EmpresaMembers";
import { createClient } from "@/lib/supabase/client";

import type { Company, Profile } from "./types";

type SupabaseClient = ReturnType<typeof createClient>;

export function useEmpresaData(supabase: SupabaseClient) {
  const [userName, setUserName] = useState("");
  const [company, setCompany] = useState<Company | null>(null);
  const [members, setMembers] = useState<EmpresaMember[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCompanyData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Erro ao obter usuário:", userError);
        setErrorMessage("Não foi possível identificar sua conta.");
        return;
      }
      if (!user) {
        setErrorMessage("Usuário não autenticado.");
        return;
      }

      setCurrentUserId(user.id);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) console.error("Erro ao buscar perfil:", profileError);
      setUserName(profile?.name?.trim() || user.email?.split("@")[0] || "");

      const { data: membership, error: membershipError } = await supabase
        .from("company_members")
        .select("company_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (membershipError) {
        console.error("Erro ao buscar vínculo com empresa:", membershipError);
        setErrorMessage("Não foi possível localizar sua empresa.");
        return;
      }
      if (!membership?.company_id) {
        setCompany(null);
        setMembers([]);
        return;
      }

      const companyId = membership.company_id;
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id, name, document, phone_number, invite_code")
        .eq("id", companyId)
        .maybeSingle();

      if (companyError) {
        console.error("Erro ao buscar empresa:", companyError);
        setErrorMessage("Não foi possível carregar os dados da empresa.");
        return;
      }
      if (!companyData) {
        setCompany(null);
        setMembers([]);
        return;
      }

      setCompany({
        id: companyData.id,
        name: companyData.name,
        document: companyData.document,
        phoneNumber: companyData.phone_number,
        inviteCode: companyData.invite_code,
      });

      const { data: memberRows, error: membersError } = await supabase
        .from("company_members")
        .select("id, user_id, role")
        .eq("company_id", companyId)
        .order("created_at", { ascending: true });

      if (membersError) {
        console.error("Erro ao buscar membros:", membersError);
        setMembers([]);
        return;
      }
      if (!memberRows || memberRows.length === 0) {
        setMembers([]);
        return;
      }

      const userIds = memberRows.map(
        (member: { user_id: string }) => member.user_id,
      );
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", userIds);

      if (profilesError) {
        console.error("Erro ao buscar perfis dos membros:", profilesError);
      }

      const profileMap = new Map<string, Profile>();
      (profiles ?? []).forEach((item: Profile) =>
        profileMap.set(item.id, item),
      );
      const formattedMembers: EmpresaMember[] = memberRows.map(
        (member: { user_id: string; role: EmpresaMember["role"] }) => {
          const memberProfile = profileMap.get(member.user_id);
          return {
            id: member.user_id,
            name: memberProfile?.name?.trim() || "",
            email: memberProfile?.email?.trim() || "",
            role: member.role,
            status: "active",
          };
        },
      );
      setMembers(formattedMembers);
    } catch (error) {
      console.error("Erro inesperado ao carregar empresa:", error);
      setErrorMessage("Ocorreu um erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    userName,
    company,
    setCompany,
    members,
    setMembers,
    currentUserId,
    loading,
    errorMessage,
    loadCompanyData,
  };
}
