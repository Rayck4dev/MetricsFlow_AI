"use client";

import { useState } from "react";

import {
  CATEGORIES,
  TransactionFormData,
  TransactionType,
} from "@/constants/transaction.constants";

interface UseTransactionProps {
  defaultType?: TransactionType;
  onSave?: (data: TransactionFormData) => void | Promise<void>;
  onSuccess?: () => void;
}

export function useTransaction({
  defaultType = "income",
  onSave,
  onSuccess,
}: UseTransactionProps = {}) {
  const [type, setType] = useState<TransactionType>(defaultType);

  const [amountRaw, setAmountRaw] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [date, setDate] = useState(getToday());

  const [isSuccess, setIsSuccess] = useState(false);

  function handleTypeChange(newType: TransactionType) {
    setType(newType);
    setCategory("");
  }

  function handleAmountChange(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");

    if (!onlyNumbers) {
      setAmountRaw("");
      return;
    }

    const numericValue = Number(onlyNumbers) / 100;

    setAmountRaw(
      numericValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  }

  function getNumericAmount() {
    if (!amountRaw) {
      return 0;
    }

    return Number(amountRaw.replace(/\./g, "").replace(",", "."));
  }

  function validate() {
    const numericAmount = getNumericAmount();

    if (numericAmount <= 0) {
      return false;
    }

    if (!description.trim()) {
      return false;
    }

    if (!category) {
      return false;
    }

    if (!paymentMethod) {
      return false;
    }

    if (!date) {
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validate()) {
      return;
    }

    const data: TransactionFormData = {
      type,
      amount: getNumericAmount(),
      description: description.trim(),
      category,
      paymentMethod,
      date,
    };

    try {
      await onSave?.(data);

      setIsSuccess(true);

      window.setTimeout(() => {
        setIsSuccess(false);
        resetForm();
        onSuccess?.();
      }, 1200);
    } catch (error) {
      console.error("Erro ao salvar movimentação:", error);
    }
  }

  function resetForm() {
    setAmountRaw("");
    setDescription("");
    setCategory("");
    setPaymentMethod("Pix");
    setDate(getToday());
    setType(defaultType);
    setIsSuccess(false);
  }

  return {
    type,

    amountRaw,
    description,
    category,
    paymentMethod,
    date,

    isSuccess,

    categories: CATEGORIES[type],

    setDescription,
    setCategory,
    setPaymentMethod,
    setDate,

    handleTypeChange,
    handleAmountChange,
    handleSubmit,
    resetForm,
  };
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}
