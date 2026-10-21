"use client";

import { TransactionSelect } from "@/components/movimentacoes/transactions/TransactionSelect";
import { TransactionDatePicker } from "@/components/movimentacoes/transactions/TransactionDatePicker";

interface SelectOption {
  value: string;
  label: string;
}

interface TransactionFormDetailsProps {
  isIncome: boolean;
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
  today: string;
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

export function TransactionFormDetails({
  isIncome,
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
  today,
}: TransactionFormDetailsProps) {
  return (
    <>
      <div className="space-y-2">
        <label
          htmlFor="transaction-amount"
          className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
        >
          Valor
        </label>
        <div className="relative rounded-xl border border-surface-border bg-surface-sidebar transition-all focus-within:border-brand-500/60 focus-within:ring-2 focus-within:ring-brand-500/10">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600">
            R$
          </span>
          <input
            id="transaction-amount"
            type="text"
            value={amountRaw}
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            placeholder="0,00"
            onChange={onAmountChange}
            disabled={isSubmitting}
            className="h-12 w-full bg-transparent pl-10 pr-4 text-lg font-bold text-white outline-none placeholder:text-slate-700 disabled:opacity-60"
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
          onChange={(event) => onDescriptionChange(event.target.value)}
          disabled={isSubmitting}
          placeholder={
            isIncome ? "Ex.: Venda de produtos" : "Ex.: Compra de materiais"
          }
          className="h-11 w-full rounded-xl border border-surface-border bg-surface-sidebar px-3.5 text-xs font-medium text-slate-200 outline-none transition-all placeholder:text-slate-700 focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10 disabled:opacity-60"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TransactionSelect
          label="Categoria"
          value={category}
          onChange={onCategoryChange}
          options={categoryOptions}
          placeholder="Selecione"
          disabled={isSubmitting}
        />
        <TransactionSelect
          label="Pagamento"
          value={paymentMethod}
          onChange={onPaymentMethodChange}
          options={paymentMethods}
          placeholder="Selecione"
          disabled={isSubmitting}
        />
      </div>
      <TransactionDatePicker value={date} onChange={onDateChange} max={today} />
    </>
  );
}
