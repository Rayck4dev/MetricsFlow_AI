"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, MoreVertical, Paperclip } from "lucide-react";

import type { ConversationMessage } from "@/hooks/whatsapp/useWhatsAppConversation";

interface WhatsAppConversationProps {
  messages: ConversationMessage[];
  isTyping: boolean;
}

export function WhatsAppConversation({
  messages,
  isTyping,
}: WhatsAppConversationProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#efeae2]">
      <PhoneHeader />

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(0,0,0,.045) 1px, transparent 1px)",
              backgroundSize: "15px 15px",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col px-2.5 py-3">
          <div className="flex shrink-0 justify-center">
            <span className="rounded-md bg-[#dceff7] px-2 py-0.5 text-[6px] font-semibold text-[#667781] shadow-sm">
              HOJE
            </span>
          </div>

          <div className="mt-2.5 min-h-0 flex-1 overflow-hidden">
            <div className="flex flex-col gap-1.5">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </AnimatePresence>

              <AnimatePresence>{isTyping && <TypingBubble />}</AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <PhoneInput />
    </div>
  );
}

function PhoneHeader() {
  return (
    <div className="relative z-10 flex h-[60px] shrink-0 items-center gap-2 bg-[#075e54] px-2.5 pt-[10px] text-white">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[6px] font-bold">
        MF
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 mt-1 ">
          <span className="truncate text-[8px] font-bold leading-none">
            MetricsFlow
          </span>

          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#25d366]" />
        </div>

        <span className="mt-1 block text-[5.5px] leading-none text-white/60">
          online
        </span>
      </div>

      <MoreVertical size={10} className="shrink-0" />
    </div>
  );
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 6,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[88%] rounded-[9px] px-2 py-1.5 shadow-sm ${
          isUser ? "rounded-tr-[2px] bg-[#d9fdd3]" : "rounded-tl-[2px] bg-white"
        }`}
      >
        <p className="whitespace-pre-line pr-5 text-[6.5px] leading-[1.45] text-[#1f2c34]">
          {message.text}
        </p>

        <div className="mt-0.5 flex items-center justify-end gap-0.5">
          <span className="text-[5px] text-[#667781]">{message.time}</span>

          {isUser && (
            <CheckCheck size={7} className="text-[#53bdeb]" strokeWidth={2.5} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 5,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 2,
      }}
      className="flex justify-start"
    >
      <div className="rounded-[9px] rounded-tl-[2px] bg-white px-2 py-1.5 shadow-sm">
        <div className="flex items-center gap-0.5">
          <TypingDot delay={0} />
          <TypingDot delay={0.15} />
          <TypingDot delay={0.3} />
        </div>
      </div>
    </motion.div>
  );
}

function TypingDot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{
        opacity: [0.3, 1, 0.3],
        y: [0, -1.5, 0],
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        delay,
      }}
      className="h-1 w-1 rounded-full bg-[#8696a0]"
    />
  );
}

function PhoneInput() {
  return (
    <div className="relative z-10 flex h-[31px] shrink-0 items-center gap-1.5 bg-[#f0f2f5] px-2.5 py-1.5 ml-2">
      <div className="flex h-5 min-w-0 flex-1 items-center gap-1 rounded-full bg-white px-2">
        <Paperclip size={6} className="shrink-0 text-[#8696a0]" />

        <span className="truncate text-[6px] text-[#8696a0]">Mensagem</span>
      </div>

      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25d366] m-2">
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3 fill-white"
          aria-hidden="true"
        >
          <path d="M3.4 20.6 21 12 3.4 3.4l2.2 7.1 8.5 1.5-2.2 7.1Z" />
        </svg>
      </div>
    </div>
  );
}
