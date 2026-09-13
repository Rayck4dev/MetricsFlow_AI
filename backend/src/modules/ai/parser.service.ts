import { Injectable } from '@nestjs/common';

import type {
  CompanyCategory,
  ParsedFinancialMessage,
  PaymentMethod,
  TransactionType,
  WhatsAppIntent,
} from './types';

const paymentAliases: Array<[RegExp, PaymentMethod]> = [
  [/\bpix\b/i, 'pix'],
  [/cart[aã]o\s+de\s+cr[eé]dito|cr[eé]dito/i, 'credit_card'],
  [/cart[aã]o\s+de\s+d[eé]bito|d[eé]bito/i, 'debit_card'],
  [/boleto/i, 'bank_slip'],
  [/dinheiro|esp[eé]cie/i, 'cash'],
  [/transfer[eê]ncia/i, 'transfer'],
];

@Injectable()
export class ParserService {
  private normalizeAmount(raw: string): number | null {
    const clean = raw.replace(/\s/g, '');

    let normalized = clean;

    if (clean.includes(',') && clean.includes('.')) {
      normalized =
        clean.lastIndexOf(',') > clean.lastIndexOf('.')
          ? clean.replace(/\./g, '').replace(',', '.')
          : clean.replace(/,/g, '');
    } else if (clean.includes(',')) {
      normalized = clean.replace(/\./g, '').replace(',', '.');
    }

    const value = Number(normalized);

    return Number.isFinite(value) && value > 0 ? value : null;
  }

  private inferAmount(text: string): number | null {
    const moneyMatch = text.match(
      /(?:r\$\s*)?(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i,
    );

    return moneyMatch ? this.normalizeAmount(moneyMatch[1]) : null;
  }

  private inferType(text: string): TransactionType | null {
    const expense =
      /gastei|paguei|comprei|despesa|saiu|custo|custou|retirada/i.test(text);

    const income =
      /recebi|entrou|faturei|vendi|receita|ganhei|pagaram|pagamento recebido/i.test(
        text,
      );

    if (expense && !income) return 'expense';
    if (income && !expense) return 'income';

    return null;
  }

  private inferPaymentMethod(text: string): PaymentMethod | null {
    return paymentAliases.find(([pattern]) => pattern.test(text))?.[1] ?? null;
  }

  private inferDate(text: string): string {
    const today = new Date();
    const date = new Date(today);

    if (/ontem/i.test(text)) {
      date.setDate(date.getDate() - 1);
    }

    if (/anteontem/i.test(text)) {
      date.setDate(date.getDate() - 2);
    }

    const explicit = text.match(
      /\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/,
    );

    if (explicit) {
      const day = Number(explicit[1]);
      const month = Number(explicit[2]) - 1;

      let year = explicit[3] ? Number(explicit[3]) : today.getFullYear();

      if (year < 100) {
        year += 2000;
      }

      const parsed = new Date(year, month, day);

      if (!Number.isNaN(parsed.getTime())) {
        date.setTime(parsed.getTime());
      }
    }

    return date.toISOString().slice(0, 10);
  }

  private inferIntent(text: string): WhatsAppIntent {
    const normalized = text.trim().toLowerCase();

    if (
      /^(confirmar|confirmo|sim|ok|pode confirmar|pode registrar)$/i.test(
        normalized,
      )
    ) {
      return 'confirm_transaction';
    }

    if (/^(cancelar|cancela|não|nao|desistir)$/i.test(normalized)) {
      return 'cancel_transaction';
    }

    if (/^(corrigir|corrige|editar|alterar)$/i.test(normalized)) {
      return 'correct_transaction';
    }

    return 'create_transaction';
  }

  private scoreCategory(text: string, category: CompanyCategory): number {
    const haystack = text.toLowerCase();

    const words = category.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 3);

    let score = words.reduce(
      (total, word) => total + (haystack.includes(word) ? 2 : 0),
      0,
    );

    const name = category.name.toLowerCase();

    if (
      /fornecedor|estoque|material|insumo/.test(haystack) &&
      /fornecedor|estoque/.test(name)
    ) {
      score += 5;
    }

    if (
      /gasolina|combust[ií]vel|uber|transporte/.test(haystack) &&
      /outra|transporte|ve[ií]culo/.test(name)
    ) {
      score += 3;
    }

    if (
      /aluguel|[aá]gua|luz|energia/.test(haystack) &&
      /aluguel|[aá]gua|luz/.test(name)
    ) {
      score += 5;
    }

    if (
      /marketing|an[uú]ncio|tr[aá]fego/.test(haystack) &&
      /marketing|an[uú]ncio/.test(name)
    ) {
      score += 5;
    }

    if (/das|imposto/.test(haystack) && /das|imposto/.test(name)) {
      score += 5;
    }

    if (/vendi|venda|produto/.test(haystack) && /venda|produto/.test(name)) {
      score += 4;
    }

    if (
      /servi[cç]o|cliente|freela|freelance/.test(haystack) &&
      /servi[cç]o/.test(name)
    ) {
      score += 4;
    }

    return score;
  }

