import { Injectable } from '@nestjs/common';

import { PendingTransactionService } from '../services/pending-transaction.service';

import {
  MessageIntentContext,
  MessageIntentResult,
  MessageIntentStrategy,
} from './message-intent.strategy';

@Injectable()
export class CorrectTransactionStrategy implements MessageIntentStrategy {
  readonly intent = 'correct_transaction' as const;

  constructor(
    private readonly pendingTransactionService: PendingTransactionService,
  ) {}

  canHandle(context: MessageIntentContext): boolean {
    const message = context.messageText.trim();

    const isCorrection =
      /^(corrigir|corrige|editar|alterar|quero corrigir|quero alterar)[.! ]*$/i.test(
        message,
      );

    return isCorrection && context.pendingTransaction !== null;
  }

  async execute(context: MessageIntentContext): Promise<MessageIntentResult> {
    const pending = context.pendingTransaction;

    if (!pending) {
      return { handled: false };
    }

    if (pending.status === 'awaiting_information') {
      return {
        handled: true,
        status: 'correction_requested',
        reply:
          'Vamos completar os dados que faltam primeiro. Responda à última pergunta ou envie a movimentação inteira novamente.',
      };
    }

    if (pending.status !== 'awaiting_confirmation') {
      return { handled: false };
    }

    await this.pendingTransactionService.cancel(
      pending.id,
      context.userId,
      context.companyId,
      ['awaiting_confirmation'],
    );

    return {
      handled: true,
      status: 'correction_requested',
      reply:
        '✏️ Certo! A proposta anterior foi descartada. Envie novamente a movimentação com os dados corrigidos. Nada foi registrado ainda.',
    };
  }
}
