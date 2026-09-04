import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

import type { UserData, UserRole } from "@/types/user";

import { getOrCreateProfile } from "@/services/user/profile-service";
import { getUserCompanyMembership } from "@/services/user/company-membership-service";

function getMetadataName(user: User) {
  const metadata = user.user_metadata ?? {};

  if (typeof metadata.full_name === "string") {
    return metadata.full_name.trim();
  }

  if (typeof metadata.name === "string") {
    return metadata.name.trim();
  }

  return "";
}

function normalizeRole(role: unknown): UserRole {
  if (role === "owner" || role === "collaborator") {
    return role;
  }

  return null;
}

export async function getCurrentUser(): Promise<UserData | null> {
  const supabase = createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    if (authError.name === "AuthSessionMissingError") {
      return null;
    }

    throw authError;
  }

  if (!authUser) {
    return null;
  }

  const profile = await getOrCreateProfile(authUser);

  const membership = await getUserCompanyMembership(authUser.id);

  const company = membership?.companies;

  const companyData = Array.isArray(company) ? company[0] : company;

  const metadataName = getMetadataName(authUser);

  return {
    id: authUser.id,

    name:
      profile?.name?.trim() ||
      metadataName ||
      authUser.email?.split("@")[0] ||
      "Usuário",

    email: profile?.email?.trim() || authUser.email || "",

    companyId: membership?.company_id ?? null,

    companyName: companyData?.name?.trim() || "Empresa",

    role: normalizeRole(membership?.role),
  };
}
