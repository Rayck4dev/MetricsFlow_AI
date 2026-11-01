import { createClient } from "@/lib/supabase/client";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  auth?: boolean;
}

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const cleanUrl = url.replace(/\/$/, "");
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
}

async function getAuthToken(): Promise<string | null> {
  try {
    const supabase = createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    const expiresAt = session.expires_at;
    if (expiresAt && expiresAt * 1000 - Date.now() < 30_000) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (refreshed?.session?.access_token) {
        return refreshed.session.access_token;
      }
    }

    return session.access_token;
  } catch {
    return null;
  }
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  const baseUrl = getBaseUrl();
  let normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath.startsWith("/api/")) {
    normalizedPath = normalizedPath.slice(4);
  }
  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

async function request<T>(
  path: string,
  method: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const {
    params,
    headers: customHeaders,
    timeoutMs = 30_000,
    auth = true,
    signal: userSignal,
    ...restOptions
  } = options;

  const url = buildUrl(path, params);
  const headers = new Headers(customHeaders);

  if (auth) {
    const token = await getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined && body !== null) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("Accept", "application/json");
    requestBody = JSON.stringify(body);
  } else {
    headers.set("Accept", "application/json");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (userSignal) {
    userSignal.addEventListener("abort", () => controller.abort());
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
      signal: controller.signal,
      ...restOptions,
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const contentType = response.headers.get("content-type") || "";
    let data: unknown;

    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorObj = typeof data === "object" && data !== null ? data : {};
      const message =
        "message" in errorObj && typeof errorObj.message === "string"
          ? errorObj.message
          : Array.isArray((errorObj as { message?: unknown }).message)
            ? (errorObj as { message: string[] }).message.join(", ")
            : "error" in errorObj && typeof errorObj.error === "string"
              ? errorObj.error
              : typeof data === "string" && data.trim().length > 0
                ? data
                : `Erro na requisição (${response.status})`;

      throw new ApiError(message, response.status, data);
    }

    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Tempo de requisição esgotado.", 408);
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        `Não foi possível acessar a API em ${new URL(url).origin}. Verifique se o backend está ativo e se o CORS permite a origem deste frontend.`,
        0,
      );
    }

    throw new ApiError(
      error instanceof Error
        ? error.message
        : "Erro de conexão com o servidor.",
      0,
    );
  }
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, "GET", undefined, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, "POST", body, options);
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, "PATCH", body, options);
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, "DELETE", undefined, options);
  },

  postFormData<T>(
    path: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>(path, "POST", formData, options);
  },
};
