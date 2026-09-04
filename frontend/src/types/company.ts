export interface JoinCompanyResult {
  success: boolean;
  message?: string;
  company_id?: string;
  company_name?: string | null;
  role?: string;
}
