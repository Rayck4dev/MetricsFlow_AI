import { apiClient } from "@/services/api";

export interface ApiCategory {
  id: string;
  company_id: string;
  name: string;
  type: "income" | "expense";
  color?: string | null;
  is_default?: boolean;
  sort_order?: number;
  created_at?: string;
}

export const categoriesService = {
  async listCategories(companyId: string): Promise<ApiCategory[]> {
    if (!companyId) {
      return [];
    }

    return apiClient.get<ApiCategory[]>("/categories", {
      params: { company_id: companyId },
    });
  },
};
