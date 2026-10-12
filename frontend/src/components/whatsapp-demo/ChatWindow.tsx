"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, BadgeCheck, MoreVertical, Search } from "lucide-react";
import type { DemoConversation, DemoMessage } from "@/types/whatsapp-demo";
import type { RecordedAudio } from "@/hooks/whatsapp/useAudioRecorder";
import { DOODLE_BG } from "@/lib/whatsapp-demo/doodle";
import { BotAvatar, FakeAvatar } from "./BotAvatar";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";

type Props = {
  conversation: DemoConversation;
  messages: DemoMessage[];
  message: string;
  onMessageChange: (v: string) => void;
  onSend: () => void;
  onSendAudio: (audio: RecordedAudio) => void;
  onQuickReply: (text: string) => void;
  onError: (message: string) => void;
  onBack: () => void;
  typing?: boolean;
  notice?: string | null;
  mobile?: boolean;
};

const FAKE_BLOCKS: [number, boolean][] = [
  [200, false],
  [320, true],
  [150, false],
  [260, false],
  [340, true],
  [180, false],
];

const iconBtn =
  "flex h-10 w-10 items-center justify-center rounded-full text-[#c8cfd1] hover:bg-white/[0.07]";

export function ChatWindow({
  conversation,
  messages,
  message,
  onMessageChange,
  onSend,
  onSendAudio,
  onQuickReply,
  onError,
  onBack,
  typing = false,
  notice,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const isBot = !!conversation.isBot;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typing, conversation.id]);

  return (
    <section className="relative flex min-w-0 flex-1 flex-col bg-[#0b0d0d]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{ backgroundImage: DOODLE_BG }}
      />

      <header className="z-10 flex h-[59px] shrink-0 items-center gap-3.5 border-b border-white/[0.07] bg-[#161717] px-4">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className={`${iconBtn} -ml-2 md:hidden`}
        >
          <ArrowLeft size={22} />
        </button>
        {isBot ? (
          <BotAvatar size={40} />
        ) : (
          <FakeAvatar hue={conversation.hue} size={40} />
        )}
        <div className="min-w-0 flex-1">
          <div
            className={`flex items-center gap-1.5 text-base ${isBot ? "" : "select-none blur-[5px]"}`}
          >
            <span className="truncate">{conversation.name}</span>
            {isBot && (
              <BadgeCheck size={16} className="shrink-0 text-[#21c063]" />
            )}
          </div>
          {isBot && (
            <div className="text-[13px] text-[#8f9a9d]">
              {typing ? "digitando..." : "online"}
            </div>
          )}
        </div>
        <button aria-label="Pesquisar" className={iconBtn}>
          <Search size={21} />
        </button>
        <button aria-label="Menu" className={iconBtn}>
          <MoreVertical size={21} />
        </button>
      </header>

      <div className="relative z-[1] flex flex-1 flex-col overflow-y-auto px-[4%] pb-2 pt-3 md:px-[7%] [scrollbar-color:#3a3d3d_transparent] [scrollbar-width:thin]">
        {isBot ? (
          <>
            <span className="mb-2.5 mt-3 self-center rounded-lg bg-[#1d2020] px-3 py-1.5 text-[12.5px] text-[#a4aeb0] shadow">
              Hoje
            </span>
            <span className="mb-2 max-w-[540px] self-center rounded-lg bg-[#2b2a1d] px-3 py-2 text-center text-[12.5px] text-[#e6cf8f] shadow">
              Demonstração: não conecta à Meta. As mensagens são processadas e
              salvas na sua conta; áudios são enviados à OpenAI para
              transcrição. Confirme apenas dados de demonstração.
            </span>
            {messages.map((m, i) => (
              <MessageBubble
                key={m.id}
                message={m}
                first={messages[i - 1]?.mine !== m.mine}
                onQuickReply={onQuickReply}
              />
            ))}
            {typing && (
              <div className="mt-2.5 flex w-fit gap-1 self-start rounded-lg rounded-tl-none bg-[#1f2323] px-3.5 py-3">
                {[0, 150, 300].map((d) => (
                  <i
                    key={d}
                    className="h-[7px] w-[7px] animate-bounce rounded-full bg-[#8f9a9d]"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          FAKE_BLOCKS.map(([w, mine], i) => (
            <div
              key={i}
              className={`mt-2 h-[52px] rounded-lg blur-[6px] ${mine ? "self-end bg-[#144d37]" : "self-start bg-[#1f2323]"}`}
              style={{ width: w }}
            />
          ))
        )}
        <div ref={endRef} />
      </div>

      {notice && (
        <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-[#e9edef] px-4 py-2 text-sm text-[#111] shadow-lg">
          {notice}
        </div>
      )}

      <Composer
        value={message}
        onChange={onMessageChange}
        onSend={onSend}
        onSendAudio={onSendAudio}
        onError={onError}
        disabled={!isBot}
      />
    </section>
  );
}
