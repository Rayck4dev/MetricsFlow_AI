"use client";

import { useEffect, useMemo, useState } from "react";
import { TransactionFormFields } from "./transaction-form/TransactionFormFields";

export interface TransactionFormValues {
  type: "income" | "expense";
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
}

interface TransactionFormProps {
  type: "income" | "expense";

  initialData?: Partial<TransactionFormValues>;

  categories?: string[];

  onSubmit: (transaction: TransactionFormValues) => void | Promise<void>;

  onCancel?: () => void;

  isSubmitting?: boolean;

  submitLabel?: string;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function formatAmount(value: number) {
  if (!value || value <= 0) {
    return "";
  }

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const numericValue = Number(digits) / 100;

  return numericValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseAmount(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return 0;
  }

  return Number(digits) / 100;
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
  const [amountRaw, setAmountRaw] = useState(
    formatAmount(initialData?.amount ?? 0),
  );

  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [category, setCategory] = useState(initialData?.category ?? "");

  const [paymentMethod, setPaymentMethod] = useState(
    initialData?.paymentMethod ?? "",
  );

  const [date, setDate] = useState(initialData?.date ?? getToday());

  useEffect(() => {
    setAmountRaw(formatAmount(initialData?.amount ?? 0));
    setDescription(initialData?.description ?? "");
    setCategory(initialData?.category ?? "");
    setPaymentMethod(initialData?.paymentMethod ?? "");
    setDate(initialData?.date ?? getToday());
  }, [initialData]);

  const categoryOptions = useMemo(() => {
    return categories
      .filter((item) => item.trim())
      .map((item) => ({
        value: item,
        label: item,
      }));
  }, [categories]);

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCurrencyInput(event.target.value);

    setAmountRaw(formatted);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = parseAmount(amountRaw);

    const transaction: TransactionFormValues = {
      type,
      amount,
      category,
      paymentMethod,
      description: description.trim(),
      date,
    };

    void onSubmit(transaction);
  }

  return (
    <TransactionFormFields
      type={type}
      amountRaw={amountRaw}
      description={description}
      category={category}
      paymentMethod={paymentMethod}
      date={date}
      categoryOptions={categoryOptions}
      onAmountChange={handleAmountChange}
      onDescriptionChange={(value) => setDescription(value)}
      onCategoryChange={setCategory}
      onPaymentMethodChange={setPaymentMethod}
      onDateChange={setDate}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      today={getToday()}
    />
  );
}
