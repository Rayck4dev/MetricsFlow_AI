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

REGRAS RÍGIDAS DE INTENT:
1. 'intent':
   - Qualquer frase informando valores, vendas, recebimentos, pagamentos ou gastos DEVE ser classificada como "create_transaction". NUNCA use "unknown" para frases financeiras.
   - Use "unknown" apenas para conversas sem nenhuma relação com finanças (ex: "olá", "bom dia").

2. 'type':
   - Termos como "recebi", "vendi", "ganhei", "faturei", "entrada" -> OBRIGATORIAMENTE "income".
   - Termos como "paguei", "gastei", "comprei", "saída" -> OBRIGATORIAMENTE "expense".

3. 'paymentMethod':
   - "boleto" -> "bank_slip"
   - "pix" -> "pix"
   - "cartao de credito", "credito" -> "credit_card"
   - "cartao de debito", "debito" -> "debit_card"
   - "dinheiro" -> "cash"
   - "transferencia" -> "transfer"

4. 'transactionDate':
   - Caso não seja especificado outro dia na frase, utilize SEMPRE a data atual: ${today}.

5. 'categoryId' (Mapeamento de Categoria):
   - Analise obrigatoriamente a lista de 'Categorias disponíveis' fornecida acima.
   - O campo 'categoryId' DEVE ser preenchido com o 'id' exato da categoria que melhor se alinha com o tipo ("income"/"expense") e com o contexto da mensagem (ex: se for venda de produtos, selecione o ID da categoria correspondente a "Vendas / Produtos"). NUNCA deixe como null se houver uma categoria compatível na lista.

6. 'confidence':
   - Retorne sempre um valor maior ou igual a 0.95 quando os campos principais forem identificados.

REGRAS OBRIGATÓRIAS PARA 'description':
1. Extraia APENAS o resumo do item, produto, serviço ou pessoa referente à movimentação.
2. NUNCA inclua valores monetários ou termos como "220 reais" na descrição.

EXEMPLO DE FUNCIONAMENTO:
- Entrada: "Recebi 220 reais de uma venda de produtos para o Cliente Marcelo via Boleto"
- Saída JSON esperada:
{
  "intent": "create_transaction",
  "type": "income",
  "amount": 220,
  "description": "Venda de produtos para o Cliente Marcelo",
  "categoryId": "ID_CORRESPONDENTE_DA_LISTA_DE_VENDAS",
  "paymentMethod": "bank_slip",
  "transactionDate": "${today}",
  "confidence": 0.98,
  "missingFields": []
}
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
          temperature: 0.1,
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
