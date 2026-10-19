import { Injectable } from '@nestjs/common';

export type MessageGuardReason =
  | 'financial'
  | 'off_topic'
  | 'sensitive_data'
  | 'invalid_input'
  | 'message_too_long';

export type MessageGuardResult =
  | {
      allowed: true;
      reason: 'financial';
      normalizedText: string;
    }
  | {
      allowed: false;
      reason:
        'off_topic' | 'sensitive_data' | 'invalid_input' | 'message_too_long';
      response: string;
    };

const MAX_MESSAGE_LENGTH = 4000;

const RESPONSES = {
  invalidInput:
    'Desculpe, não consegui ler sua mensagem. Por favor, envie um texto com a movimentação financeira que deseja registrar.',
  emptyMessage:
    'Ops! Parece que sua mensagem veio vazia. Me conte uma receita ou despesa do seu negócio para começarmos!',
  messageTooLong:
    'Ops! Sua mensagem ficou um pouco longa demais para eu processar de uma vez 😅. Envie uma versão resumida (com até 4.000 caracteres) para eu identificar os valores.',
  sensitiveData:
    '🔒 Desculpe, mas por razões de segurança não posso processar dados sensíveis (como senhas, dados de cartão, CPF ou CNPJ). Para registrar a movimentação, preciso apenas do valor, descrição e forma de pagamento!',
  offTopic:
    'Desculpe, mas no momento só consigo ajudar com a gestão financeira do seu negócio! 📊 Posso registrar suas receitas e despesas. Por exemplo: "Recebi R$ 350 por uma venda no Pix". Vamos registrar sua próxima movimentação?',
} as const;

const FINANCIAL_PATTERNS: RegExp[] = [
  /\brecebi\b/i,
  /\brecebimento\b/i,
  /\bentrou\b/i,
  /\bvendi\b/i,
  /\bvenda\b/i,
  /\bfaturei\b/i,
  /\bfaturamento\b/i,
  /\breceita\b/i,
  /\bganhei\b/i,
  /\bpagaram\b/i,
  /\bpaguei\b/i,
  /\bpagamento\b/i,
  /\bgastei\b/i,
  /\bgasto\b/i,
  /\bcomprei\b/i,
  /\bcompra\b/i,
  /\bdespesa\b/i,
  /\bcusto\b/i,
  /\bcustou\b/i,
  /\bretirada\b/i,
  /\bpr[oó]-?labore\b/i,
  /\bfornecedor\b/i,
  /\bestoque\b/i,
  /\bmarketing\b/i,
  /\banúncio\b/i,
  /\banuncio\b/i,
  /\bimposto\b/i,
  /\btributo\b/i,
  /\bdas\b/i,
  /\baluguel\b/i,
  /\bconta\b/i,
  /\bserviço\b/i,
  /\bservico\b/i,
  /\bcliente\b/i,
  /\bfinanceir[oa]s?\b/i,
  /\bmovi(?:mentação|mentacao|mentar)\b/i,
  /\blançamento\b/i,
  /\blancamento\b/i,
  /\bsaldo\b/i,
  /\blucro\b/i,
  /\btransação\b/i,
  /\btransacao\b/i,
  /\bpix\b/i,
  /\bcartão\b/i,
  /\bcartao\b/i,
  /\bboleto\b/i,
  /\bdinheiro\b/i,
  /\btransferência\b/i,
  /\btransferencia\b/i,
  /\bnota fiscal\b/i,
  /\bcomissão\b/i,
  /\bcomissao\b/i,
  /\bdesconto\b/i,
  /\bparcelamento\b/i,
  /\bmensalidade\b/i,
  /\bfrete\b/i,
  /\bcombustível\b/i,
  /\bcombustivel\b/i,
  /\bfolha de pagamento\b/i,
  /\br\$\s*\d/i,
  /\b\d+(?:[.,]\d{1,2})?\s*(?:reais|real)\b/i,
];

const SHORT_RESPONSE_PATTERNS: RegExp[] = [
  /^(?:confirmar|confirmo|sim|s|ok|okay|pode confirmar|pode registrar|confirmado)[.! ]*$/i,
  /^(?:cancelar|cancela|cancele|não|nao|n|desistir|deixa pra lá|deixa para lá)[.! ]*$/i,
  /^(?:corrigir|corrige|editar|alterar|quero corrigir|quero alterar)[.! ]*$/i,
];

const SENSITIVE_PATTERNS: RegExp[] = [
  /\bsenha\b/i,
  /\bpassword\b/i,
  /\bpasscode\b/i,
  /\bcódigo de autenticação\b/i,
  /\bcodigo de autenticacao\b/i,
  /\bcódigo de verificação\b/i,
  /\bcodigo de verificacao\b/i,
  /\bcódigo de recuperação\b/i,
  /\bcodigo de recuperacao\b/i,
  /\btoken de acesso\b/i,
  /\bapi[_ -]?key\b/i,
  /\bchave secreta\b/i,
  /\bsecret key\b/i,
  /\bcvv\b/i,
  /\bcvc\b/i,
  /\b(?:número|numero) do cartão\b.*\b\d{12,19}\b/i,
  /\b(?:cartão|cartao)\b.*\b(?:\d[ -]?){13,19}\b/i,
  /\bcpf\b\s*[:=-]?\s*\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/i,
  /\bcnpj\b\s*[:=-]?\s*\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/i,
  /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
  /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/,
];

@Injectable()
export class MessageGuardService {
  check(text: unknown, hasPendingInformation = false): MessageGuardResult {
    if (typeof text !== 'string') {
      return this.reject('invalid_input', RESPONSES.invalidInput);
    }

    const normalizedText = text.normalize('NFC').replace(/\s+/g, ' ').trim();

    if (!normalizedText) {
      return this.reject('invalid_input', RESPONSES.emptyMessage);
    }

    if (normalizedText.length > MAX_MESSAGE_LENGTH) {
      return this.reject('message_too_long', RESPONSES.messageTooLong);
    }

    if (this.containsSensitiveData(normalizedText)) {
      return this.reject('sensitive_data', RESPONSES.sensitiveData);
    }

    if (this.isShortResponse(normalizedText)) {
      return this.allow(normalizedText);
    }

    if (hasPendingInformation) {
      return this.allow(normalizedText);
    }

    const isFinancial = FINANCIAL_PATTERNS.some((pattern) =>
      pattern.test(normalizedText),
    );

    if (!isFinancial) {
      return this.reject('off_topic', RESPONSES.offTopic);
    }

    return this.allow(normalizedText);
  }

  private containsSensitiveData(text: string): boolean {
    return SENSITIVE_PATTERNS.some((pattern) => pattern.test(text));
  }

  private isShortResponse(text: string): boolean {
    return SHORT_RESPONSE_PATTERNS.some((pattern) => pattern.test(text));
  }

  private allow(normalizedText: string): MessageGuardResult {
    return {
      allowed: true,
      reason: 'financial',
      normalizedText,
    };
  }

  private reject(
    reason:
      'off_topic' | 'sensitive_data' | 'invalid_input' | 'message_too_long',
    response: string,
  ): MessageGuardResult {
    return {
      allowed: false,
      reason,
      response,
    };
  }
}
