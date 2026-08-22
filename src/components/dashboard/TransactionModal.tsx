"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  Tag,
  CreditCard,
  Calendar,
  FileText,
  CheckCircle2,
} from "lucide-react";

export type TransactionType = "income" | "expense";

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  onSave?: (data: {
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    paymentMethod: string;
    date: string;
  }) => void;
}

const CATEGORIES = {
  income: ["Vendas", "Serviços", "Investimentos", "Comissões", "Outros"],
  expense: [
    "Fornecedores",
    "Aluguel / Fixos",
    "Marketing / Anúncios",
    "Transporte / Logística",
    "Equipe / Salários",
    "Software / Ferramentas",
    "Impostos",
    "Outros",
  ],
};

const PAYMENT_METHODS = [
  "Pix",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Boleto",
  "Dinheiro",
  "Transferência (TED/DOC)",
];

export function TransactionModal({
  isOpen,
  onClose,
  defaultType = "income",
  onSave,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amountRaw, setAmountRaw] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setAmountRaw("");
      return;
    }
    const numericValue = Number(value) / 100;
    setAmountRaw(
      numericValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  };

  const getNumericAmount = () => {
    if (!amountRaw) return 0;
    return Number(amountRaw.replace(/\./g, "").replace(",", "."));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = getNumericAmount();

    if (numericAmount <= 0 || !description.trim() || !category) {
      return;
    }

    onSave?.({
      type,
      amount: numericAmount,
      description,
      category,
      paymentMethod,
      date,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      resetForm();
      onClose();
    }, 1200);
  };

  const resetForm = () => {
    setAmountRaw("");
    setDescription("");
    setCategory("");
    setPaymentMethod("Pix");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-surface-border bg-surface-sidebar p-6 shadow-2xl shadow-black/60 z-10"
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Lançamento Salvo!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  A transação foi adicionada com sucesso.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Novo Lançamento
                  </h2>
                  <button
                    onClick={onClose}
                    type="button"
                    className="rounded-lg p-1 text-slate-400 hover:bg-surface-panel hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-surface-panel p-1 border border-surface-border">
                  <button
                    type="button"
                    onClick={() => {
                      setType("income");
                      setCategory("");
                    }}
                    className={`relative flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      type === "income"
                        ? "text-emerald-400"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {type === "income" && (
                      <motion.div
                        layoutId="activeTypeBg"
                        className="absolute inset-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <ArrowUpCircle size={16} className="relative z-10" />
                    <span className="relative z-10">Nova Receita</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType("expense");
                      setCategory("");
                    }}
                    className={`relative flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      type === "expense"
                        ? "text-rose-400"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {type === "expense" && (
                      <motion.div
                        layoutId="activeTypeBg"
                        className="absolute inset-0 rounded-lg bg-rose-500/10 border border-rose-500/20"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <ArrowDownCircle size={16} className="relative z-10" />
                    <span className="relative z-10">Nova Despesa</span>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Valor
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-slate-500">
                        <DollarSign size={18} />
                      </div>
                      <input
                        type="text"
                        placeholder="0,00"
                        value={amountRaw}
                        onChange={handleAmountChange}
                        required
                        className={`w-full rounded-xl border bg-surface-panel pl-10 pr-4 py-2.5 text-lg font-bold text-white placeholder-slate-600 focus:outline-none transition-colors ${
                          type === "income"
                            ? "focus:border-emerald-500/50 border-surface-border"
                            : "focus:border-rose-500/50 border-surface-border"
                        }`}
                      />
                      <span className="absolute right-3 text-xs font-bold text-slate-500">
                        BRL
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Descrição
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-slate-500">
                        <FileText size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Ex: Venda de produto, Aluguel do mês..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full rounded-xl border border-surface-border bg-surface-panel pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:border-brand-500/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Categoria
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                          <Tag size={16} />
                        </div>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                          className="w-full appearance-none rounded-xl border border-surface-border bg-surface-panel pl-10 pr-4 py-2 text-xs text-white focus:border-brand-500/50 focus:outline-none transition-colors cursor-pointer"
                        >
                          <option
                            value=""
                            disabled
                            className="bg-slate-900 text-slate-500"
                          >
                            Selecione...
                          </option>
                          {CATEGORIES[type].map((cat) => (
                            <option
                              key={cat}
                              value={cat}
                              className="bg-slate-900 text-white"
                            >
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Pagamento
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                          <CreditCard size={16} />
                        </div>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-surface-border bg-surface-panel pl-10 pr-4 py-2 text-xs text-white focus:border-brand-500/50 focus:outline-none transition-colors cursor-pointer"
                        >
                          {PAYMENT_METHODS.map((method) => (
                            <option
                              key={method}
                              value={method}
                              className="bg-slate-900 text-white"
                            >
                              {method}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Data da Transação
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                        <Calendar size={16} />
                      </div>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full rounded-xl border border-surface-border bg-surface-panel pl-10 pr-4 py-2 text-xs text-white focus:border-brand-500/50 focus:outline-none transition-colors color-scheme-dark"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-surface-panel hover:text-white transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                        type === "income"
                          ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30"
                          : "bg-rose-600 hover:bg-rose-500 shadow-rose-900/30"
                      }`}
                    >
                      {type === "income" ? "Salvar Receita" : "Salvar Despesa"}
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
