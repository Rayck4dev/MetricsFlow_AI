import { createClient } from "@/lib/supabase/client";

export interface JoinCompanyResult {
  success: boolean;
  message?: string;
  company_id: string;
  company_name?: string | null;
  role?: string;
}

export async function joinCompanyByCode(
  code: string,
): Promise<JoinCompanyResult> {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    throw new Error("O código de convite não foi informado.");
  }

  const supabase = createClient();

  const { data, error } = await supabase.rpc("join_company_by_code", {
    code_input: normalizedCode,
  });

  if (error) {
    console.error("❌ Erro no RPC join_company_by_code:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(error.message || "Não foi possível entrar na empresa.");
  }

  if (!data?.success) {
    throw new Error(data?.message || "Não foi possível entrar na empresa.");
  }

  if (!data.company_id) {
    throw new Error(
      "A empresa foi encontrada, mas o ID da empresa não foi retornado.",
    );
  }

  return {
    success: true,
    message: data.message,
    company_id: data.company_id,
    company_name: data.company_name ?? null,
    role: data.role ?? "collaborator",
  };
}
