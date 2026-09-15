import {
  CheckCircle2,
  LoaderCircle,
  MessageCircle,
  Smartphone,
} from "lucide-react";

import type { WhatsAppConnection } from "@/types/whatsapp";
import { getWhatsAppStatusLabel } from "@/utils/whatsapp";

interface WhatsAppConnectionCardProps {
  connection: WhatsAppConnection | null;
  loading: boolean;
}

export function WhatsAppConnectionCard({
  connection,
  loading,
}: WhatsAppConnectionCardProps) {
  const verified = connection?.status === "verified";

  return (
    <section className="shrink-0 overflow-hidden rounded-[22px] border border-surface-border bg-[#061b2b]/95 shadow-lg shadow-black/10">
      <div className="flex flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300">
            <MessageCircle size={21} />

            <span className="absolute inset-0 rounded-2xl bg-emerald-400/[0.03] blur-md" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
              WhatsApp Business
            </p>

            <h2 className="mt-0.5 truncate text-sm font-semibold text-white">
              {loading
                ? "Carregando conexão..."
                : connection?.phoneNumber ||
                  "Número ainda não conectado"}
            </h2>

            <div className="mt-1 flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  verified
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.6)]"
                    : "bg-amber-400"
                }`}
              />

              <span className="text-[11px] text-slate-500">
                {loading
                  ? "Consultando status"
                  : connection
                    ? getWhatsAppStatusLabel(
                        connection.status,
                      )
                    : "Aguardando configuração"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-[#071f31] px-3 py-2 text-[11px] text-slate-500">
            <Smartphone size={13} />
            Business
          </div>

          {loading ? (
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-[#071f31] px-3 py-2 text-[11px] text-slate-500">
              <LoaderCircle
                size={13}
                className="animate-spin"
              />
              Carregando
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold ${
                verified
                  ? "border border-emerald-400/10 bg-emerald-400/[0.05] text-emerald-300"
                  : "border border-amber-400/10 bg-amber-400/[0.05] text-amber-300"
              }`}
            >
              <CheckCircle2 size={13} />

              {verified
                ? "Conectado"
                : "Configuração pendente"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}