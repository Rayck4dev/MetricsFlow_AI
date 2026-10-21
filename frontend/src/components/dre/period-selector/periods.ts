import type { DrePeriod } from "../DrePeriodSelector";

export const PERIODS: {
  value: DrePeriod;
  label: string;
  description: string;
}[] = [
  { value: "today", label: "Hoje", description: "Movimentações do dia" },
  {
    value: "week",
    label: "Esta semana",
    description: "Da segunda-feira até hoje",
  },
  { value: "month", label: "Este mês", description: "Período atual" },
  {
    value: "last-month",
    label: "Mês anterior",
    description: "Último mês fechado",
  },
  {
    value: "quarter",
    label: "Últimos 3 meses",
    description: "Inclui o mês atual",
  },
  { value: "year", label: "Este ano", description: "Resultado anual" },
  { value: "custom", label: "Personalizado", description: "Escolha as datas" },
];
