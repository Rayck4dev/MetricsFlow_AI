"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { TransactionSelect } from "@/components/movimentacoes/TransactionSelect";
import { TransactionDatePicker } from "@/components/movimentacoes/TransactionDatePicker";
import { formatBRLInput, parseBRL } from "@/types/formatters";

import type { Movimentacao, MovimentacaoTipo } from "./types";

export interface TransactionFormValues {
  type: MovimentacaoTipo;
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

interface TransactionFormProps {
  type: MovimentacaoTipo;
  initialData?: Partial<Movimentacao>;
  categories?: string[];
  onSubmit: (values: TransactionFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const paymentMethods = [
  { value: "pix", label: "Pix" },
  { value: "credit_card", label: "Cartão de crédito" },
  { value: "debit_card", label: "Cartão de débito" },
  { value: "bank_slip", label: "Boleto" },
  { value: "cash", label: "Dinheiro" },
  { value: "transfer", label: "Transferência" },
  { value: "other", label: "Outro" },
];

const defaultCategories = [
  "Vendas / Produtos",
  "Prestação de Serviços",
  "Outras Receitas",
  "Fornecedores / Estoque",
  "Aluguel / Água / Luz",
  "Marketing / Anúncios",
  "DAS / Impostos MEI",
  "Ferramentas / Sistema",
  "Outras Despesas",
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function TransactionForm({
  type,
  initialData,
  categories = defaultCategories,
  onSubmit,
  onCancel,
  submitLabel,
}: TransactionFormProps) {
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [amountInput, setAmountInput] = useState(
    initialData?.amount ? formatBRLInput(String(initialData.amount)) : "",
  );

  const [category, setCategory] = useState(initialData?.category ?? "");

  const [paymentMethod, setPaymentMethod] = useState(
    initialData?.paymentMethod ?? "pix",
  );

  const [date, setDate] = useState(initialData?.date ?? getToday());

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isIncome = type === "income";

  const categoryOptions = useMemo(() => {
    return categories
      .filter((item) => item.trim())
      .map((item) => ({
        value: item,
        label: item,
      }));
  }, [categories]);

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!description.trim()) {
      nextErrors.description = "Informe uma descrição.";
    }

    const amount = parseBRL(amountInput);

    if (!amount || amount <= 0) {
      nextErrors.amount = "Informe um valor válido.";
    }

    if (!category) {
      nextErrors.category = "Selecione uma categoria.";
    }

    if (!paymentMethod) {
      nextErrors.paymentMethod = "Selecione a forma de pagamento.";
    }

    if (!date) {
      nextErrors.date = "Informe a data.";
    }

    setErrors(nextErrors);

    return {
      valid: Object.keys(nextErrors).length === 0,
      amount,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { valid, amount } = validate();

    if (!valid) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        type,
        amount,
        category,
        paymentMethod,
        description: description.trim(),
        date,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAmountChange(value: string) {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      setAmountInput("");
      return;
    }

    setAmountInput(formatBRLInput(numericValue));

    if (errors.amount) {
      setErrors((current) => ({
        ...current,
        amount: "",
      }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Tipo de movimentação
        </span>

        <div
          className={`relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 ${
            isIncome
              ? "border-emerald-500/20 bg-emerald-500/[0.06]"
              : "border-rose-500/20 bg-rose-500/[0.06]"
          }`}
        >
          <motion.div
            layoutId="transaction-type-icon"
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              isIncome
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {isIncome ? (
              <ArrowUpRight size={18} />
            ) : (
              <ArrowDownLeft size={18} />
            )}
          </motion.div>

          <div>
            <p
              className={`text-xs font-bold ${
                isIncome ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {isIncome ? "Nova receita" : "Nova despesa"}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-500">
              {isIncome
                ? "Registre uma entrada de dinheiro."
                : "Registre uma saída de dinheiro."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Valor
        </label>

        <div
          className={`relative rounded-xl border bg-surface-sidebar transition-all ${
            errors.amount
              ? "border-rose-500/50"
              : "border-surface-border focus-within:border-brand-500/60 focus-within:ring-2 focus-within:ring-brand-500/10"
          }`}
        >
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600">
            R$
          </span>

          <input
            value={amountInput}
            inputMode="numeric"
            placeholder="0,00"
            onChange={(event) => handleAmountChange(event.target.value)}
            className="h-12 w-full bg-transparent pl-10 pr-4 text-lg font-bold text-white outline-none placeholder:text-slate-700"
          />
        </div>

        {errors.amount && (
          <p className="text-[10px] font-medium text-rose-400">
            {errors.amount}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="transaction-description"
          className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
        >
          Descrição
        </label>

        <input
          id="transaction-description"
          value={description}
          maxLength={255}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={
            isIncome ? "Ex.: Venda de produtos" : "Ex.: Compra de materiais"
          }
          className={`h-11 w-full rounded-xl border bg-surface-sidebar px-3.5 text-xs font-medium text-slate-200 outline-none transition-all placeholder:text-slate-700 ${
            errors.description
              ? "border-rose-500/50"
              : "border-surface-border focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10"
          }`}
        />

        {errors.description && (
          <p className="text-[10px] font-medium text-rose-400">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TransactionSelect
          label="Categoria"
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          placeholder="Selecione"
          error={errors.category}
        />

        <TransactionSelect
          label="Pagamento"
          value={paymentMethod}
          onChange={setPaymentMethod}
          options={paymentMethods}
          placeholder="Selecione"
          error={errors.paymentMethod}
        />
      </div>

      <TransactionDatePicker
        value={date}
        onChange={setDate}
        error={errors.date}
        max={getToday()}
      />

      <div className="flex items-center justify-end gap-2 border-t border-surface-border pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10 rounded-xl px-4 text-[10px] font-bold text-slate-500 transition-colors hover:bg-surface-sidebar hover:text-slate-300 disabled:opacity-50"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-[10px] font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 ${
            isIncome
              ? "bg-emerald-500 shadow-emerald-500/10 hover:bg-emerald-400"
              : "bg-rose-500 shadow-rose-500/10 hover:bg-rose-400"
          }`}
        >
          {isSubmitting && <Loader2 size={13} className="animate-spin" />}

          {submitLabel ??
            (isIncome ? "Adicionar receita" : "Adicionar despesa")}
        </button>
      </div>
    </form>
  );
}
