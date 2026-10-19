import { Injectable } from '@nestjs/common';

import type {
  CompanyCategory,
  ParsedFinancialMessage,
  WhatsAppIntent,
} from '../types';

import { bestCategory } from './category-matcher';
import {
  buildDescription,
  inferAmount,
  inferDate,
  inferIntent,
  inferPaymentMethod,
  inferType,
} from './fallback-inference';
import { buildMissingFields } from './parser-validation';

@Injectable()
export class FallbackParserService {
  emptyResult(intent: WhatsAppIntent = 'unknown'): ParsedFinancialMessage {
    return {
      intent,
      type: null,
      amount: null,
      description: null,
      categoryId: null,
      categoryName: null,
      paymentMethod: null,
      transactionDate: null,
      confidence: 0,
      missingFields: [],
    };
  }

  parse(
    messageText: string,
    categories: CompanyCategory[] = [],
  ): ParsedFinancialMessage {
    const intent = inferIntent(messageText);

    if (intent !== 'create_transaction') {
      return this.emptyResult(intent);
    }

    const type = inferType(messageText);
    const amount = inferAmount(messageText);
    const paymentMethod = inferPaymentMethod(messageText);
    const transactionDate = inferDate(messageText);
    const category = type ? bestCategory(messageText, type, categories) : null;
    const description = buildDescription(messageText);

    const parsed: ParsedFinancialMessage = {
      intent,
      type,
      amount,
      description,
      categoryId: category?.id ?? null,
      categoryName: category?.name ?? null,
      paymentMethod,
      transactionDate,
      confidence: 0.4,
      missingFields: [],
    };

    parsed.missingFields = buildMissingFields(parsed);

    const completed = 6 - parsed.missingFields.length;
    parsed.confidence = Math.max(0.3, Math.min(0.85, 0.3 + completed * 0.09));

    return parsed;
  }
}
