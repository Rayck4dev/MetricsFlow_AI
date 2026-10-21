"use client";

import { TransactionTypeSummary } from "./TransactionTypeSummary";
import { TransactionFormDetails } from "./TransactionFormDetails";
import { TransactionFormActions } from "./TransactionFormActions";




interface SelectOption {
  value: string;
  label: string;
}

interface TransactionFormFieldsProps {
  type: "income" | "expense";
  amountRaw: string;
  description: string;
  category: string;
  paymentMethod: string;
  date: string;
  categoryOptions: SelectOption[];
  onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onDateChange: (value: string) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  today: string;
}

export function TransactionFormFields({
  type,
  amountRaw,
  description,
  category,
  paymentMethod,
  date,
  categoryOptions,
  onAmountChange,
  onDescriptionChange,
  onCategoryChange,
  onPaymentMethodChange,
  onDateChange,
  isSubmitting,
  onCancel,
  submitLabel,
  onSubmit,
  today,
}: TransactionFormFieldsProps) {
  const isIncome = type === "income";
  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-5">
      <TransactionTypeSummary isIncome={isIncome} />
      <TransactionFormDetails
        isIncome={isIncome}
        amountRaw={amountRaw}
        description={description}
        category={category}
        paymentMethod={paymentMethod}
        date={date}
        categoryOptions={categoryOptions}
        onAmountChange={onAmountChange}
        onDescriptionChange={onDescriptionChange}
        onCategoryChange={onCategoryChange}
        onPaymentMethodChange={onPaymentMethodChange}
        onDateChange={onDateChange}
        isSubmitting={isSubmitting}
        today={today}
      />
      <TransactionFormActions isIncome={isIncome} isSubmitting={isSubmitting} onCancel={onCancel} submitLabel={submitLabel} />
    </form>
  );
}
