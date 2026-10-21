import type { Dispatch, SetStateAction } from "react";

import type { EmpresaMember } from "@/components/empresa/EmpresaMembers";
import { createClient } from "@/lib/supabase/client";

import type { Company } from "./types";

type SupabaseClient = ReturnType<typeof createClient>;

interface UseEmpresaActionsOptions {
  supabase: SupabaseClient;
  role: string | null;
  company: Company | null;
  setCompany: Dispatch<SetStateAction<Company | null>>;
  currentUserId: string;
  setMembers: Dispatch<SetStateAction<EmpresaMember[]>>;
}

export function useEmpresaActions({
  supabase,
  role,
  company,
  setCompany,
  currentUserId,
  setMembers,
}: UseEmpresaActionsOptions) {
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
    if (!company?.id) throw new Error("Empresa não encontrada.");

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
    if (!company?.id) throw new Error("Empresa não encontrada.");

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
      current ? { ...current, inviteCode: data.invite_code } : current,
    );
  }

  async function handleRemoveMember(member: EmpresaMember) {
    if (role !== "owner") {
      throw new Error("Somente o proprietário pode remover colaboradores.");
    }
    if (!company?.id) throw new Error("Empresa não encontrada.");
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

  return {
    handleUpdateCompany,
    handleRegenerateInvite,
    handleRemoveMember,
  };
}
