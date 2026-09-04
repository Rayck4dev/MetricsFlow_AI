export type UserRole = "owner" | "collaborator" | null;

export interface UserData {
  id: string;
  name: string;
  email: string;
  companyId: string | null;
  companyName: string;
  role: UserRole;
}
