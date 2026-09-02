"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import type { Movimentacao } from "@/types/index";

import {
  formatCurrency,
  getPaymentIcon,
  getPaymentLabel,
} from "@/utils/transaction.utils";

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

  const paymentLabel = getPaymentLabel(transaction.paymentMethod);

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
      className="group relative grid min-w-0 gap-4 px-5 py-4 pr-24 transition-colors hover:bg-white/[0.015] md:grid-cols-[minmax(0,2fr)_180px_180px_120px_140px] md:items-center md:gap-5 md:pr-24"
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

      <div className="flex min-w-0 justify-center">
        <span className="inline-flex max-w-full truncate rounded-full border border-surface-border bg-surface-sidebar px-2 py-1 text-center text-[8px] font-semibold text-slate-500">
          {transaction.category}
        </span>
      </div>

      <div className="flex min-w-0 items-center justify-center gap-1.5 text-center text-[10px] text-slate-500">
        <PaymentIcon size={13} className="shrink-0" />

        <span className="truncate">{paymentLabel}</span>
      </div>

      <div className="min-w-0 truncate text-center text-[10px] text-slate-600">
        {transaction.date}
      </div>

      <div
        className={`min-w-0 truncate text-right text-[10px] font-bold ${
          income ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {income ? "+" : "-"} {formatCurrency(transaction.amount)}
      </div>

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
    </motion.div>
  );
}
