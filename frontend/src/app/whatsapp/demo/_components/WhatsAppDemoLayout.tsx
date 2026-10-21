"use client";

import { BarChart3, CircleDashed, MessageCircle, Phone, Users } from "lucide-react";
import type { DemoMessage, DemoConversation } from "@/types/whatsapp-demo";
import type { RecordedAudio } from "@/hooks/whatsapp/useAudioRecorder";
import { ChatList } from "@/components/whatsapp-demo/ChatList";
import { ChatWindow } from "@/components/whatsapp-demo/ChatWindow";

interface WhatsAppDemoLayoutProps {
  conversations: DemoConversation[]; activeChatId: number; search: string; onSearchChange: (value: string) => void;
  onSelectChat: (id: number) => void; mobileChatOpen: boolean; activeConversation: DemoConversation; messages: DemoMessage[];
  message: string; onMessageChange: (value: string) => void; onSendMessage: () => void; onSendAudio: (audio: RecordedAudio) => void;
  onQuickReply: (text: string) => void; onError: (message: string) => void; onMobileBack: () => void; isTyping: boolean; notice: string | null;
}

export function WhatsAppDemoLayout({ conversations, activeChatId, search, onSearchChange, onSelectChat, mobileChatOpen, activeConversation, messages, message, onMessageChange, onSendMessage, onSendAudio, onQuickReply, onError, onMobileBack, isTyping, notice }: WhatsAppDemoLayoutProps) {
  return (
<main className="h-[100dvh] w-screen overflow-hidden bg-[#161717] text-[#e9edef] fixed inset-0">
      <div className="mx-auto flex h-full w-full max-w-[1680px]">
        <aside className="hidden w-16 shrink-0 flex-col items-center gap-1.5 border-r border-white/[0.07] bg-[#161717] py-3 md:flex">
          <NavIcon active label="Conversas">
            <MessageCircle size={22} />
          </NavIcon>

          <NavIcon label="Ligações">
            <Phone size={21} />
          </NavIcon>

          <NavIcon label="Status">
            <CircleDashed size={22} />
          </NavIcon>

          <NavIcon label="Comunidades">
            <Users size={22} />
          </NavIcon>

          <a
            href="/dashboard"
            title="Voltar a MetricsFlow AI"
            className="mt-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#21c063]/15 text-[#21c063] hover:bg-[#21c063]/25"
          >
            <BarChart3 size={21} />
          </a>
        </aside>

        <div
          className={`h-full shrink-0 w-full md:w-[345px] lg:w-[380px] ${
            mobileChatOpen ? "hidden md:flex" : "flex"
          }`}
        >
          <ChatList
            conversations={conversations}
            activeId={activeChatId}
            search={search}
            onSearch={onSearchChange}
            onSelect={onSelectChat}
          />
        </div>

        <div
          className={`h-full min-h-0 min-w-0 flex-1 ${
            mobileChatOpen ? "flex" : "hidden md:flex"
          }`}
        >
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            message={message}
          onMessageChange={onMessageChange}
            onSend={onSendMessage}
            onSendAudio={onSendAudio}
            onQuickReply={onQuickReply}
            onError={onError}
            onBack={onMobileBack}
            typing={isTyping}
            notice={notice}
          />
        </div>
      </div>
    </main>
  );
}

function NavIcon({
  children,
  active = false,
  label,
}: {
  children: React.ReactNode;
  active?: boolean;
  label: string;
}) {
  return (
    <div
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full ${
        active
          ? "bg-[#2b2d2d] text-[#e9edef]"
          : "text-[#c8cfd1] hover:bg-[#202222]"
      }`}
    >
      {children}
    </div>
  );
}
