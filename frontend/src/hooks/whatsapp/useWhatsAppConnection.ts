"use client";

import { useCallback, useEffect, useState } from "react";

import { getWhatsAppConnection } from "@/lib/whatsapp/whatsapp-api";
import type { WhatsAppConnection } from "@/types/whatsapp";

export function useWhatsAppConnection() {
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConnection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const body = await getWhatsAppConnection();

      const raw =
        body && typeof body === "object" && "connection" in body
          ? body.connection
          : body;

      if (!raw || typeof raw !== "object" || !("id" in raw)) {
        setConnection(null);
        return;
      }

      const item = raw as Record<string, unknown>;

      setConnection({
        id: String(item.id),
        phoneNumber: String(item.phone_number ?? item.phoneNumber ?? ""),
        status: (item.status as WhatsAppConnection["status"]) ?? "pending",
        userId:
          typeof item.user_id === "string"
            ? item.user_id
            : typeof item.userId === "string"
              ? item.userId
              : null,
        companyId:
          typeof item.company_id === "string"
            ? item.company_id
            : typeof item.companyId === "string"
              ? item.companyId
              : null,
        verifiedAt:
          typeof item.verified_at === "string"
            ? item.verified_at
            : typeof item.verifiedAt === "string"
              ? item.verifiedAt
              : null,
        createdAt:
          typeof item.created_at === "string"
            ? item.created_at
            : typeof item.createdAt === "string"
              ? item.createdAt
              : null,
        updatedAt:
          typeof item.updated_at === "string"
            ? item.updated_at
            : typeof item.updatedAt === "string"
              ? item.updatedAt
              : null,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível carregar a conexão do WhatsApp.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConnection();
  }, [loadConnection]);

  return {
    connection,
    loading,
    error,
    reload: loadConnection,
  };
}
