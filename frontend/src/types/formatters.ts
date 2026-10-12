export function formatBRLInput(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  const numericValue = Number(digits) / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

export function parseBRL(value: string): number {
  const digits = value.replace(/\D/g, "");

  if (!digits) return 0;

  return Number(digits) / 100;
}

export function formatDateBR(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "Não informado";

  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("55") && digits.length === 13) {
    return `+55 (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }

  if (digits.startsWith("55") && digits.length === 12) {
    return `+55 (${digits.slice(2, 4)}) ${digits.slice(4, 8)}-${digits.slice(8)}`;
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone;
}
