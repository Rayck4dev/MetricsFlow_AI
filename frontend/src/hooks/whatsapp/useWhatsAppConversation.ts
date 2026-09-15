"use client";

import { useEffect, useMemo, useState } from "react";

export type ConversationSender = "bot" | "user";

export interface ConversationMessage {
  id: number;
  sender: ConversationSender;
  text: string;
  time: string;
}

const CONVERSATION_MESSAGES: ConversationMessage[] = [
  {
    id: 1,
    sender: "bot",
    text: "Olá! 👋\nMe envie uma venda ou despesa e eu organizo os dados para você.",
    time: "10:24",
  },
  {
    id: 2,
    sender: "user",
    text: "Gastei 120 reais de gasolina hoje no Pix",
    time: "10:25",
  },
  {
    id: 3,
    sender: "bot",
    text: "Entendi! 🚗\n\nIdentifiquei uma despesa de R$ 120,00 com combustível.\n\nCategoria: Transporte\nPagamento: Pix\nData: 13/09/2026\n\nEstá correto?",
    time: "10:25",
  },
  {
    id: 4,
    sender: "user",
    text: "Sim, pode registrar.",
    time: "10:26",
  },
  {
    id: 5,
    sender: "bot",
    text: "Movimentação registrada com sucesso! ✅",
    time: "10:26",
  },
];

export function useWhatsAppConversation() {
  const [visibleCount, setVisibleCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (visibleCount >= CONVERSATION_MESSAGES.length) {
      const timer = window.setTimeout(() => {
        setVisibleCount(1);
        setIsTyping(false);
      }, 4500);

      return () => window.clearTimeout(timer);
    }

    const nextMessage = CONVERSATION_MESSAGES[visibleCount];

    if (!nextMessage) return;

    const typing = nextMessage.sender === "bot";

    setIsTyping(typing);

    const timer = window.setTimeout(
      () => {
        setIsTyping(false);
        setVisibleCount((current) => current + 1);
      },
      typing ? 2100 : 1500,
    );

    return () => window.clearTimeout(timer);
  }, [visibleCount]);

  const messages = useMemo(
    () => CONVERSATION_MESSAGES.slice(0, visibleCount),
    [visibleCount],
  );

  return {
    messages,
    isTyping,
  };
}
