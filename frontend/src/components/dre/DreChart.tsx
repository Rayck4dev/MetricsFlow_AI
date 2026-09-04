"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DreChartProps {
  data: {
    month: string;
    revenue: number;
    costs: number;
    expenses: number;
    result: number;
  }[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DreChart({ data }: DreChartProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xl shadow-black/10"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xs font-bold text-white">
            Desempenho financeiro
          </h2>

          <p className="mt-1 text-[8px] text-slate-600">
            Evolução de receita, custos, despesas e resultado
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Legend label="Receita" className="bg-cpm-income" />
          <Legend label="Custos" className="bg-cpm-expense" />
          <Legend label="Resultado" className="bg-brand-500" />
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 8,
              right: 8,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.22} />

                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="resultGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.18} />

                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#334155"
              strokeOpacity={0.35}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 9,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 8,
              }}
              tickFormatter={(value) => `R$ ${Number(value) / 1000}k`}
            />

            <Tooltip
              cursor={{
                stroke: "#334155",
                strokeWidth: 1,
              }}
              contentStyle={{
                background: "#0b1329",
                border: "1px solid #334155",
                borderRadius: "12px",
                fontSize: "10px",
              }}
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                name === "revenue"
                  ? "Receita"
                  : name === "costs"
                    ? "Custos"
                    : name === "expenses"
                      ? "Despesas"
                      : "Resultado",
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />

            <Area
              type="monotone"
              dataKey="costs"
              stroke="#ef4444"
              strokeWidth={1.5}
              fill="transparent"
            />

            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f97316"
              strokeWidth={1.5}
              fill="transparent"
            />

            <Area
              type="monotone"
              dataKey="result"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#resultGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}

function Legend({ label, className }: { label: string; className: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[8px] font-semibold text-slate-500">
      <span className={`h-1.5 w-1.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}
