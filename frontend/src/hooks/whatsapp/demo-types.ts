export interface ChatMessage {
  id: string | number;
  mine: boolean;
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  buttons?: string[];
}

export interface ConfirmTransactionResponse {
  ok: boolean;
  message: string;
  transactionId: string;
}
