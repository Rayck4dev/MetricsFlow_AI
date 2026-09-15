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
      className={`relative flex h-[395px] w-[340px] items-start justify-center ${className}`}
    >
      <div
        className="
    pointer-events-none
    absolute
    left-1/2
    top-1/2
    h-[88%]
    w-[82%]
    -translate-x-1/2
    -translate-y-1/2
    rounded-[45%]
    bg-emerald-400/[0.11]
    blur-[85px]
  "
      />

      <motion.div
        initial={{
          y: 22,
          rotate: 7,
          opacity: 0,
        }}
        animate={{
          y: [0, -6, 0],
          rotate: [7, 6.3, 7],
          opacity: 1,
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: {
            duration: 0.7,
            ease: "easeOut",
          },
        }}
        className="relative z-10"
      >
        <div className="relative w-[235px]">
          <div className="pointer-events-none absolute -inset-2 rounded-[44px] bg-gradient-to-br from-emerald-400/20 via-cyan-400/10 to-transparent blur-xl" />

          <div className="relative rounded-[43px] border-[5px] border-[#334155] bg-[#020617] p-[5px] shadow-[0_35px_90px_-25px_rgba(0,0,0,.95)]">
            <div className="absolute -left-[8px] top-[86px] h-7 w-[3px] rounded-l-sm bg-slate-600" />

            <div className="absolute -left-[8px] top-[122px] h-10 w-[3px] rounded-l-sm bg-slate-600" />

            <div className="absolute -left-[8px] top-[172px] h-9 w-[3px] rounded-l-sm bg-slate-600" />

            <div className="absolute -right-[8px] top-[125px] h-14 w-[3px] rounded-r-sm bg-slate-600" />

            <div className="relative overflow-hidden rounded-[37px] bg-[#071923]">
              <div className="aspect-[0.515]">
                <WhatsAppConversation messages={messages} isTyping={isTyping} />
              </div>

              <div className="pointer-events-none absolute left-0 right-0 top-0 z-[90] flex items-center justify-between px-5 pt-[7px] text-[7px] font-semibold text-white">
                <span>10:25</span>

                <div className="flex items-center gap-1.5">
                  <Wifi size={7} />

                  <span className="text-[6px]">5G</span>

                  <BatteryMedium size={10} />
                </div>
              </div>

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-[6px]
                  z-[100]
                  h-[17px]
                  w-[78px]
                  -translate-x-1/2
                  rounded-full
                  bg-black
                "
              >
                <span className="absolute right-2.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#081119] ring-1 ring-white/5" />
              </div>

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-[70]
                  rounded-[37px]
                  bg-gradient-to-br
                  from-white/[0.055]
                  via-transparent
                  to-transparent
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-[10%]
                  top-0
                  z-[71]
                  h-full
                  w-[25%]
                  -rotate-[10deg]
                  bg-white/[0.018]
                  blur-md
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-[6px]
                  left-1/2
                  z-[110]
                  h-[3px]
                  w-[62px]
                  -translate-x-1/2
                  rounded-full
                  bg-white/45
                "
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          opacity: [0.18, 0.35, 0.18],
          scale: [0.92, 1, 0.92],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-5 left-1/2 h-12 w-36 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl"
      />
    </div>
  );
}
