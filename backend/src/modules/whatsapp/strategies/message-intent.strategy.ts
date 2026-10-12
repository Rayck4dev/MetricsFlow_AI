export const MESSAGE_INTENT_STRATEGIES = Symbol('MESSAGE_INTENT_STRATEGIES');

export type MessageIntent =
  | 'confirm_transaction'
  | 'cancel_transaction'
  | 'correct_transaction'
  | 'create_transaction';

export interface PendingTransactionContext {
  id: string;
  status: string;
  raw_message: string;
}

export interface MessageIntentContext {
  userId: string;
  companyId: string;
  messageText: string;
  phoneNumber: string;
  messageId: string;
  pendingTransaction: PendingTransactionContext | null;
}

export interface MessageIntentResult {
  handled: boolean;
  status?: string;
  reply?: string;
  transactionId?: string;
  pendingTransactionId?: string;
  data?: unknown;
}

export interface MessageIntentStrategy {
  readonly intent: MessageIntent;

  canHandle(context: MessageIntentContext): boolean;

  execute(context: MessageIntentContext): Promise<MessageIntentResult>;
}
