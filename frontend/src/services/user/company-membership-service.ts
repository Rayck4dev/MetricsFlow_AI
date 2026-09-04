import { createClient } from "@/lib/supabase/client";

export interface CompanyMembership {
  company_id: string;
  role: "owner" | "collaborator" | string;
  companies:
    | {
        id: string;
        name: string;
      }
    | {
        id: string;
        name: string;
      }[]
    | null;
}

export async function getUserCompanyMembership(
  userId: string,
): Promise<CompanyMembership | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("company_members")
    .select(
      `
        company_id,
        role,
        companies (
          id,
          name
        )
      `,
    )
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as CompanyMembership | null;
}
