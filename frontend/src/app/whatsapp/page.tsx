"use client";

import { MessageCircle } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { WhatsAppHeader } from "@/components/whatsapp/WhatsAppHeader";
import { WhatsAppBenefits } from "./_components/WhatsAppBenefits";
import { WhatsAppDemoCallout } from "./_components/WhatsAppDemoCallout";

import { useUser } from "@/contexts/UserContext";
import { useWhatsAppConnection } from "@/hooks/whatsapp/useWhatsAppConnection";



export default function WhatsAppPage() {
  const { user } = useUser();
  const connection = useWhatsAppConnection();

  const whatsappConnected = connection.connection?.status === "verified";

  return (
    <div className="min-h-screen bg-[#031321] text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={user?.name} companyName={user?.companyName} />

        <main className="relative min-w-0 flex-1 overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-48 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-400/[0.045] blur-[130px]" />
            <div className="absolute -bottom-48 left-[15%] h-[420px] w-[420px] rounded-full bg-cyan-400/[0.025] blur-[120px]" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 pb-10 pt-20 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14 lg:pt-8 xl:px-10">
            <header className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-emerald-300">
                  <MessageCircle size={15} />
                  <span>METRICSFLOW / WHATSAPP</span>
                </div>

                <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Seu financeiro na conversa.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Uma forma mais simples de imaginar o registro de receitas e
                  despesas pelo WhatsApp.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.07] bg-[#061b2b]/80 px-3.5 py-2.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    connection.loading
                      ? "animate-pulse bg-amber-400"
                      : whatsappConnected
                        ? "bg-emerald-400"
                        : "bg-slate-600"
                  }`}
                />
                <span className="text-xs text-slate-400">
                  {connection.loading
                    ? "Verificando conexão"
                    : whatsappConnected
                      ? "WhatsApp Demo conectado"
                      : "Modo demonstrativo"}
                </span>
              </div>
            </header>

            <WhatsAppHeader
              whatsappConnected={whatsappConnected}
              phoneNumber={connection.connection?.phoneNumber}
            />

            <WhatsAppBenefits />

            <WhatsAppDemoCallout />

            <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.05] pt-5 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span>MetricsFlow AI · Gestão financeira simplificada</span>
              <span>
                Ambiente demonstrativo · Recursos sujeitos à implementação
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
