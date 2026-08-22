"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Perfil, type PerfilUser } from "@/components/perfil/Perfil";

const mockUser: PerfilUser = {
  id: "mock-user-001",
  name: "Carlos",
  email: "carlos@metricsflow.com",
  phone: "(11) 99999-0000",
  role: "Administrador",
  avatarUrl: null,
  authProvider: "google",
};

export default function PerfilPage() {
  async function handleUpdateProfile(values: {
    name: string;
    email: string;
    phone: string;
  }) {
    /*
     * MOCK
     *
     * Futuramente:
     * updateProfile() → Supabase
     */
    console.log("Atualizar perfil:", values);
  }

  function handleChangePassword() {
    console.log("Alterar senha");
  }

  function handleManageSessions() {
    console.log("Gerenciar sessões");
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName="Carlos" companyName="Carlos Design" />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
            <Perfil
              user={mockUser}
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
