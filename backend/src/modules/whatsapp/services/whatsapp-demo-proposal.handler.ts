import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { CompanyCategory } from '../../ai/types';
import { ParserService } from '../../ai/parser.service';
import { PendingTransactionsRepository } from '../repositories/pending-transactions.repository';
import {
  formatConfirmation,
  missingQuestion,
  normalizeParsedMessage,
} from './financial-message.utils';
import type { PendingProposalState } from './whatsapp-demo-correction.handler';

@Injectable()
export class WhatsappDemoProposalHandler {
  constructor(
    private readonly parserService: ParserService,
    private readonly pendingRepository: PendingTransactionsRepository,
  ) {}

  async createOrUpdateProposal(params: {
    userId: string;
    companyId: string;
    companyName: string;
    normalizedText: string;
    pending: PendingProposalState | null;
    categories: CompanyCategory[];
  }) {
    const {
      userId,
      companyId,
      companyName,
      normalizedText,
      pending,
      categories,
    } = params;

    const isCompletingInfo =
      pending && pending.status === 'awaiting_information';
    const combinedText = isCompletingInfo
      ? `${pending.raw_message}\nInformação complementar: ${normalizedText}`
      : normalizedText;

    const parsed = await this.parserService.parseWhatsAppMessage(
      combinedText,
      categories,
    );

    if (!parsed || parsed.intent !== 'create_transaction') {
      const replyText =
        'Desculpe, não consegui identificar uma movimentação válida. Informe uma receita ou despesa do seu negócio.';

      return {
        ok: false,
        message: replyText,
        reply: replyText,
        pendingTransactionId: pending?.id ?? null,
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

    let savedPending: {
      id: string;
      status: string;
      expires_at: string;
    } | null = null;

    if (isCompletingInfo) {
      const { data, error } = await this.pendingRepository.updateActivePending(
        pending.id,
        userId,
        companyId,
        proposalData,
      );

      if (error) {
        throw new InternalServerErrorException(
          'Não foi possível atualizar a proposta de movimentação.',
        );
      }

      savedPending = data;
    } else {
      const { data, error } =
        await this.pendingRepository.createPendingTransaction(
          userId,
          companyId,
          proposalData,
        );

      if (error) {
        throw new InternalServerErrorException(
          'Não foi possível salvar a proposta de movimentação.',
        );
      }

      savedPending = data;
    }

    if (!savedPending) {
      throw new InternalServerErrorException(
        'Falha ao persistir a proposta de movimentação.',
      );
    }

    const replyText =
      savedPending.status === 'awaiting_confirmation'
        ? formatConfirmation(parsed)
        : missingQuestion(parsed);

    return {
      ok: true,
      pendingTransactionId: savedPending.id,
      status: savedPending.status,
      expiresAt: savedPending.expires_at,
      message: replyText,
      reply: replyText,
      canConfirm: savedPending.status === 'awaiting_confirmation',
      companyId,
      companyName,
      categories,
      parsed,
      missingFields,
    };
  }
}
