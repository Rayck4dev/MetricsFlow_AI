"use client";

import { useUser } from "@/contexts/UserContext";

export type CompanyRole = "owner" | "collaborator" | null;

export function useCompanyRole() {
  const { user, loading } = useUser();
  const role = (user?.role as CompanyRole) ?? null;

  return {
    role,
    loading,

    isOwner: role === "owner",
    isCollaborator: role === "collaborator",

    roleLoaded: !loading && role !== null,
  };
}
