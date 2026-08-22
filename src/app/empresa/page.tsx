"use client";

import { Empresa } from "@/components/empresa/Empresa";
import type { EmpresaMember } from "@/components/empresa/EmpresaMembers";
import { Sidebar } from "@/components/layout/Sidebar";

const mockCompany = {
  id: "company-001",
  name: "Minha Empresa MEI",
  document: "12.345.678/0001-90",
  phoneNumber: "(11) 99999-9999",
  inviteCode: "A9X2B7",
};

const mockMembers: EmpresaMember[] = [
  {
    id: "user-001",
    name: "Raycka",
    email: "raycka@email.com",
    role: "owner",
    status: "active",
  },
  {
    id: "user-002",
    name: "Emily",
    email: "emily@email.com",
    role: "collaborator",
    status: "active",
  },
  {
    id: "user-003",
    name: "Ana Luiza",
    email: "ana@email.com",
    role: "collaborator",
    status: "active",
  },
];

export default function EmpresaPage() {
  async function handleUpdateCompany(values: {
    name: string;
    document: string;
    phoneNumber: string;
  }) {
    console.log("Atualizar empresa:", values);

    /*
     * Backend futuramente:
     *
     * await updateCompany(values)
     */
  }

  async function handleRegenerateInvite() {
    console.log("Regenerar código de convite");

    /*
     * Backend futuramente:
     *
     * await regenerateInviteCode()
     */
  }

  async function handleRemoveMember(member: EmpresaMember) {
    console.log("Remover membro:", member);

    /*
     * Backend futuramente:
     *
     * await removeCompanyMember(member.id)
     */
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName="Carlos" companyName="Carlos Design" />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
            <Empresa
              company={mockCompany}
              members={mockMembers}
              currentUserId="user-001"
              onUpdateCompany={handleUpdateCompany}
              onRegenerateInvite={handleRegenerateInvite}
              onRemoveMember={handleRemoveMember}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
