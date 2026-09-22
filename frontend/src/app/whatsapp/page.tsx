"use client";

import type { FormEvent } from "react";

import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { WhatsAppChat } from "@/components/whatsapp/WhatsAppChat";
import { WhatsAppHeader } from "@/components/whatsapp/WhatsAppHeader";
import { WhatsAppResultPanel } from "@/components/whatsapp/WhatsAppResultPanel";

import { useUser } from "@/contexts/UserContext";
import { useWhatsAppConnection } from "@/hooks/whatsapp/useWhatsAppConnection";
import { useWhatsAppDemo } from "@/hooks/whatsapp/useWhatsAppDemo";

import { WHATSAPP_EXAMPLES } from "@/utils/whatsapp";

export default function WhatsAppPage() {
  const { user } = useUser();

  const whatsapp = useWhatsAppDemo();
  const connection = useWhatsAppConnection();

  function handleSubmit(event: FormEvent) {
    void whatsapp.submitMessage(event);
  }

  const whatsappConnected = connection.connection?.status === "verified";

  return (
    <div className="min-h-screen bg-[#031321] text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={user?.name} companyName={user?.companyName} />

        <main className="relative min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
              className="
                absolute
                -right-[140px]
                -top-[120px]
                h-[650px]
                w-[650px]
                rounded-full
                bg-cyan-400/[0.035]
                blur-[120px]
              "
            />

            <div
              className="
                absolute
                right-[9%]
                top-[20px]
                h-[460px]
                w-[460px]
                rounded-full
                bg-emerald-400/[0.045]
                blur-[105px]
              "
            />

            <div
              className="
                absolute
                right-[18%]
                top-[125px]
                h-[300px]
                w-[300px]
                rounded-full
                bg-emerald-300/[0.04]
                blur-[95px]
              "
            />

            <motion.div
              animate={{
                x: [0, 28, 0],
                opacity: [0.035, 0.085, 0.035],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                -right-[180px]
                top-[360px]
                h-px
                w-[900px]
                rotate-[-8deg]
                bg-gradient-to-r
                from-transparent
                via-emerald-400/30
                to-transparent
              "
            />

            <motion.div
              animate={{
                x: [0, -22, 0],
                opacity: [0.025, 0.065, 0.025],
              }}
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                -right-[200px]
                top-[425px]
                h-px
                w-[980px]
                rotate-[-6deg]
                bg-gradient-to-r
                from-transparent
                via-cyan-400/20
                to-transparent
              "
            />

            <div
              className="
                absolute
                -right-[160px]
                top-[365px]
                h-[220px]
                w-[760px]
                rotate-[-9deg]
                rounded-[50%]
                border
                border-emerald-400/[0.035]
              "
            />

            <div
              className="
                absolute
                -right-[220px]
                top-[395px]
                h-[300px]
                w-[950px]
                rotate-[-7deg]
                rounded-[50%]
                border
                border-cyan-400/[0.018]
              "
            />
          </div>
          <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col px-4 pb-8 pt-20 sm:px-6 sm:pb-8 lg:h-screen lg:min-h-0 lg:px-8 lg:pb-0 lg:pt-0">
            <WhatsAppHeader
              whatsappConnected={whatsappConnected}
              phoneNumber={connection.connection?.phoneNumber}
            />

            <section className="pb-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
              <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="min-h-[360px] lg:min-h-0">
                  <WhatsAppChat
                    text={whatsapp.text}
                    result={whatsapp.result}
                    loading={whatsapp.loading}
                    examples={WHATSAPP_EXAMPLES}
                    onTextChange={whatsapp.setText}
                    onSubmit={handleSubmit}
                    onUseExample={whatsapp.useExample}
                  />
                </div>

                <div className="min-h-[360px] lg:min-h-0">
                  <WhatsAppResultPanel
                    result={whatsapp.result}
                    canConfirm={whatsapp.canConfirm}
                    confidence={whatsapp.confidence}
                    confirming={whatsapp.confirming}
                    success={whatsapp.success}
                    onConfirm={() => void whatsapp.confirmTransaction()}
                    onReset={whatsapp.reset}
                  />
                </div>
              </div>

              {(whatsapp.error || whatsapp.success) && (
                <div className="mt-2 shrink-0">
                  {whatsapp.error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-400/10 bg-rose-400/[0.05] px-3 py-2 text-[10px] text-rose-300">
                      <MessageCircle size={12} className="shrink-0" />

                      <span className="truncate">{whatsapp.error}</span>
                    </div>
                  )}

                  {whatsapp.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-2 text-[10px] text-emerald-300">
                      <CheckCircle2 size={12} className="shrink-0" />

                      <span className="truncate">{whatsapp.success}</span>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}



