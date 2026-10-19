import type { ParsedFinancialMessage } from '../../../ai/types';
import { normalizeMissingField } from '../normalizers/financial-message.normalizer';
import {
  datePtBr,
  getPaymentMethodLabel,
  money,
} from './financial-value.formatter';

export function missingQuestion(parsed: ParsedFinancialMessage): string {
  const missing = new Set(
    (parsed.missingFields ?? []).map(normalizeMissingField),
  );

  if (missing.has('type')) {
    return 'Por favor, essa movimentação foi uma receita (entrada) ou uma despesa (saída)?';
  }

  if (missing.has('amount')) {
    return 'Qual foi o valor dessa movimentação? (Exemplo: R$ 150,00)';
  }

  if (missing.has('description')) {
    return 'Poderia me dar uma breve descrição sobre o que foi recebido ou pago?';
  }

  if (missing.has('category')) {
    return 'Desculpe, não consegui identificar a categoria dessa movimentação. O valor foi referente a qual produto ou serviço?';
  }

  if (missing.has('paymentMethod')) {
    return 'Qual foi a forma de pagamento? (Ex: Pix, cartão de crédito, débito, boleto, dinheiro ou transferência)';
  }

  if (missing.has('transactionDate')) {
    return 'Em qual data ocorreu essa movimentação? Pode informar no formato DD/MM/AAAA.';
  }

  return 'Desculpe, preciso de mais alguns detalhes para registrar sua movimentação. Poderia me explicar um pouco melhor?';
}

export function formatConfirmation(parsed: ParsedFinancialMessage): string {
  const kind =
    parsed.type === 'income'
      ? '💰 Receita Identificada:'
      : '💸 Despesa Identificada:';

  return [
    `*${kind}*`,
    '─────────────────────────────',
    `📝 *Descrição:* ${parsed.description ?? 'Não informada'}`,
    `💵 *Valor:* ${money(parsed.amount)}`,
    `🏷️ *Categoria:* ${parsed.categoryName ?? 'Não identificada'}`,
    `💳 *Pagamento:* ${getPaymentMethodLabel(parsed.paymentMethod)}`,
    `📅 *Data:* ${datePtBr(parsed.transactionDate)}`,
    '─────────────────────────────',
    '💡 _Tudo certo?_',
    '*Clique em um dos botões abaixo para prosseguir ou digite o que deseja alterar* (ex: "Foi no cartão").',
  ].join('\n');
}
