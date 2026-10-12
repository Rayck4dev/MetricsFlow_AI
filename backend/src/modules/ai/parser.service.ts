import { Injectable, Logger } from '@nestjs/common';

import type {
  CompanyCategory,
  ParsedFinancialMessage,
  WhatsAppIntent,
} from './types';

import { currentLocalDate } from './parser/financial-normalizer';
import { FallbackParserService } from './parser/fallback-parser.service';
import { OpenAIParserService } from './parser/openai-parser.service';

const MAX_MESSAGE_LENGTH = 10_000;

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);

  constructor(
    private readonly fallbackParser: FallbackParserService,
    private readonly openAIParser: OpenAIParserService,
  ) {}

  private emptyResult(
    intent: WhatsAppIntent = 'unknown',
  ): ParsedFinancialMessage {
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

  async parseWhatsAppMessage(
    messageText: string,
    categories: CompanyCategory[] = [],
  ): Promise<ParsedFinancialMessage> {
    if (typeof messageText !== 'string') {
      return this.emptyResult();
    }

    const normalizedMessage = messageText.trim();

    if (!normalizedMessage || normalizedMessage.length > MAX_MESSAGE_LENGTH) {
      return this.emptyResult();
    }

    if (!process.env.OPENAI_API_KEY?.trim()) {
      this.logger.debug('OPENAI_API_KEY não configurada. Usando parser local.');

      return this.fallbackParser.parse(normalizedMessage, categories);
    }

    try {
      return await this.openAIParser.parse(normalizedMessage, categories);
    } catch (error: unknown) {
      this.logger.warn(
        `Falha na interpretação por IA: ${
          error instanceof Error ? error.name : 'erro desconhecido'
        }. Usando fallback local.`,
      );

      return this.fallbackParser.parse(normalizedMessage, categories);
    }
  }

  getCurrentLocalDate(): string {
    return currentLocalDate();
  }
}
