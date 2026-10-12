import { apiClient } from "@/services/api";

export interface ApiCompany {
  id: string;
  name: string;
  document?: string | null;
  phone_number?: string | null;
  invite_code?: string;
  role?: "owner" | "collaborator";
  created_at?: string;
}

export interface ApiCompanyMember {
  id: string;
  company_id: string;
  user_id: string;
  role: "owner" | "collaborator";
  created_at?: string;
}

export interface CreateCompanyDto {
  name: string;
  document?: string;
  phone_number?: string;
}

export const companiesService = {
  async listUserCompanies(): Promise<ApiCompany[]> {
    return apiClient.get<ApiCompany[]>("/companies");
  },

  async createCompany(dto: CreateCompanyDto): Promise<ApiCompany> {
    return apiClient.post<ApiCompany>("/companies", dto);
  },

  async listCompanyMembers(companyId: string): Promise<ApiCompanyMember[]> {
    return apiClient.get<ApiCompanyMember[]>(`/companies/${companyId}/members`);
  },
};
