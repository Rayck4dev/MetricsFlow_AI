import type { DrePeriod } from "@/components/dre/DrePeriodSelector";
import type {
  DreBreakdownItem,
  DreChartItem,
  DreFinancialData,
  DreTransaction,
} from "@/types";

export type {
  DreBreakdownItem,
  DreChartItem,
  DreFinancialData,
  DreTransaction,
};

export type { DrePeriod };

export interface DreCustomRange {
  start: string;
  end: string;
}

export interface DrePeriodRange {
  start: Date;
  end: Date;
}
