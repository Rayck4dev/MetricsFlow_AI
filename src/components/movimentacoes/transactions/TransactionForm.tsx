"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { TransactionSelect } from "@/components/movimentacoes/transactions/TransactionSelect";
import { TransactionDatePicker } from "@/components/movimentacoes/transactions/TransactionDatePicker";

import { formatBRLInput, parseBRL } from "@/types/formatters";

import type { TransactionType } from "@/constants/transaction.constants";

export interface TransactionFormValues {
  type: TransactionType;
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

interface TransactionFormProps {
  type: TransactionType;
  initialData?: Partial<TransactionFormValues>;
  categories?: string[];

  onSubmit: (transaction: TransactionFormValues) => void | Promise<void>;

  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const paymentMethods = [
  {
    value: "pix",
    label: "Pix",
  },
  {
    value: "credit_card",
    label: "Cartão de crédito",
  },
  {
    value: "debit_card",
    label: "Cartão de débito",
  },
  {
    value: "bank_slip",
    label: "Boleto",
  },
  {
    value: "cash",
    label: "Dinheiro",
  },
  {
    value: "transfer",
    label: "Transferência",
  },
  {
    value: "other",
    label: "Outro",
  },
];

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function formatInitialAmount(value?: number): string {
  if (typeof value !== "number" || value <= 0) {
    return "";
  }

  const cents = Math.round(value * 100);

  return formatBRLInput(String(cents));
}

export default function TransactionForm({
  type,
  initialData,
  categories = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
}: TransactionFormProps) {
  const isIncome = type === "income";

  const [amountInput, setAmountInput] = useState(() =>
    formatInitialAmount(initialData?.amount),
  );

  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [category, setCategory] = useState(initialData?.category ?? "");

  const [paymentMethod, setPaymentMethod] = useState(
    initialData?.paymentMethod ?? "pix",
  );

  const [date, setDate] = useState(initialData?.date ?? getToday());

  const [error, setError] = useState("");

  useEffect(() => {
    setAmountInput(formatInitialAmount(initialData?.amount));

    setDescription(initialData?.description ?? "");

    setCategory(initialData?.category ?? "");

    setPaymentMethod(initialData?.paymentMethod ?? "pix");

    setDate(initialData?.date ?? getToday());

    setError("");
  }, [
    initialData?.amount,
    initialData?.description,
    initialData?.category,
    initialData?.paymentMethod,
    initialData?.date,
  ]);

  const categoryOptions = useMemo(() => {
    return categories
      .filter((item) => item.trim() !== "")
      .map((item) => ({
        value: item,
        label: item,
      }));
  }, [categories]);

  function handleAmountChange(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");

    const formatted = formatBRLInput(onlyNumbers);

    setAmountInput(formatted);

    if (error) {
      setError("");
    }
  }

  function handleDescriptionChange(value: string) {
    setDescription(value);

    if (error) {
      setError("");
    }
  }

  function handleCategoryChange(value: string) {
    setCategory(value);

    if (error) {
      setError("");
    }
  }

  function handlePaymentMethodChange(value: string) {
    setPaymentMethod(value);

    if (error) {
      setError("");
    }
  }

  function handleDateChange(value: string) {
    setDate(value);

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = parseBRL(amountInput);

    if (amount <= 0) {
      setError("Informe um valor válido.");
      return;
    }

    if (!description.trim()) {
      setError("Informe uma descrição.");
      return;
    }

    if (!category) {
      setError("Selecione uma categoria.");
      return;
    }

    if (!paymentMethod) {
      setError("Selecione a forma de pagamento.");
      return;
    }

    if (!date) {
      setError("Informe a data.");
      return;
    }

    setError("");

    const transaction: TransactionFormValues = {
      type,
      amount,
      category,
      paymentMethod,
      description: description.trim(),
      date,
    };

    await onSubmit(transaction);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-5">
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
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
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
          className={`rounded-xl border bg-surface-sidebar transition-all ${
            error && parseBRL(amountInput) <= 0
              ? "border-rose-500/50 focus-within:border-rose-400"
              : "border-surface-border focus-within:border-brand-500/60 focus-within:ring-2 focus-within:ring-brand-500/10"
          }`}
        >
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={amountInput}
            onChange={(event) => handleAmountChange(event.target.value)}
            disabled={isSubmitting}
            placeholder="R$ 0,00"
            className="h-12 w-full bg-transparent px-4 text-lg font-bold text-white outline-none placeholder:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
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
          type="text"
          value={description}
          maxLength={255}
          onChange={(event) => handleDescriptionChange(event.target.value)}
          disabled={isSubmitting}
          placeholder={
            isIncome ? "Ex.: Venda de produtos" : "Ex.: Compra de materiais"
          }
          className="h-11 w-full rounded-xl border border-surface-border bg-surface-sidebar px-3.5 text-xs font-medium text-slate-200 outline-none transition-all placeholder:text-slate-700 focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TransactionSelect
          label="Categoria"
          value={category}
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder="Selecione"
          disabled={isSubmitting}
        />

        <TransactionSelect
          label="Pagamento"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          options={paymentMethods}
          placeholder="Selecione"
          disabled={isSubmitting}
        />
      </div>

      <TransactionDatePicker
        value={date}
        onChange={handleDateChange}
      />

      {error && (
        <div className="rounded-xl border border-rose-500/15 bg-rose-500/[0.05] px-3.5 py-3">
          <p className="text-[9px] font-medium leading-4 text-rose-400">
            {error}
          </p>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 border-t border-surface-border pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10 rounded-xl px-4 text-[10px] font-bold text-slate-500 transition-colors hover:bg-surface-sidebar hover:text-slate-300 disabled:pointer-events-none disabled:opacity-50"
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

          {submitLabel ?? (isIncome ? "Salvar receita" : "Salvar despesa")}
        </button>
      </div>
    </form>
  );
}
