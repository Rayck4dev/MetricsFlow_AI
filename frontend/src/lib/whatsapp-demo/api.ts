import { apiClient } from "@/services/api";

type BackendMessage = {
  id: string | number;
  direction?: "inbound" | "outbound";
  mine?: boolean;
  messageType?: "text" | "audio";
  message_text?: string | null;
  transcription?: string | null;
  text?: string | null;
  createdAt?: string;
  created_at?: string;
  time?: string;
  status?: "sent" | "delivered" | "read";
  pendingTransactionId?: string | null;
  transactionId?: string | null;
};

type HistoryResponse = {
  welcomeMessage?: string;
  messages: BackendMessage[];
  pending?: unknown;
  company?: {
    id: string;
    name: string;
  } | null;
};

type BotResponse = {
  ok?: boolean;
  message?: string;
  reply?: string;
  transcription?: string;
  pendingTransactionId?: string | null;
  status?: string;
  canConfirm?: boolean;
};

function extractReply(data: BotResponse): string {
  const reply = data.reply ?? data.message;

  if (typeof reply !== "string" || !reply.trim()) {
    throw new Error("O backend não retornou uma resposta válida.");
  }

  return reply;
}

export async function getDemoMessages() {
  return apiClient.get<HistoryResponse>("/whatsapp/demo/messages");
}

export async function sendTextToBot(text: string): Promise<string> {
  const data = await apiClient.post<BotResponse>("/whatsapp/demo", {
    text,
  });

  return extractReply(data);
}

export async function sendAudioToBot(
  blob: Blob,
  _duration: number,
): Promise<string> {
  const form = new FormData();

  const extension = blob.type.includes("mp4")
    ? "m4a"
    : blob.type.includes("ogg")
      ? "ogg"
      : "webm";

  form.append("audio", blob, `audio.${extension}`);

  const data = await apiClient.postFormData<BotResponse>(
    "/whatsapp/demo/audio",
    form,
    { timeoutMs: 90_000 },
  );

  return extractReply(data);
}

export async function confirmPendingTransaction(pendingTransactionId: string) {
  return apiClient.post("/whatsapp/confirm", {
    pendingTransactionId,
  });
}
