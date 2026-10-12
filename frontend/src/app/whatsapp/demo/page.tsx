"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  CircleDashed,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import type { DemoMessage, DemoConversation } from "@/types/whatsapp-demo";
import type { RecordedAudio } from "@/hooks/whatsapp/useAudioRecorder";
import { ChatList } from "@/components/whatsapp-demo/ChatList";
import { ChatWindow } from "@/components/whatsapp-demo/ChatWindow";
import {
  getDemoMessages,
  sendAudioToBot,
  sendTextToBot,
} from "@/lib/whatsapp-demo/api";

const BOT_ID = 1;

const initialConversations: DemoConversation[] = [
  {
    id: BOT_ID,
    name: "MetricsFlow AI",
    preview: "Assistente financeiro",
    time: "",
    unread: 0,
    isBot: true,
    hue: 145,
  },
];

type BackendMessage = {
  id: string | number;
  mine?: boolean;
  direction?: "inbound" | "outbound";
  messageType?: "text" | "audio";
  message_type?: "text" | "audio";
  message_text?: string | null;
  transcription?: string | null;
  text?: string | null;
  createdAt?: string;
  created_at?: string;
  time?: string;
  status?: "sent" | "delivered" | "read";
};

function toDemoMessage(item: BackendMessage, index: number): DemoMessage {
  const timestamp = item.createdAt ?? item.created_at;
  const date = timestamp ? new Date(timestamp) : null;

  const time =
    item.time ??
    (date && !Number.isNaN(date.getTime())
      ? date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "");

  return {
    id: index + 1,
    mine: item.mine ?? item.direction === "inbound",
    messageType: item.messageType ?? item.message_type,
    time,
    text: item.message_text ?? item.transcription ?? item.text ?? "",
    status: item.status,
  };
}

export default function WhatsAppDemoPage() {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [activeChat, setActiveChat] = useState(BOT_ID);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [companyName, setCompanyName] = useState("MetricsFlow AI");

  const [welcomeMessage, setWelcomeMessage] = useState(
    "Oi! 👋 Sou o assistente financeiro da MetricsFlow AI. Posso ajudar a registrar receitas e despesas do seu negócio. Por exemplo: 'Recebi R$ 350 por uma venda via Pix'. Vamos registrar sua próxima movimentação?",
  );

  const requestRef = useRef(false);
  const noticeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const optimisticIdRef = useRef(-1);

  const showNotice = useCallback((text: string) => {
    setNotice(text);

    if (noticeTimeoutRef.current) {
      clearTimeout(noticeTimeoutRef.current);
    }

    noticeTimeoutRef.current = setTimeout(() => {
      setNotice(null);
      noticeTimeoutRef.current = null;
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) {
        clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const history = await getDemoMessages();

      const serverMessages = (history.messages ?? []).map((item, index) =>
        toDemoMessage(item, index),
      );

      setMessages((currentMessages) => {
        // Preserva mensagens locais que ainda não apareceram no histórico
        // retornado pelo backend.
        const serverTexts = new Set(
          serverMessages.map(
            (item) => `${item.mine ? "user" : "bot"}:${item.text}`,
          ),
        );

        const pendingMessages = currentMessages.filter(
          (item) =>
            item.id < 0 &&
            !serverTexts.has(`${item.mine ? "user" : "bot"}:${item.text}`),
        );

        return [...serverMessages, ...pendingMessages];
      });

      if (history.company?.name) {
        setCompanyName(history.company.name);
      }

      if (history.welcomeMessage) {
        setWelcomeMessage(history.welcomeMessage);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico do WhatsApp:", error);

      showNotice(
        error instanceof Error
          ? `Erro ao carregar histórico: ${error.message}`
          : "Não foi possível carregar o histórico.",
      );
    } finally {
      setLoadingHistory(false);
    }
  }, [showNotice]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const demoConversations = useMemo<DemoConversation[]>(
    () =>
      initialConversations.map((conversation) => ({
        ...conversation,
        name: companyName,
        preview:
          messages.length > 0
            ? messages[messages.length - 1].text || "Mensagem recebida"
            : welcomeMessage,
        time: messages[messages.length - 1]?.time ?? "",
      })),
    [companyName, messages, welcomeMessage],
  );

  const filteredConversations = useMemo(
    () =>
      demoConversations.filter((conversation) =>
        conversation.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [demoConversations, search],
  );

  const activeConversation =
    demoConversations.find((conversation) => conversation.id === activeChat) ??
    demoConversations[0];

  async function askBot(request: () => Promise<string>) {
    if (requestRef.current) return;

    requestRef.current = true;
    setTyping(true);

    try {
      await request();
      await loadHistory();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado.";

      showNotice(`Não foi possível enviar a mensagem. ${errorMessage}`);
    } finally {
      requestRef.current = false;
      setTyping(false);
    }
  }

  function sendMessage(text = message) {
    const value = text.trim();

    if (!value || activeChat !== BOT_ID || requestRef.current) {
      return;
    }

    const now = new Date();

    const optimisticMessage: DemoMessage = {
      id: optimisticIdRef.current--,
      mine: true,
      messageType: "text",
      time: now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: value,
      status: "sent",
    };

    // Exibe a mensagem imediatamente, sem esperar a API.
    setMessages((previous) => [...previous, optimisticMessage]);
    setMessage("");

    void askBot(() => sendTextToBot(value));
  }

  function sendAudio(audio: RecordedAudio) {
    if (activeChat !== BOT_ID || requestRef.current) {
      return;
    }

    void askBot(() => sendAudioToBot(audio.blob, audio.duration));
  }

  // A saudação permanece visível durante toda a conversa.
  const welcomeAsMessage: DemoMessage = {
    id: -1_000_000,
    mine: false,
    messageType: "text",
    time: "",
    text: welcomeMessage,
  };

  const displayedMessages = [
    welcomeAsMessage,
    ...messages.filter((item) => item.id !== -1_000_000),
  ];

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#161717] text-[#e9edef]">
      <div className="mx-auto flex h-full max-w-[1680px]">
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
          className={`h-full shrink-0 ${
            mobileChatOpen ? "hidden" : "flex"
          } w-full md:flex md:w-auto`}
        >
          <ChatList
            conversations={filteredConversations}
            activeId={activeChat}
            search={search}
            onSearch={setSearch}
            onSelect={(id) => {
              setActiveChat(id);
              setMobileChatOpen(true);
            }}
          />
        </div>

        <div
          className={`${
            mobileChatOpen ? "flex" : "hidden"
          } min-h-0 min-w-0 flex-1 md:flex`}
        >
          <ChatWindow
            conversation={activeConversation}
            messages={displayedMessages}
            message={message}
            onMessageChange={setMessage}
            onSend={() => sendMessage()}
            onSendAudio={sendAudio}
            onQuickReply={(text) => sendMessage(text)}
            onError={showNotice}
            onBack={() => setMobileChatOpen(false)}
            typing={typing && activeChat === BOT_ID}
            notice={loadingHistory ? "Carregando histórico..." : notice}
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
