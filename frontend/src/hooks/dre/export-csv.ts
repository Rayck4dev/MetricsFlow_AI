import type { DrePeriod } from "@/components/dre/DrePeriodSelector";
import type {
  DreBreakdownItem,
  DreChartItem,
  DreCustomRange,
  DreFinancialData,
} from "./types";
import { getPeriodLabel } from "./date-utils";

interface ExportDreCsvInput {
  period: DrePeriod;
  customRange: DreCustomRange;
  financialData: DreFinancialData;
  revenueItems: DreBreakdownItem[];
  costItems: DreBreakdownItem[];
  expenseItems: DreBreakdownItem[];
  chartData: DreChartItem[];
}

function escapeCsvValue(value: string | number | null | undefined) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercentage(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function addRow(
  lines: string[],
  section: string,
  item: string,
  value: string,
  percentage = "",
) {
  lines.push(
    [
      escapeCsvValue(section),
      escapeCsvValue(item),
      escapeCsvValue(value),
      escapeCsvValue(percentage),
    ].join(";"),
  );
}

function addBreakdownRows(
  lines: string[],
  section: string,
  items: DreBreakdownItem[],
) {
  if (!items.length) {
    addRow(lines, section, "Nenhum registro", "R$ 0,00", "0,00%");
    return;
  }

  items.forEach((item) => {
    addRow(
      lines,
      section,
      item.label,
      `R$ ${formatCurrency(item.value)}`,
      `${formatPercentage(item.percentage)}%`,
    );
  });
}

function createCsvLines({
  period,
  customRange,
  financialData,
  revenueItems,
  costItems,
  expenseItems,
  chartData,
}: ExportDreCsvInput) {
  const lines: string[] = [];

  addRow(lines, "Seção", "Item", "Valor", "Percentual");
  addRow(lines, "Relatório", "MetricsFlow AI - DRE", "", "");
  addRow(lines, "Relatório", "Período", getPeriodLabel(period, customRange));

  const indicators = [
    ["Receita Bruta", financialData.revenue],
    ["Custos", financialData.costs],
    ["Despesas", financialData.expenses],
    ["Resultado", financialData.result],
  ] as const;

  indicators.forEach(([label, amount]) => {
    addRow(lines, "Indicadores", label, `R$ ${formatCurrency(amount)}`);
  });

  const margin =
    financialData.revenue > 0
      ? (financialData.result / financialData.revenue) * 100
      : 0;
  addRow(lines, "Indicadores", "Margem", `${formatPercentage(margin)}%`);

  addBreakdownRows(lines, "Receitas", revenueItems);
  addBreakdownRows(lines, "Custos", costItems);
  addBreakdownRows(lines, "Despesas", expenseItems);

  if (!chartData.length) {
    addRow(lines, "Evolução mensal", "Nenhum registro", "R$ 0,00");
  } else {
    chartData.forEach((item) => {
      addRow(
        lines,
        "Evolução mensal",
        item.month,
        `R$ ${formatCurrency(item.result)}`,
      );
    });
  }

  return lines;
}

export function exportDreCsv(input: ExportDreCsvInput) {
  const csvWithBom = `\uFEFF${createCsvLines(input).join("\r\n")}`;
  const blob = new Blob([csvWithBom], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  link.href = url;
  link.download = `metricsflow-dre-${year}-${month}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
