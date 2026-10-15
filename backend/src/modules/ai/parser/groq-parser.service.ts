import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import type { CompanyCategory, ParsedFinancialMessage } from '../types';
import { validateParsedResult } from './parser-validation';
import { currentLocalDate } from './financial-normalizer';

const MAX_AMOUNT = 9999999999999.99;

@Injectable()
export class GroqParserService {
  private readonly logger = new Logger(GroqParserService.name);

  async parse(
    messageText: string,
    categories: CompanyCategory[] = [],
  ): Promise<ParsedFinancialMessage> {
    const apiKey = process.env.GROQ_API_KEY?.trim();
    const baseUrl =
      process.env.GROQ_BASE_URL?.trim() || 'https://api.groq.com/openai/v1';

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'A chave da Groq não está configurada.',
      );
    }

    const model =
      process.env.GROQ_FINANCIAL_MODEL?.trim() || 'llama-3.3-70b-versatile';

    const allowedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
    }));

    const today = currentLocalDate();

    const schema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        intent: {
          type: 'string',
          enum: [
            'create_transaction',
            'confirm_transaction',
            'cancel_transaction',
            'correct_transaction',
            'unknown',
          ],
        },
        type: {
          type: ['string', 'null'],
          enum: ['income', 'expense', null],
        },
        amount: {
          type: ['number', 'null'],
          minimum: 0,
          maximum: MAX_AMOUNT,
        },
        description: {
          type: ['string', 'null'],
        },
        categoryId: {
          type: ['string', 'null'],
        },
        paymentMethod: {
          type: ['string', 'null'],
          enum: [
            'pix',
            'credit_card',
            'debit_card',
            'bank_slip',
            'cash',
            'transfer',
            'other',
            null,
          ],
        },
        transactionDate: {
          type: ['string', 'null'],
        },
        confidence: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
        missingFields: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'type',
              'amount',
              'description',
              'category',
              'paymentMethod',
              'transactionDate',
            ],
          },
        },
      },
      required: [
        'intent',
        'type',
        'amount',
        'description',
        'categoryId',
        'paymentMethod',
        'transactionDate',
        'confidence',
        'missingFields',
      ],
    };

    const instructions = `
Você é um assistente de interpretação de mensagens financeiras de pequenos negócios brasileiros.
Interprete a mensagem em português brasileiro e retorne estritamente um JSON válido que atenda ao schema.
Data atual de referência: ${today}.
Categorias disponíveis: ${JSON.stringify(allowedCategories)}

REGRAS OBRIGATÓRIAS PARA 'description':
1. Extraia APENAS o nome do produto, serviço ou objeto (ex: "Materiais de escritório").
2. NUNCA inclua preposições, artigos ou palavras de ligação no início ou no fim (remova "com", "de", "do", "da", "no", "na", "para", "em", etc.).
3. NUNCA inclua palavras relativas ao meio de pagamento ou marcas de contexto do sistema como "Informação complementar:". Ignore completamente essas expressões e foque apenas no conteúdo útil.
`;

    let response: Response;

    try {
      response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: instructions },
            { role: 'user', content: messageText },
          ],
          response_format: {
            type: 'json_object',
          },
        }),
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error: unknown) {
      const reason =
        error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.warn(`Falha na comunicação com a Groq: ${reason}`);
      throw new ServiceUnavailableException(
        'Não foi possível conectar ao serviço de IA.',
      );
    }

    if (!response.ok) {
      this.logger.warn(`API da Groq retornou HTTP ${response.status}.`);
      throw new ServiceUnavailableException(
        'O serviço de IA está temporariamente indisponível.',
      );
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch {
      throw new ServiceUnavailableException(
        'Resposta inválida do serviço de IA.',
      );
    }

    const responseText = payload?.choices?.[0]?.message?.content;

    if (!responseText) {
      throw new ServiceUnavailableException(
        'O serviço de IA não retornou conteúdo.',
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      throw new ServiceUnavailableException(
        'Não foi possível interpretar o JSON da IA.',
      );
    }

    return validateParsedResult(parsed, categories);
  }
}
