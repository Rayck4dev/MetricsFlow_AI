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
