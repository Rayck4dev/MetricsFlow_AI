import { Injectable } from '@nestjs/common';

import { ParserService } from '../../ai/parser.service';
import { CategoriesService } from '../../categories/categories.service';
import {
  formatConfirmation,
  missingQuestion,
  normalizeParsedMessage,
} from '../services/financial-message.utils';
import { PendingTransactionService } from '../services/pending-transaction.service';

import {
  MessageIntentContext,
  MessageIntentResult,
  MessageIntentStrategy,
} from './message-intent.strategy';

@Injectable()
export class CreateTransactionStrategy implements MessageIntentStrategy {
  readonly intent = 'create_transaction' as const;

  constructor(
    private readonly parserService: ParserService,
    private readonly categoriesService: CategoriesService,
    private readonly pendingTransactionService: PendingTransactionService,
  ) {}

  canHandle(context: MessageIntentContext): boolean {
    if (context.messageText.trim().length === 0) {
      return false;
    }

    if (context.pendingTransaction === null) {
      return true;
    }

    return context.pendingTransaction.status === 'awaiting_information';
  }

  async execute(context: MessageIntentContext): Promise<MessageIntentResult> {
    const pending = context.pendingTransaction;
    const categories = await this.categoriesService.findByCompany(
      { company_id: context.companyId },
      context.userId,
    );

    const combinedText = pending
      ? `${pending.raw_message}\nInformação complementar: ${context.messageText}`
      : context.messageText;

    const parsed = await this.parserService.parseWhatsAppMessage(
      combinedText,
      categories,
    );

    if (!parsed || parsed.intent !== 'create_transaction') {
      return {
        handled: true,
        status: 'unrecognized',
        reply:
          'Não consegui identificar uma movimentação financeira válida. Informe uma receita ou despesa, por exemplo: "Gastei R$ 150 com materiais via Pix".',
      };
    }

    normalizeParsedMessage(parsed, combinedText, categories);

    const missingFields = Array.isArray(parsed.missingFields)
      ? parsed.missingFields
      : [];

    const status =
      missingFields.length > 0
        ? 'awaiting_information'
        : 'awaiting_confirmation';

    const proposalData = {
      type: parsed.type,
      amount: parsed.amount,
      description: parsed.description,
      category_id: parsed.categoryId,
      category_name: parsed.categoryName,
      payment_method: parsed.paymentMethod,
      transaction_date: parsed.transactionDate,
      raw_message: combinedText,
      missing_fields: missingFields,
      status,
      updated_at: new Date().toISOString(),
    };

    let savedPending: { id: string; status: string };

    if (pending) {
      savedPending = (await this.pendingTransactionService.update(
        pending.id,
        context.userId,
        context.companyId,
        proposalData,
      )) as { id: string; status: string };
    } else {
      savedPending = (await this.pendingTransactionService.create(
        context.userId,
        context.companyId,
        proposalData,
      )) as { id: string; status: string };
    }

    const reply =
      status === 'awaiting_confirmation'
        ? formatConfirmation(parsed)
        : missingQuestion(parsed);

    return {
      handled: true,
      status: savedPending.status,
      pendingTransactionId: savedPending.id,
      reply,
      data: { parsed, pendingTransaction: savedPending },
    };
  }
}

