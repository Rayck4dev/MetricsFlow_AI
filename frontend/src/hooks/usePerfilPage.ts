"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePerfilActions } from "./perfil-page/usePerfilActions";
import { usePerfilData } from "./perfil-page/usePerfilData";

export function usePerfilPage() {
  const supabase = createClient();
  const data = usePerfilData(supabase);
  const { loadProfile } = data;
  const actions = usePerfilActions({
    supabase,
    user: data.user,
    setUser: data.setUser,
    setError: data.setError,
  });

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    user: data.user,
    companyName: data.companyName,
    loading: data.loading,
    error: data.error,
    loadProfile,
    handleUpdateProfile: actions.handleUpdateProfile,
    handleChangePassword: actions.handleChangePassword,
    handleManageSessions: actions.handleManageSessions,
  };
}
