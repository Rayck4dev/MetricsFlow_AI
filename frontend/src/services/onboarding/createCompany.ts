import { createClient } from "@/lib/supabase/client";

export interface CreateCompanyResult {
  success: boolean;
  message?: string;
  company_id: string;
  company_name?: string | null;
  role?: string;
}

export async function createCompanyForCurrentUser(
  companyName: string,
): Promise<CreateCompanyResult> {
  const normalizedName = companyName.trim();

  if (!normalizedName) {
    throw new Error("O nome da empresa não foi informado.");
  }

  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "create_company_for_current_user",
    {
      company_name_input: normalizedName,
    },
  );

  if (error) {
    console.error("❌ Erro no RPC create_company_for_current_user:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(error.message || "Não foi possível criar a empresa.");
  }

  if (!data?.success) {
    throw new Error(data?.message || "Não foi possível criar sua empresa.");
  }

  if (!data.company_id) {
    throw new Error(
      "A empresa foi criada, mas o ID da empresa não foi retornado.",
    );
  }

  return {
    success: true,
    message: data.message,
    company_id: data.company_id,
    company_name: data.company_name ?? normalizedName,
    role: data.role ?? "owner",
  };
}
