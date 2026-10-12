"use client";

import { motion } from "framer-motion";
import { BatteryMedium, Wifi } from "lucide-react";

import { useWhatsAppConversation } from "@/hooks/whatsapp/useWhatsAppConversation";
import { WhatsAppConversation } from "./WhatsAppConversation";

interface WhatsAppPhoneMockupProps {
  className?: string;
}

export function WhatsAppPhoneMockup({
  className = "",
}: WhatsAppPhoneMockupProps) {
  const { messages, isTyping } = useWhatsAppConversation();

  return (
    <div
      className={`relative flex h-[370px] w-[285px] items-center justify-center sm:h-[405px] sm:w-[310px] ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, rotate: 3 }}
        animate={{ opacity: 1, y: [0, -5, 0], rotate: 3 }}
        transition={{
          opacity: { duration: 0.6 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.6 },
        }}
        className="relative z-10"
      >
        <div className="pointer-events-none absolute -inset-3 rounded-[46px] bg-gradient-to-br from-emerald-400/20 via-cyan-400/[0.08] to-transparent blur-xl" />

        <div className="relative w-[222px] rounded-[39px] border-[5px] border-[#344454] bg-[#020811] p-[5px] shadow-[0_35px_90px_-25px_rgba(0,0,0,0.9)] sm:w-[235px]">
          <div className="absolute -left-[8px] top-20 h-7 w-[3px] rounded-l bg-slate-600" />
          <div className="absolute -left-[8px] top-32 h-10 w-[3px] rounded-l bg-slate-600" />
          <div className="absolute -right-[8px] top-28 h-12 w-[3px] rounded-r bg-slate-600" />

          <div className="relative overflow-hidden rounded-[31px] bg-[#071923]">
            <div className="aspect-[0.515]">
              <WhatsAppConversation messages={messages} isTyping={isTyping} />
            </div>

            <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 pt-[7px] text-[7px] font-semibold text-white">
              <span>10:25</span>
              <div className="flex items-center gap-1.5">
                <Wifi size={8} />
                <span className="text-[6px]">5G</span>
                <BatteryMedium size={10} />
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-[5px] z-40 h-[17px] w-[76px] -translate-x-1/2 rounded-full bg-black">
              <span className="absolute right-2.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#081119] ring-1 ring-white/5" />
            </div>

            <div className="pointer-events-none absolute inset-0 z-20 rounded-[31px] bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

            <div className="pointer-events-none absolute bottom-[6px] left-1/2 z-40 h-[3px] w-[62px] -translate-x-1/2 rounded-full bg-white/45" />
          </div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 h-10 w-36 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
    </div>
  );
}
