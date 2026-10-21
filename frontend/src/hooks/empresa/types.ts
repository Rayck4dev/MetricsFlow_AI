export interface Company {
  id: string;
  name: string;
  document: string | null;
  phoneNumber: string | null;
  inviteCode: string | null;
}

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
}
