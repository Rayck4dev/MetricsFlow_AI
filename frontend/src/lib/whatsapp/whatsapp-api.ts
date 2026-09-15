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

  if (options.body && !headers.has("Content-Type")) {
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
    }),
  });
}

export async function confirmWhatsAppTransaction(body: {
  parsed: unknown;
  rawText: string;
}): Promise<{ transactionId: string }> {
  return request<{ transactionId: string }>("/whatsapp/confirm", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getWhatsAppConnection() {
  return request("/whatsapp/connection", {
    method: "GET",
  });
}
