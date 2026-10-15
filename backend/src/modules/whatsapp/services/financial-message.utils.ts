import type { CompanyCategory, ParsedFinancialMessage } from '../../ai/types';

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

export function normalizeParsedMessage(
  parsed: ParsedFinancialMessage,
  messageText: string,
  categories: CompanyCategory[],
): void {
  parsed.missingFields = Array.from(
    new Set((parsed.missingFields ?? []).map(normalizeMissingField)),
  );

  if (parsed.description) {
    parsed.description = parsed.description
      .replace(/Informação complementar:.*/gi, '')
      .replace(/^(com|de|do|da|dos|das|no|na|nos|nas|em|para|por|via)\s+/i, '')
      .replace(/\s+(com|de|do|da|dos|das|no|na|nos|nas|em|para|por|via)$/i, '')
      .trim();

    if (parsed.description.length > 0) {
      parsed.description =
        parsed.description.charAt(0).toUpperCase() +
        parsed.description.slice(1);
    }
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

export function missingQuestion(parsed: ParsedFinancialMessage): string {
  const missing = new Set(
    (parsed.missingFields ?? []).map(normalizeMissingField),
  );

  if (missing.has('type')) {
    return 'Essa movimentação foi uma receita ou uma despesa?';
  }

  if (missing.has('amount')) {
    return 'Qual foi o valor da movimentação? Pode informar, por exemplo, R$ 150,00.';
  }

  if (missing.has('description')) {
    return 'O que você recebeu ou pagou? Informe uma descrição curta da movimentação.';
  }

  if (missing.has('category')) {
    return 'Não consegui identificar a categoria dessa movimentação. O valor foi referente a quê?';
  }

  if (missing.has('paymentMethod')) {
    return 'Como foi o pagamento? Pode responder Pix, cartão de crédito, cartão de débito, boleto, dinheiro ou transferência.';
  }

  if (missing.has('transactionDate')) {
    return 'Em que data aconteceu essa movimentação? Informe no formato DD/MM/AAAA.';
  }

  return 'Preciso de mais algumas informações para preparar a movimentação. Pode explicar um pouco melhor?';
}

export function formatConfirmation(parsed: ParsedFinancialMessage): string {
  const kind = parsed.type === 'income' ? '💰 Receita' : '💸 Despesa';

  return [
    `${kind} identificada:`,
    '',
    `Descrição: ${parsed.description ?? 'Não informada'}`,
    `Valor: ${money(parsed.amount)}`,
    `Categoria: ${parsed.categoryName ?? 'Não identificada'}`,
    `Pagamento: ${getPaymentMethodLabel(parsed.paymentMethod)}`,
    `Data: ${datePtBr(parsed.transactionDate)}`,
    '',
    'Confira os dados antes de continuar.',
    '✅ Responda: Confirmar',
    '✏️ Responda: Corrigir',
    '❌ Responda: Cancelar',
  ].join('\n');
}
