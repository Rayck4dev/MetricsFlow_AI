import { createClient } from "@/lib/supabase/client";

export interface UserCompanyResult {
  companyId: string | null;
}

export async function getUserCompany(): Promise<UserCompanyResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Sua sessão não foi encontrada. Faça login novamente.");
  }

  const { data, error } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return {
    companyId: data?.company_id ?? null,
  };
}
