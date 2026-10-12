import { Injectable } from '@nestjs/common';

import { PendingTransactionService } from '../services/pending-transaction.service';

import {
  MessageIntentContext,
  MessageIntentResult,
  MessageIntentStrategy,
} from './message-intent.strategy';

@Injectable()
export class ConfirmTransactionStrategy implements MessageIntentStrategy {
  readonly intent = 'confirm_transaction' as const;

  constructor(
    private readonly pendingTransactionService: PendingTransactionService,
  ) {}

  canHandle(context: MessageIntentContext): boolean {
    const message = context.messageText.trim();

    const isConfirmation =
      /^(confirmar|confirmo|sim|ok|pode confirmar|pode registrar|confirmado)[.! ]*$/i.test(
        message,
      );

    return isConfirmation && context.pendingTransaction !== null;
  }

  async execute(context: MessageIntentContext): Promise<MessageIntentResult> {
    const pending = context.pendingTransaction;

    if (!pending) {
      return { handled: false };
    }

    if (pending.status !== 'awaiting_confirmation') {
      return {
        handled: true,
        status: 'needs_information',
        reply:
          'Ainda faltam informações para concluir essa movimentação. Responda à pergunta anterior para continuar.',
      };
    }

    const transactionId = await this.pendingTransactionService.confirm(
      pending.id,
      context.userId,
      context.companyId,
    );

    return {
      handled: true,
      status: 'confirmed',
      transactionId,
      reply: '✅ Movimentação registrada com sucesso na MetricsFlow AI!',
    };
  }
}
