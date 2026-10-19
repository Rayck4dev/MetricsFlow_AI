import type { ParsedFinancialMessage } from '../../../ai/types';

export function money(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(Number(value))) {
    return 'Não informado';
  }

  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function datePtBr(value: string | null | undefined): string {
  if (!value) {
    return 'Não informada';
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return 'Data inválida';
  }

  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function formatMessageTime(
  value: string | Date | null | undefined,
): string {
  if (!value) {
    return '12:00';
  }

  const date = typeof value === 'string' ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return '12:00';
  }

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Porto_Velho',
  });
}

export function getPaymentMethodLabel(
  paymentMethod: ParsedFinancialMessage['paymentMethod'],
): string {
  if (!paymentMethod) {
    return 'Não informado';
  }

  const labels = {
    pix: 'Pix',
    credit_card: 'Cartão de crédito',
    debit_card: 'Cartão de débito',
    bank_slip: 'Boleto',
    cash: 'Dinheiro',
    transfer: 'Transferência',
    other: 'Outro',
  } satisfies Record<
    NonNullable<ParsedFinancialMessage['paymentMethod']>,
    string
  >;

  return labels[paymentMethod] ?? 'Não informado';
}
