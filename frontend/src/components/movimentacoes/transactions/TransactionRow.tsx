"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import type { Movimentacao } from "@/types/index";

import { formatCurrency, getPaymentIcon } from "@/utils/transaction.utils";

import { getPaymentMethodLabel } from "@/constants/transaction.constants";

import { TransactionActions } from "./TransactionActions";
import { TransactionMobileActions } from "./TransactionMobileActions";

interface TransactionRowProps {
  transaction: Movimentacao;
  index: number;

  onEdit?: (transaction: Movimentacao) => void;
  onDelete?: (transaction: Movimentacao) => void;
}

export function TransactionRow({
  transaction,
  index,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const income = transaction.type === "income";

  const PaymentIcon = getPaymentIcon(transaction.paymentMethod);
  const paymentMethodLabel = getPaymentMethodLabel(transaction.paymentMethod);

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -8,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: 0.04 * index,
        duration: 0.3,
      }}
      className={`
        group relative grid min-w-0
        gap-3 px-7 py-4
        transition-colors hover:bg-white/[0.015]
        md:items-center md:gap-4
        ${
          hasActions
            ? "md:grid-cols-[minmax(0,2fr)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(90px,1fr)_minmax(120px,auto)_72px]"
            : "md:grid-cols-[minmax(0,2fr)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(90px,1fr)_minmax(120px,auto)]"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <motion.div
          whileHover={{
            scale: 1.08,
            rotate: income ? 3 : -3,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
            income
              ? "border-emerald-500/10 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/10 bg-red-500/10 text-red-400"
          }`}
        >
          {income ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
        </motion.div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold text-slate-200">
            {transaction.description}
          </p>

          <p className="mt-0.5 truncate text-[8px] text-slate-600">
            {income ? "Entrada" : "Saída"}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center md:justify-center">
        <span className="inline-flex max-w-full truncate rounded-full border border-surface-border bg-surface-sidebar px-2.5 py-1 text-[8px] font-semibold text-slate-500">
          {transaction.category}
        </span>
      </div>

      <div className="flex min-w-0 items-center justify-start gap-1.5 text-[9px] text-slate-500 md:justify-center">
        <PaymentIcon size={12} className="shrink-0" />

        <span className="truncate">{paymentMethodLabel}</span>
      </div>

      <div className="min-w-0 text-left text-[9px] text-slate-600 md:text-center">
        <span className="truncate">{transaction.date}</span>
      </div>

      <div
        className={`shrink-0 text-left text-[10px] font-bold md:text-right ${
          income ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {income ? "+" : "-"} {formatCurrency(transaction.amount)}
      </div>

      {hasActions && (
        <>
          <TransactionActions
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          <TransactionMobileActions
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </>
      )}
    </motion.div>
  );
}
