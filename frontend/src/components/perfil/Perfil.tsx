"use client";

import { PerfilForm } from "./PerfilForm";
import { PerfilSecurity } from "./PerfilSecurity";
import { PerfilAccountInfo, PerfilOverview } from "./PerfilOverview";

export interface PerfilUser {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  avatarUrl?: string | null;
  authProvider?: "google" | "email";
  createdAt?: string;
}

export interface PerfilProps {
  user?: PerfilUser;
  initialValues?: PerfilUser;
  userName?: string;
  companyName?: string;
  onUpdateProfile?: (values: {
    name: string;
    email: string;
    phone: string;
  }) => void | Promise<void>;
  onSubmit?: (values: {
    name: string;
    email: string;
    phone: string;
  }) => void | Promise<void>;
  onChangePassword?: (password: string) => void | Promise<void>;
  onManageSessions?: () => void | Promise<void>;
}

export function Perfil({
  user,
  initialValues,
  userName,
  onUpdateProfile,
  onSubmit,
  onChangePassword,
  onManageSessions,
}: PerfilProps) {
  const profileData = user ?? initialValues ?? {
    name: userName ?? "",
    email: "",
    phone: "",
  };
  const handleSave = onUpdateProfile ?? onSubmit;
  const authProvider =
    user?.authProvider ?? initialValues?.authProvider ?? "email";

  return (
    <div className="space-y-6">
      <PerfilOverview
        userName={profileData.name}
        email={profileData.email}
        role={user?.role}
        avatarUrl={profileData.avatarUrl}
      />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
        <div className="space-y-5">
          <PerfilForm initialValues={profileData} onSubmit={handleSave} />
          <PerfilAccountInfo
            authProvider={authProvider}
            createdAt={user?.createdAt}
          />
        </div>
        <PerfilSecurity
          authProvider={authProvider}
          onChangePassword={onChangePassword}
          onManageSessions={onManageSessions}
        />
      </div>
    </div>
  );
}
