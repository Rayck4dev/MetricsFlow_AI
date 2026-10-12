import { Injectable } from '@nestjs/common';

import { PendingTransactionService } from '../services/pending-transaction.service';

import {
  MessageIntentContext,
  MessageIntentResult,
  MessageIntentStrategy,
} from './message-intent.strategy';

@Injectable()
export class CancelTransactionStrategy implements MessageIntentStrategy {
  readonly intent = 'cancel_transaction' as const;

  constructor(
    private readonly pendingTransactionService: PendingTransactionService,
  ) {}

  canHandle(context: MessageIntentContext): boolean {
    const message = context.messageText.trim();

    const isCancellation =
      /^(cancelar|cancela|cancele|não|nao|desistir|deixa pra lá|deixa para lá)[.! ]*$/i.test(
        message,
      );

    return isCancellation && context.pendingTransaction !== null;
  }

  async execute(context: MessageIntentContext): Promise<MessageIntentResult> {
    const pending = context.pendingTransaction;

    if (!pending) {
      return { handled: false };
    }

    await this.pendingTransactionService.cancel(
      pending.id,
      context.userId,
      context.companyId,
    );

    return {
      handled: true,
      status: 'cancelled',
      reply:
        '❌ Tudo certo, a proposta foi cancelada. Nenhuma movimentação foi registrada. Se quiser, envie outra receita ou despesa.',
    };
  }
}
