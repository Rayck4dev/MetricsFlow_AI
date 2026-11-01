import type { PaymentMethod, TransactionType, WhatsAppIntent } from '../types';
import {
  currentLocalDate,
  normalizeAmount,
  normalizeText,
} from './financial-normalizer';

export const PAYMENT_ALIASES: Array<[RegExp, PaymentMethod]> = [
  [/\bpix\b/i, 'pix'],
  [/\bcart[aã]o\s+de\s+cr[eé]dito\b|\bcr[eé]dito\b/i, 'credit_card'],
  [/\bcart[aã]o\s+de\s+d[eé]bito\b|\bd[eé]bito\b/i, 'debit_card'],
  [/\bboleto\b/i, 'bank_slip'],
  [/\bdinheiro\b|\besp[eé]cie\b/i, 'cash'],
  [/\btransfer[eê]ncia\b|\btransferi\b/i, 'transfer'],
  [/\boutro meio\b|\boutros meios\b/i, 'other'],
];

export function inferAmount(text: string): number | null {
  const moneyMatch = text.match(/R\$\s*\d[\d.,]*/i);

  if (moneyMatch) {
    const amount = normalizeAmount(moneyMatch[0]);
    if (amount !== null) {
      return amount;
    }
  }

  const numberMatch = text.match(/(?:^|\s)(\d+(?:[.,]\d{1,2})?)(?=\s|$)/);
  return numberMatch ? normalizeAmount(numberMatch[1]) : null;
}

export function inferType(text: string): TransactionType | null {
  const normalized = normalizeText(text);

  const expenseWords = [
    'gastei',
    'paguei',
    'comprei',
    'despesa',
    'saiu',
    'custo',
    'custou',
    'pago',
    'descontaram',
  ];

  const incomeWords = [
    'recebi',
    'entrou',
    'faturei',
    'vendi',
    'venda',
    'receita',
    'ganhei',
    'pagaram',
    'faturamento',
  ];

  const hasExpense = expenseWords.some((word) => normalized.includes(word));
  const hasIncome = incomeWords.some((word) => normalized.includes(word));

  if (hasExpense === hasIncome) {
    return null;
  }

  return hasExpense ? 'expense' : 'income';
}

export function inferPaymentMethod(text: string): PaymentMethod | null {
  for (const [pattern, method] of PAYMENT_ALIASES) {
    if (pattern.test(text)) {
      return method;
    }
  }

  return null;
}

export function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function inferDate(text: string): string | null {
  const normalized = normalizeText(text);
  const today = currentLocalDate();
  const baseDate = new Date(`${today}T12:00:00Z`);

  if (/\banteontem\b/.test(normalized)) {
    baseDate.setUTCDate(baseDate.getUTCDate() - 2);
    return formatDate(baseDate);
  }

  if (/\bontem\b/.test(normalized)) {
    baseDate.setUTCDate(baseDate.getUTCDate() - 1);
    return formatDate(baseDate);
  }

  if (/\bhoje\b/.test(normalized)) {
    return today;
  }

  const match = text.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);

  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    let year = match[3] ? Number(match[3]) : Number(today.slice(0, 4));

    if (year < 100) {
      year += 2000;
    }

    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return null;
    }

    return formatDate(date);
  }

  return today;
}

export function inferIntent(text: string): WhatsAppIntent {
  const normalized = normalizeText(text);

  if (
    /^\s*(sim|confirmo|confirmar|pode salvar|pode registrar)\s*[.!?]*\s*$/.test(
      normalized,
    )
  ) {
    return 'confirm_transaction';
  }

  if (
    /^\s*(nao|cancela|cancelar|desiste|desistir)\s*[.!?]*\s*$/.test(normalized)
  ) {
    return 'cancel_transaction';
  }

  if (
    /\b(corrige|corrigir|correcao|alterar|altera|mudar|trocar)\b/.test(
      normalized,
    )
  ) {
    return 'correct_transaction';
  }

  return 'create_transaction';
}

export function buildDescription(text: string): string | null {
  let description = text.trim();

  description = description.replace(/R\$\s*\d[\d.]*(?:,\d{1,2})?/gi, ' ');
  description = description.replace(
    /\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/g,
    ' ',
  );
  description = description.replace(/\b(hoje|ontem|anteontem)\b/gi, ' ');
  description = description.replace(
    /\b(cart[aã]o\s+de\s+cr[eé]dito|cart[aã]o\s+de\s+d[eé]bito|cr[eé]dito|d[eé]bito|pix|boleto|dinheiro|esp[eé]cie|transfer[eê]ncia|transferi)\b/gi,
    ' ',
  );

  const normalized = description.replace(/\s+/g, ' ').trim();

  const patterns = [
    /\b(?:pela|por causa da)\s+(venda\s+de\s+.+)$/i,
    /\b(?:pela|por causa da)\s+(compra\s+de\s+.+)$/i,
    /\b(?:pela|por causa do)\s+(pagamento\s+de\s+.+)$/i,
    /\b(?:com|para)\s+(combustível|abastecimento(?:\s+do\s+carro)?)\b.*$/i,
    /\b(?:de|com)\s+(internet|aluguel|energia elétrica|água)\b.*$/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);

    if (match?.[1]) {
      return match[1].trim().slice(0, 255);
    }
  }

  description = normalized
    .replace(
      /^(?:recebi|entrou|faturei|vendi|ganhei|pagaram|faturamento|gastei|paguei|comprei|descontaram)\b\s*/i,
      '',
    )
    .replace(/\b(?:via|pelo|pela|através)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!description) {
    return null;
  }

  return description.slice(0, 255);
}
