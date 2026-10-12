import type {
  CompanyCategory,
  ParsedFinancialMessage,
  PaymentMethod,
  TransactionType,
  WhatsAppIntent,
} from '../types';

import { isValidDateOnly } from './financial-normalizer';

const MAX_DESCRIPTION_LENGTH = 255;
const MAX_AMOUNT = 9999999999999.99;

const PAYMENT_METHODS: PaymentMethod[] = [
  'pix',
  'credit_card',
  'debit_card',
  'bank_slip',
  'cash',
  'transfer',
  'other',
];

const TRANSACTION_TYPES: TransactionType[] = ['income', 'expense'];

const INTENTS: WhatsAppIntent[] = [
  'create_transaction',
  'confirm_transaction',
  'cancel_transaction',
  'correct_transaction',
  'unknown',
];

const MISSING_FIELDS = [
  'type',
  'amount',
  'description',
  'category',
  'paymentMethod',
  'transactionDate',
];

export function buildMissingFields(parsed: ParsedFinancialMessage): string[] {
  const missing = new Set<string>();

  if (!parsed.type) {
    missing.add('type');
  }

  if (parsed.amount === null) {
    missing.add('amount');
  }

  if (!parsed.description?.trim()) {
    missing.add('description');
  }

  if (!parsed.categoryId) {
    missing.add('category');
  }

  if (!parsed.paymentMethod) {
    missing.add('paymentMethod');
  }

  if (!parsed.transactionDate) {
    missing.add('transactionDate');
  }

  return MISSING_FIELDS.filter((field) => missing.has(field));
}

export function validateParsedResult(
  input: unknown,
  categories: CompanyCategory[],
): ParsedFinancialMessage {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new Error('A resposta do parser não é um objeto válido.');
  }

  const data = input as Record<string, unknown>;

  const intent = INTENTS.includes(data.intent as WhatsAppIntent)
    ? (data.intent as WhatsAppIntent)
    : 'unknown';

  const type = TRANSACTION_TYPES.includes(data.type as TransactionType)
    ? (data.type as TransactionType)
    : null;

  const amount =
    typeof data.amount === 'number' &&
    Number.isFinite(data.amount) &&
    data.amount > 0 &&
    data.amount <= MAX_AMOUNT
      ? Math.round((data.amount + Number.EPSILON) * 100) / 100
      : null;

  const description =
    typeof data.description === 'string' && data.description.trim().length > 0
      ? data.description.trim().slice(0, MAX_DESCRIPTION_LENGTH)
      : null;

  const paymentMethod = PAYMENT_METHODS.includes(
    data.paymentMethod as PaymentMethod,
  )
    ? (data.paymentMethod as PaymentMethod)
    : null;

  const transactionDate =
    typeof data.transactionDate === 'string' &&
    isValidDateOnly(data.transactionDate)
      ? data.transactionDate
      : null;

  let categoryId: string | null = null;
  let categoryName: string | null = null;

  if (typeof data.categoryId === 'string' && data.categoryId.trim() && type) {
    const category = categories.find(
      (item) => item.id === data.categoryId && item.type === type,
    );

    if (category) {
      categoryId = category.id;
      categoryName = category.name;
    }
  }

  const confidence =
    typeof data.confidence === 'number' && Number.isFinite(data.confidence)
      ? Math.min(1, Math.max(0, data.confidence))
      : 0;

  const parsed: ParsedFinancialMessage = {
    intent,
    type,
    amount,
    description,
    categoryId,
    categoryName,
    paymentMethod,
    transactionDate,
    confidence,
    missingFields: [],
  };

  if (intent !== 'create_transaction') {
    const suppliedMissingFields = Array.isArray(data.missingFields)
      ? data.missingFields.filter(
          (field): field is string =>
            typeof field === 'string' && MISSING_FIELDS.includes(field),
        )
      : [];

    parsed.missingFields = [...new Set(suppliedMissingFields)];

    return parsed;
  }

  parsed.missingFields = buildMissingFields(parsed);

  return parsed;
}
