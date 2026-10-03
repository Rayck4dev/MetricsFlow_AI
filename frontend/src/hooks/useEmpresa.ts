"use client";

import { useCallback, useEffect, useState } from "react";

import type { EmpresaMember } from "@/components/empresa/EmpresaMembers";

import { createClient } from "@/lib/supabase/client";
import { useCompanyRole } from "@/hooks/useCompanyRole";

export interface Company {
  id: string;
  name: string;
  document: string | null;
  phoneNumber: string | null;
  inviteCode: string | null;
}

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
}

export function useEmpresa() {
  const supabase = createClient();

  const { role, loading: roleLoading } = useCompanyRole();

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

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
      }

      const currentUserName =
        profile?.name?.trim() || user.email?.split("@")[0] || "";

      setUserName(currentUserName);

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

      const formattedCompany: Company = {
        id: companyData.id,
        name: companyData.name,
        document: companyData.document,
        phoneNumber: companyData.phone_number,
        inviteCode: companyData.invite_code,
      };

      setCompany(formattedCompany);

      const { data: memberRows, error: membersError } = await supabase
        .from("company_members")
        .select("id, user_id, role")
        .eq("company_id", companyId)
        .order("created_at", {
          ascending: true,
        });

      if (membersError) {
        console.error("Erro ao buscar membros:", membersError);

        setMembers([]);
        return;
      }

      if (!memberRows || memberRows.length === 0) {
        setMembers([]);
        return;
      }

      const userIds = memberRows.map((member: any) => member.user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", userIds);

      if (profilesError) {
        console.error("Erro ao buscar perfis dos membros:", profilesError);
      }

      const profileMap = new Map<string, Profile>();

      (profiles ?? []).forEach((profile: Profile) => {
        profileMap.set(profile.id, profile);
      });

      const formattedMembers: EmpresaMember[] = memberRows.map((member: any) => {
        const profile = profileMap.get(member.user_id);

        return {
          id: member.user_id,
          name: profile?.name?.trim() || "",
          email: profile?.email?.trim() || "",
          role: member.role,
          status: "active",
        };
      });

      setMembers(formattedMembers);
    } catch (error) {
      console.error("Erro inesperado ao carregar empresa:", error);

      setErrorMessage("Ocorreu um erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  async function handleUpdateCompany(values: {
    name: string;
    document: string;
    phoneNumber: string;
  }) {
    if (role !== "owner") {
      throw new Error(
        "Somente o proprietário pode alterar os dados da empresa.",
      );
    }

    if (!company?.id) {
      throw new Error("Empresa não encontrada.");
    }

    const { data, error } = await supabase
      .from("companies")
      .update({
        name: values.name,
        document: values.document || null,
        phone_number: values.phoneNumber || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", company.id)
      .select("id, name, document, phone_number, invite_code")
      .single();

    if (error) {
      console.error("Erro ao atualizar empresa:", error);
      throw error;
    }

    setCompany({
      id: data.id,
      name: data.name,
      document: data.document,
      phoneNumber: data.phone_number,
      inviteCode: data.invite_code,
    });
  }

  async function handleRegenerateInvite() {
    if (role !== "owner") {
      throw new Error(
        "Somente o proprietário pode gerenciar o código de convite.",
      );
    }

    if (!company?.id) {
      throw new Error("Empresa não encontrada.");
    }

    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let newCode = "";

    for (let index = 0; index < 6; index++) {
      newCode += characters[Math.floor(Math.random() * characters.length)];
    }

    const { data, error } = await supabase
      .from("companies")
      .update({
        invite_code: newCode,
        updated_at: new Date().toISOString(),
      })
      .eq("id", company.id)
      .select("id, name, document, phone_number, invite_code")
      .single();

    if (error) {
      console.error("Erro ao regenerar código de convite:", error);
      throw error;
    }

    setCompany((current) =>
      current
        ? {
            ...current,
            inviteCode: data.invite_code,
          }
        : current,
    );
  }

  async function handleRemoveMember(member: EmpresaMember) {
    if (role !== "owner") {
      throw new Error("Somente o proprietário pode remover colaboradores.");
    }

    if (!company?.id) {
      throw new Error("Empresa não encontrada.");
    }

    if (member.id === currentUserId) {
      throw new Error("Você não pode remover a si mesmo.");
    }

    if (member.role === "owner") {
      throw new Error("O proprietário não pode ser removido.");
    }

    const { error } = await supabase
      .from("company_members")
      .delete()
      .eq("company_id", company.id)
      .eq("user_id", member.id);

    if (error) {
      console.error("Erro ao remover membro:", error);
      throw error;
    }

    setMembers((current) => current.filter((item) => item.id !== member.id));
  }

  useEffect(() => {
    if (roleLoading || role !== "collaborator") {
      return;
    }

    window.location.replace("/dashboard");
  }, [role, roleLoading]);

  useEffect(() => {
    if (roleLoading || role === "collaborator") {
      return;
    }

    loadCompanyData();
  }, [loadCompanyData, role, roleLoading]);

  return {
    userName,
    company,
    members,
    currentUserId,

    loading,
    roleLoading,
    errorMessage,
    role,

    loadCompanyData,

    handleUpdateCompany,
    handleRegenerateInvite,
    handleRemoveMember,
  };
}