  private bestCategory(
    text: string,
    type: TransactionType | null,
    categories: CompanyCategory[],
  ): CompanyCategory | null {
    if (!type) return null;

    const candidates = categories.filter((category) => category.type === type);

    const ranked = candidates
      .map((category) => ({
        category,
        score: this.scoreCategory(text, category),
      }))
      .sort((a, b) => b.score - a.score);

    if (ranked[0]?.score > 0) {
      return ranked[0].category;
    }

    return (
      candidates.find((category) => /outr/i.test(category.name)) ??
      candidates.find((category) => category.name.length > 0) ??
      null
    );
  }

  private fallbackParse(
    messageText: string,
    categories: CompanyCategory[],
  ): ParsedFinancialMessage {
    const intent = this.inferIntent(messageText);

    if (intent !== 'create_transaction') {
      return {
        intent,
        type: null,
        amount: null,
        description: null,
        categoryId: null,
        categoryName: null,
        paymentMethod: null,
        transactionDate: null,
        confidence: 1,
        missingFields: [],
      };
    }

    const type = this.inferType(messageText);
    const amount = this.inferAmount(messageText);
    const paymentMethod = this.inferPaymentMethod(messageText);
    const transactionDate = this.inferDate(messageText);
    const category = this.bestCategory(messageText, type, categories);

    const description =
      messageText
        .replace(
          /(?:r\$\s*)?\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|(?:r\$\s*)?\d+(?:[.,]\d{1,2})?/i,
          '',
        )
        .replace(/\b(hoje|ontem|anteontem)\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim() || null;

    const missingFields: string[] = [];

    if (!type) missingFields.push('type');
    if (!amount) missingFields.push('amount');
    if (!description) {
      missingFields.push('description');
    }
    if (!category) {
      missingFields.push('category');
    }
    if (!paymentMethod) {
      missingFields.push('paymentMethod');
    }

    const known = 5 - missingFields.length;

    return {
      intent,
      type,
      amount,
      description,
      categoryId: category?.id ?? null,
      categoryName: category?.name ?? null,
      paymentMethod,
      transactionDate,
      confidence: Math.max(0.35, Math.min(0.95, 0.4 + known * 0.11)),
      missingFields,
    };
  }

  private extractResponseText(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const response = payload as {
      output_text?: string;
      output?: Array<{
        content?: Array<{
          text?: string;
        }>;
      }>;
    };

    if (response.output_text) {
      return response.output_text;
    }

    for (const item of response.output ?? []) {
      for (const content of item.content ?? []) {
        if (content.text) {
          return content.text;
        }
      }
    }

    return null;
  }

  async parseWhatsAppMessage(
    messageText: string,
    categories: CompanyCategory[] = [],
  ): Promise<ParsedFinancialMessage> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return this.fallbackParse(messageText, categories);
    }

    const availableCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
    }));

    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_FINANCIAL_MODEL || 'gpt-5.6-luna',

          input: [
            {
              role: 'system',
              content:
                'Você interpreta mensagens financeiras em português do Brasil. Nunca invente categoria nem forma de pagamento. Use somente category_id fornecido. Se um dado não foi informado com segurança, retorne null e inclua em missing_fields. A IA interpreta; o sistema decide se pode gravar.',
            },
            {
              role: 'user',
              content: `Data atual: ${new Date().toISOString().slice(0, 10)}
Categorias permitidas: ${JSON.stringify(availableCategories)}
Mensagem: ${messageText}`,
            },
          ],

          text: {
            format: {
              type: 'json_schema',
              name: 'financial_whatsapp_message',
              strict: true,
              schema: {
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
                  },

                  description: {
                    type: ['string', 'null'],
                  },

                  categoryId: {
                    type: ['string', 'null'],
                  },

                  categoryName: {
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
                    },
                  },
                },

                required: [
                  'intent',
                  'type',
                  'amount',
                  'description',
                  'categoryId',
                  'categoryName',
                  'paymentMethod',
                  'transactionDate',
                  'confidence',
                  'missingFields',
                ],
              },
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI HTTP ${response.status}`);
      }

      const payload = await response.json();

      const outputText = this.extractResponseText(payload);

      if (!outputText) {
        throw new Error('Resposta estruturada vazia da OpenAI.');
      }

      const parsed = JSON.parse(outputText) as ParsedFinancialMessage;

      if (!parsed.transactionDate) {
        parsed.transactionDate = new Date().toISOString().slice(0, 10);

        parsed.missingFields = parsed.missingFields.filter(
          (field) => field !== 'transactionDate',
        );
      }

      if (
        parsed.categoryId &&
        !categories.some((category) => category.id === parsed.categoryId)
      ) {
        parsed.categoryId = null;
        parsed.categoryName = null;

        if (!parsed.missingFields.includes('category')) {
          parsed.missingFields.push('category');
        }
      }

      return parsed;
    } catch (error) {
      console.error('Falha no parser OpenAI; usando fallback local:', error);

      return this.fallbackParse(messageText, categories);
    }
  }
}
