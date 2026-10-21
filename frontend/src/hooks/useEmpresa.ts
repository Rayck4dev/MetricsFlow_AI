"use client";

import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import { useCompanyRole } from "@/hooks/useCompanyRole";

import { useEmpresaActions } from "./empresa/useEmpresaActions";
import { useEmpresaData } from "./empresa/useEmpresaData";

export type { Company } from "./empresa/types";

export function useEmpresa() {
  const supabase = createClient();
  const { role, loading: roleLoading } = useCompanyRole();
  const data = useEmpresaData(supabase);
  const { loadCompanyData } = data;
  const actions = useEmpresaActions({
    supabase,
    role,
    company: data.company,
    setCompany: data.setCompany,
    currentUserId: data.currentUserId,
    setMembers: data.setMembers,
  });

  useEffect(() => {
    if (roleLoading || role !== "collaborator") return;
    window.location.replace("/dashboard");
  }, [role, roleLoading]);

  useEffect(() => {
    if (roleLoading || role === "collaborator") return;
    loadCompanyData();
  }, [loadCompanyData, role, roleLoading]);

  return {
    userName: data.userName,
    company: data.company,
    members: data.members,
    currentUserId: data.currentUserId,
    loading: data.loading,
    roleLoading,
    errorMessage: data.errorMessage,
    role,
    loadCompanyData,
    handleUpdateCompany: actions.handleUpdateCompany,
    handleRegenerateInvite: actions.handleRegenerateInvite,
    handleRemoveMember: actions.handleRemoveMember,
  };
}
