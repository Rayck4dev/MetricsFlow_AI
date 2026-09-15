import type { ParsedFinancialMessage } from "@/types/message";

export interface DemoResponse {
  ok: boolean;
  source: "text" | "audio";
  transcription: string | null;
  originalText: string;
  parsed: ParsedFinancialMessage;
  confirmation: string | null;
  mode: "openai" | "local-fallback";
}

export interface WhatsAppExample {
  label: string;
  text: string;
}

export type WhatsAppConnectionStatus = "pending" | "verified" | "disabled";

export interface WhatsAppConnection {
  id: string;
  phoneNumber: string;
  status: WhatsAppConnectionStatus;
  userId?: string | null;
  companyId?: string | null;
  verifiedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
