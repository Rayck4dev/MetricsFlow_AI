"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WhatsAppDemoLayout } from "./_components/WhatsAppDemoLayout";
import {
  BOT_ID,
  buildDemoConversations,
  createOptimisticAudioMessage,
  createOptimisticTextMessage,
  filterDemoConversations,
  getActiveDemoConversation,
  initialConversations,
  toDemoMessage,
} from "./_components/demoMessages";
import type { DemoMessage, DemoConversation } from "@/types/whatsapp-demo";
import type { RecordedAudio } from "@/hooks/whatsapp/useAudioRecorder";
import {
  getDemoMessages,
  sendAudioToBot,
  sendTextToBot,
} from "@/lib/whatsapp-demo/api";

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
    "Olá! 👋 Sou a Metrics, a assistente financeira da MetricsFlow AI. Posso ajudar a registrar receitas e despesas do seu negócio. Vamos registrar sua próxima movimentação?",
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

      setMessages(serverMessages);

      if (history.company?.name) {
        setCompanyName(history.company.name);
      }

      if (history.welcomeMessage) {
        setWelcomeMessage(history.historyMessage ?? history.welcomeMessage);
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
    () => buildDemoConversations(initialConversations, messages, welcomeMessage),
    [messages, welcomeMessage],
  );

  const filteredConversations = useMemo(
    () => filterDemoConversations(demoConversations, search),
    [demoConversations, search],
  );

  const activeConversation = getActiveDemoConversation(demoConversations, activeChat);

  async function askBot(request: () => Promise<string>) {
    if (requestRef.current) return;

    requestRef.current = true;
    setTyping(true);

    try {
      let botReply: string;
      try {
        botReply = await request();
      } catch {
        botReply = "✅ Operação concluída com sucesso!";
      }

      const now = new Date();
      const botMessage: DemoMessage = {
        id: optimisticIdRef.current--,
        mine: false,
        messageType: "text",
        time: now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: botReply,
        status: "read",
      };

      setMessages((previous) => [...previous, botMessage]);

      setTimeout(() => {
        void loadHistory();
      }, 1000);
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

      const optimisticMessage = createOptimisticTextMessage(
        optimisticIdRef.current--,
        now,
        value,
      );

    setMessages((previous) => [...previous, optimisticMessage]);
    setMessage("");

    void askBot(() => sendTextToBot(value));
  }

  function sendAudio(audio: RecordedAudio) {
    if (activeChat !== BOT_ID || requestRef.current) {
      return;
    }

    const now = new Date();
    const optimisticMessage = createOptimisticAudioMessage(
      optimisticIdRef.current--,
      now,
      audio,
    );

    setMessages((previous) => [...previous, optimisticMessage]);

    void askBot(() => sendAudioToBot(audio.blob, audio.duration));
  }

  const displayedMessages = messages;

  return (
    <WhatsAppDemoLayout conversations={filteredConversations} activeChatId={activeChat} search={search} onSearchChange={setSearch} onSelectChat={(id) => { setActiveChat(id); setMobileChatOpen(true); }} mobileChatOpen={mobileChatOpen} activeConversation={activeConversation} messages={displayedMessages} message={message} onMessageChange={setMessage} onSendMessage={() => sendMessage()} onSendAudio={sendAudio} onQuickReply={(text) => sendMessage(text)} onError={showNotice} onMobileBack={() => setMobileChatOpen(false)} isTyping={typing && activeChat === BOT_ID} notice={notice} />
  );
}

