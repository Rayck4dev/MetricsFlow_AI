const MAX_AMOUNT = 9999999999999.99;

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function normalizeAmount(raw: string): number | null {
  let value = raw.replace(/R\$/gi, '').replace(/\s/g, '').trim();

  if (!value) {
    return null;
  }

  if (/^\d{1,3}(?:\.\d{3})+,\d{1,2}$/.test(value)) {
    value = value.replace(/\./g, '').replace(',', '.');
  } else if (/^\d+,\d{1,2}$/.test(value)) {
    value = value.replace(',', '.');
  } else if (/^\d{1,3}(?:,\d{3})+\.\d{1,2}$/.test(value)) {
    value = value.replace(/,/g, '');
  } else if (/^\d{1,3}(?:\.\d{3})+$/.test(value)) {
    value = value.replace(/\./g, '');
  }

  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
    return null;
  }

  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return null;
  }

  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function currentLocalDate(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
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

export function formatUtcDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
