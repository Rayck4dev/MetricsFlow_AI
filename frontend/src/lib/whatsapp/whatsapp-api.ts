import { ConfirmTransactionResponse } from "@/hooks/whatsapp/useWhatsAppDemo";
import { createClient } from "@/lib/supabase/client";
import type { DemoResponse, WhatsAppConnection } from "@/types/whatsapp";

function getApiUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL não está configurada no frontend.");
  }

  return baseUrl.replace(/\/$/, "");
}

async function getAccessToken() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Não foi possível recuperar a sessão.");
  }

  if (!session?.access_token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  return session.access_token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";

  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : typeof body === "object" &&
            body !== null &&
            "error" in body &&
            typeof body.error === "string"
          ? body.error
          : "Não foi possível concluir a operação.";

    throw new Error(message);
  }

  return body as T;
}

export async function processWhatsAppDemo(text: string): Promise<DemoResponse> {
  return request<DemoResponse>("/whatsapp/demo", {
    method: "POST",
    body: JSON.stringify({
      text,
      clientTimestamp: new Date().toISOString(),
    }),
  });
}
export async function processWhatsAppAudioDemo(
  audioBlob: Blob,
): Promise<DemoResponse> {
  const formData = new FormData();
  formData.append("file", audioBlob, "whatsapp-demo.webm");
  formData.append("clientTimestamp", new Date().toISOString());

  return request<DemoResponse>("/whatsapp/demo/audio", {
    method: "POST",
    body: formData,
  });
}

export async function confirmWhatsAppTransaction(body: {
  parsed: unknown;
  rawText: string;
}): Promise<ConfirmTransactionResponse> {
  return request<ConfirmTransactionResponse>("/whatsapp/confirm", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getWhatsAppConnection() {
  return request<WhatsAppConnection>("/whatsapp/connection", {
    method: "GET",
  });
}
