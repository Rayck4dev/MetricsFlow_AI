export type RegistrationType = "create_company" | "join_company";

export interface RegistrationData {
  type?: RegistrationType | "google";
  companyName?: string;
  inviteCode?: string;
}

export interface OnboardingFormData {
  goal: string;
  controlMethod: string;
  mainChallenge: string;
  selectedMetrics: string[];
  frequency: string;
}
