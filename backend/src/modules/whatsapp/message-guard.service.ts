import { Injectable } from '@nestjs/common';

export type MessageGuardResult =
  | {
      allowed: true;
      reason: 'financial';
    }
  | {
      allowed: false;
      reason: 'off_topic' | 'sensitive_data';
      response: string;
    };

@Injectable()
export class MessageGuardService {
  private readonly financialPatterns = [
    /\brecebi\b/i,
    /\bentrou\b/i,
    /\bvendi\b/i,
    /\bvenda\b/i,
    /\bfaturei\b/i,
    /\breceita\b/i,
    /\bganhei\b/i,
    /\bpagaram\b/i,
    /\bpaguei\b/i,
    /\bgastei\b/i,
    /\bcomprei\b/i,
    /\bdespesa\b/i,
    /\bcusto\b/i,
    /\bcustou\b/i,
    /\bretirada\b/i,
    /\bpagamento\b/i,
    /\bfornecedor\b/i,
    /\bestoque\b/i,
    /\bmarketing\b/i,
    /\banúncio\b/i,
    /\banuncio\b/i,
    /\bimposto\b/i,
    /\bdas\b/i,
    /\baluguel\b/i,
    /\bconta\b/i,
    /\bserviço\b/i,
    /\bservico\b/i,
    /\bcliente\b/i,
    /\bfinanceir[oa]\b/i,
    /\bmovi(?:mentação|mentacao)\b/i,
    /\blançamento\b/i,
    /\blancamento\b/i,
    /\bsaldo\b/i,
    /\bfaturamento\b/i,
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
  ];

  private readonly confirmationPatterns = [
    /^(confirmar|confirmo|sim|ok|pode confirmar|pode registrar)$/i,
    /^(cancelar|cancela|não|nao|desistir)$/i,
    /^(corrigir|corrige|editar|alterar)$/i,
  ];

  private readonly sensitivePatterns = [
    /\bsenha\b/i,
    /\bpassword\b/i,
    /\bcódigo de autenticação\b/i,
    /\bcodigo de autenticacao\b/i,
    /\bcódigo de verificação\b/i,
    /\bcodigo de verificacao\b/i,
    /\btoken\b/i,
    /\bapi[_ -]?key\b/i,
    /\bchave secreta\b/i,
    /\bsecret key\b/i,
    /\bcvv\b/i,
    /\bcvc\b/i,
    /\bcartão\b.*\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/i,
    /\bcartao\b.*\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/i,
    /\bcpf\b.*\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/i,
    /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
    /\bchave pix\b.*@/i,
  ];

  check(text: string, hasPendingInformation = false): MessageGuardResult {
    const normalized = text.trim();

    if (!normalized) {
      return {
        allowed: false,
        reason: 'off_topic',
        response:
          'Não consegui identificar uma mensagem. Envie uma movimentação financeira do seu negócio.',
      };
    }

    if (this.sensitivePatterns.some((pattern) => pattern.test(normalized))) {
      return {
        allowed: false,
        reason: 'sensitive_data',
        response:
          '🔒 Por segurança, não envie senhas, códigos de autenticação, tokens, dados completos de cartão ou outros dados pessoais desnecessários. Posso ajudar apenas com informações necessárias para o controle financeiro do seu negócio.',
      };
    }

    if (this.confirmationPatterns.some((pattern) => pattern.test(normalized))) {
      return {
        allowed: true,
        reason: 'financial',
      };
    }

    if (hasPendingInformation) {
      return {
        allowed: true,
        reason: 'financial',
      };
    }

    const isFinancial = this.financialPatterns.some((pattern) =>
      pattern.test(normalized),
    );

    if (!isFinancial) {
      return {
        allowed: false,
        reason: 'off_topic',
        response:
          'Posso ajudar apenas com o controle financeiro do seu negócio. Envie uma receita, despesa ou movimentação para continuar.',
      };
    }

    return {
      allowed: true,
      reason: 'financial',
    };
  }
}
