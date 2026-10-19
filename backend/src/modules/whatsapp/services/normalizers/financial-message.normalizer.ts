import type {
  CompanyCategory,
  ParsedFinancialMessage,
} from '../../../ai/types';

export function normalizeMissingField(field: string): string {
  switch (field) {
    case 'payment_method':
      return 'paymentMethod';
    case 'transaction_date':
      return 'transactionDate';
    case 'categoryId':
    case 'category_id':
      return 'category';
    default:
      return field;
  }
}

export function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function sanitizeDescription(
  description: string,
  amount?: number | null,
): string {
  let cleaned = description;

  if (amount != null && Number.isFinite(Number(amount))) {
    const amountStr = amount.toString();
    const amountRegex = new RegExp(
      `\\b(r\\$\\s*)?${amountStr}(\\s*reais)?\\b`,
      'gi',
    );
    cleaned = cleaned.replace(amountRegex, '').trim();
  }

  cleaned = cleaned
    .replace(/Informação complementar:.*/gi, '')
    .replace(/\b(r\$\s*|\d+(\,\d{1,2})?\s*reais|reais)\b/gi, '')
    .trim();

  cleaned = cleaned
    .replace(/^(com|de|do|da|dos|das|no|na|nos|nas|em|para|por|via)\s+/i, '')
    .replace(/\s+(com|de|do|da|dos|das|no|na|nos|nas|em|para|por|via)$/i, '')
    .trim();

  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : '';
}

export function normalizeParsedMessage(
  parsed: ParsedFinancialMessage,
  messageText: string,
  categories: CompanyCategory[],
): void {
  parsed.missingFields = Array.from(
    new Set((parsed.missingFields ?? []).map(normalizeMissingField)),
  );

  if (parsed.description) {
    parsed.description = sanitizeDescription(parsed.description, parsed.amount);
  }

  if (!parsed.description?.trim()) {
    parsed.description = null;
    if (!parsed.missingFields.includes('description')) {
      parsed.missingFields.push('description');
    }
  } else {
    parsed.description = parsed.description.trim().slice(0, 255);
    parsed.missingFields = parsed.missingFields.filter(
      (field) => field !== 'description',
    );
  }

  if (
    parsed.amount == null ||
    !Number.isFinite(Number(parsed.amount)) ||
    Number(parsed.amount) <= 0
  ) {
    parsed.amount = null;
    if (!parsed.missingFields.includes('amount')) {
      parsed.missingFields.push('amount');
    }
  } else {
    parsed.amount = Number(parsed.amount);
    parsed.missingFields = parsed.missingFields.filter(
      (field) => field !== 'amount',
    );
  }

  if (parsed.type !== 'income' && parsed.type !== 'expense') {
    parsed.type = null;
    if (!parsed.missingFields.includes('type')) {
      parsed.missingFields.push('type');
    }
  } else {
    parsed.missingFields = parsed.missingFields.filter(
      (field) => field !== 'type',
    );
  }

  if (!parsed.transactionDate || !isValidDateOnly(parsed.transactionDate)) {
    parsed.transactionDate = null;
    if (!parsed.missingFields.includes('transactionDate')) {
      parsed.missingFields.push('transactionDate');
    }
  } else {
    parsed.missingFields = parsed.missingFields.filter(
      (field) => field !== 'transactionDate',
    );
  }

  const validPaymentMethods = [
    'pix',
    'credit_card',
    'debit_card',
    'bank_slip',
    'cash',
    'transfer',
    'other',
  ];

  if (
    !parsed.paymentMethod ||
    !validPaymentMethods.includes(parsed.paymentMethod)
  ) {
    parsed.paymentMethod = null;
    if (!parsed.missingFields.includes('paymentMethod')) {
      parsed.missingFields.push('paymentMethod');
    }
  } else {
    parsed.missingFields = parsed.missingFields.filter(
      (field) => field !== 'paymentMethod',
    );
  }

  const validCategory = categories.find(
    (category) =>
      category.id === parsed.categoryId && category.type === parsed.type,
  );

  if (validCategory) {
    parsed.categoryId = validCategory.id;
    parsed.categoryName = validCategory.name;
    parsed.missingFields = parsed.missingFields.filter(
      (field) => field !== 'category',
    );
  } else {
    parsed.categoryId = null;
    parsed.categoryName = null;
    if (!parsed.missingFields.includes('category')) {
      parsed.missingFields.push('category');
    }
  }

  if (!messageText.trim() && !parsed.missingFields.includes('description')) {
    parsed.missingFields.push('description');
  }

  parsed.missingFields = Array.from(
    new Set(parsed.missingFields.map(normalizeMissingField)),
  );
}

export function getMissingFieldQuestion(
  parsed: ParsedFinancialMessage,
): string {
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
