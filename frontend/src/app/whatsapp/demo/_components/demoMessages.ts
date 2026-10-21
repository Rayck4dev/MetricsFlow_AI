import type { DemoMessage, DemoConversation } from "@/types/whatsapp-demo";
import type { RecordedAudio } from "@/hooks/whatsapp/useAudioRecorder";

export const BOT_ID = 1;

export type BackendMessage = {
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

export const initialConversations: DemoConversation[] = [
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

export function toDemoMessage(item: BackendMessage, index: number): DemoMessage {
  const timestamp = item.createdAt ?? item.created_at;
  const date = timestamp ? new Date(timestamp) : null;
  const isAudio = (item.messageType ?? item.message_type) === "audio";

  const time =
    item.time ??
    (date && !Number.isNaN(date.getTime())
      ? date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "");

  const audioObj = isAudio
    ? {
        url: null as unknown as string,
        duration: item.createdAt ? 0 : 5,
        wave: [
          0.2, 0.5, 0.8, 0.4, 0.9, 0.6, 0.3, 0.7, 0.5, 0.4, 0.8, 0.6, 0.3, 0.5,
          0.7, 0.4, 0.2,
        ],
      }
    : undefined;

  return {
    id: index + 1,
    mine: item.mine ?? item.direction === "inbound",
    messageType: isAudio ? "audio" : "text",
    time,
    text: item.message_text ?? item.transcription ?? item.text ?? "",
    audio: audioObj,
    status: item.status,
  };
}

export function createOptimisticTextMessage(
  id: number,
  now: Date,
  text: string,
): DemoMessage {
  return {
    id,
    mine: true,
    messageType: "text",
    time: now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    text,
    status: "sent",
  };
}

export function createOptimisticAudioMessage(
  id: number,
  now: Date,
  audio: RecordedAudio,
): DemoMessage {
  return {
    id,
    mine: true,
    messageType: "audio",
    time: now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    text: "Mensagem de voz",
    audio: {
      url: audio.url,
      duration: audio.duration,
      wave: audio.wave,
    },
    status: "sent",
  };
}

export function buildDemoConversations(
  conversations: DemoConversation[],
  messages: DemoMessage[],
  welcomeMessage: string,
): DemoConversation[] {
  return conversations.map((conversation) => ({
    ...conversation,
    name: "Metrics",
    preview:
      messages.length > 0
        ? messages[messages.length - 1].text || "Mensagem recebida"
        : welcomeMessage,
    time: messages[messages.length - 1]?.time ?? "",
  }));
}

export function filterDemoConversations(
  conversations: DemoConversation[],
  search: string,
): DemoConversation[] {
  return conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(search.toLowerCase()),
  );
}

export function getActiveDemoConversation(
  conversations: DemoConversation[],
  activeId: number,
): DemoConversation {
  return conversations.find((conversation) => conversation.id === activeId) ?? conversations[0];
}
