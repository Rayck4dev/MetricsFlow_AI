import type { DrePeriod } from "@/components/dre/DrePeriodSelector";
import type { DreCustomRange, DrePeriodRange } from "./types";

export const COST_CATEGORIES = ["Fornecedores", "Fornecedores / Estoque"];

export function isCostCategory(category: string) {
  return COST_CATEGORIES.includes(category);
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function startOfLastThreeMonths(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() - 2, 1);
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date: Date) {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseTransactionDate(date: string) {
  if (!date || typeof date !== "string") {
    return new Date(NaN);
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.slice(0, 10));

  if (!match) {
    return new Date(NaN);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const maxDay = new Date(year, month, 0).getDate();

  if (!year || month < 1 || month > 12 || day < 1 || day > maxDay) {
    return new Date(NaN);
  }

  return new Date(year, month - 1, day);
}

export function getPeriodRange(
  period: DrePeriod,
  customRange: DreCustomRange,
): DrePeriodRange {
  const now = new Date();

  switch (period) {
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "week":
      return { start: startOfWeek(now), end: endOfDay(now) };
    case "month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "last-month": {
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        start: startOfMonth(previousMonth),
        end: endOfMonth(previousMonth),
      };
    }
    case "quarter":
      return { start: startOfLastThreeMonths(now), end: endOfDay(now) };
    case "year":
      return { start: startOfYear(now), end: endOfYear(now) };
    case "custom": {
      const customStart = parseTransactionDate(customRange.start);
      const customEnd = parseTransactionDate(customRange.end);

      if (
        Number.isNaN(customStart.getTime()) ||
        Number.isNaN(customEnd.getTime()) ||
        customStart > customEnd
      ) {
        return { start: new Date(NaN), end: new Date(NaN) };
      }

      return { start: startOfDay(customStart), end: endOfDay(customEnd) };
    }
    default:
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
}

function formatDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("pt-BR");
}

export function getPeriodLabel(
  period: DrePeriod,
  customRange: DreCustomRange,
) {
  const now = new Date();

  switch (period) {
    case "today":
      return now.toLocaleDateString("pt-BR");
    case "week":
      return `Semana de ${formatDate(startOfWeek(now))} a ${formatDate(now)}`;
    case "month":
      return now.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
    case "last-month": {
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return previousMonth.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
    }
    case "quarter":
      return `${formatDate(startOfLastThreeMonths(now))} a ${formatDate(now)}`;
    case "year":
      return String(now.getFullYear());
    case "custom": {
      const start = parseTransactionDate(customRange.start);
      const end = parseTransactionDate(customRange.end);

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        start > end
      ) {
        return "Período personalizado inválido";
      }

      return `${formatDate(start)} a ${formatDate(end)}`;
    }
    default:
      return "";
  }
}
