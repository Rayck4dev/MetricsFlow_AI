import { Injectable } from '@nestjs/common';
import type { CompanyCategory, ParsedFinancialMessage } from '../../ai/types';
import { PendingTransactionsRepository } from '../repositories/pending-transactions.repository';
import {
  formatConfirmation,
  missingQuestion,
} from './financial-message.utils';
import { normalizeParsedMessage } from './normalizers/financial-message.normalizer';

export interface PendingProposalState {
  id: string;
  type?: 'income' | 'expense' | null;
  amount?: number | null;
  description?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  payment_method?: ParsedFinancialMessage['paymentMethod'];
  transaction_date?: string | null;
  raw_message: string;
  missing_fields?: string[] | null;
  status: string;
  expires_at?: string;
}

export interface CorrectionResult {
  updatedParsed: ParsedFinancialMessage;
  newStatus: 'awaiting_information' | 'awaiting_confirmation';
  proposalData: Record<string, unknown>;
}

@Injectable()
export class WhatsappDemoCorrectionHandler {
  private readonly correctionPattern =
    /^(corrigir|corrige|alterar|mudar|muda)\s+(o|a)?\s*(descrição|descricao|valor|categoria|pagamento|data)/i;

  constructor(
    private readonly pendingRepository: PendingTransactionsRepository,
  ) {}

  isSpecificCorrection(text: string, hasPending: boolean): boolean {
    return Boolean(hasPending && this.correctionPattern.test(text));
  }

  applyCorrection(
    pending: PendingProposalState,
    text: string,
    categories: CompanyCategory[],
  ): CorrectionResult | null {
    const fieldMatch = text.match(
      /(descrição|descricao|valor|categoria|pagamento|data)/i,
    );
    const fieldKey = fieldMatch ? fieldMatch[1].toLowerCase() : '';

    const parts = text.split(/\s+(?:para|em|como)\s+|\s*=\s*/i);
    const newValue = parts.length > 1 ? parts[parts.length - 1].trim() : '';

    if (!newValue) {
      return null;
    }

    const updatedParsed: ParsedFinancialMessage = {
      intent: 'create_transaction',
      type: pending.type ?? null,
      amount: pending.amount ?? null,
      description: pending.description ?? null,
      categoryId: pending.category_id ?? null,
      categoryName: pending.category_name ?? null,
      paymentMethod: pending.payment_method ?? null,
      transactionDate: pending.transaction_date ?? null,
      confidence: 1,
      missingFields: pending.missing_fields ?? [],
    };

    if (fieldKey.includes('descri')) {
      updatedParsed.description = newValue.replace(/[.]$/, '').trim();
    } else if (fieldKey.includes('valor')) {
      const numericValue = parseFloat(
        newValue.replace(/[^\d,]/g, '').replace(',', '.'),
      );
      if (!Number.isNaN(numericValue)) {
        updatedParsed.amount = numericValue;
      }
    } else if (fieldKey.includes('pagamento')) {
      updatedParsed.paymentMethod = newValue.toLowerCase() as any;
    } else if (fieldKey.includes('data')) {
      updatedParsed.transactionDate = newValue;
    }

    normalizeParsedMessage(updatedParsed, pending.raw_message, categories);

    const newStatus =
      updatedParsed.missingFields && updatedParsed.missingFields.length > 0
        ? 'awaiting_information'
        : 'awaiting_confirmation';

    const proposalData = {
      type: updatedParsed.type,
      amount: updatedParsed.amount,
      description: updatedParsed.description,
      category_id: updatedParsed.categoryId,
      category_name: updatedParsed.categoryName,
      payment_method: updatedParsed.paymentMethod,
      transaction_date: updatedParsed.transactionDate,
      missing_fields: updatedParsed.missingFields,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    return {
      updatedParsed,
      newStatus,
      proposalData,
    };
  }

  async executeCorrection(params: {
    pending: PendingProposalState;
    text: string;
    userId: string;
    companyId: string;
    companyName: string;
    categories: CompanyCategory[];
  }) {
    const correction = this.applyCorrection(
      params.pending,
      params.text,
      params.categories,
    );

    if (!correction) {
      return null;
    }

    const { data: updatedPending, error: updateError } =
      await this.pendingRepository.updateActivePending(
        params.pending.id,
        params.userId,
        params.companyId,
        correction.proposalData,
      );

    if (updateError || !updatedPending) {
      return null;
    }

    const replyText =
      updatedPending.status === 'awaiting_confirmation'
        ? formatConfirmation(correction.updatedParsed)
        : missingQuestion(correction.updatedParsed);

    return {
      ok: true,
      pendingTransactionId: updatedPending.id,
      status: updatedPending.status,
      expiresAt: updatedPending.expires_at,
      message: replyText,
      reply: replyText,
      canConfirm: updatedPending.status === 'awaiting_confirmation',
      companyId: params.companyId,
      companyName: params.companyName,
      categories: params.categories,
      parsed: correction.updatedParsed,
      missingFields: correction.updatedParsed.missingFields,
    };
  }
}
