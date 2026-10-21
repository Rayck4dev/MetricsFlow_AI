import type { Movimentacao } from "@/components/movimentacoes/types";
import type { ToastType } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

import type { Category } from "./types";

type SupabaseClient = ReturnType<typeof createClient>;

interface MovimentacoesPageActionsOptions {
  supabase: SupabaseClient;
  companyId: string | null;
  categories: Category[];
  getDatabaseDate: (date: string) => string;
  loadTransactions: (companyId: string) => Promise<void>;
  showToast: (type: ToastType, title: string, message?: string) => void;
}

export function useMovimentacoesPageActions({
  supabase,
  companyId,
  categories,
  getDatabaseDate,
  loadTransactions,
  showToast,
}: MovimentacoesPageActionsOptions) {
  async function handleAddTransaction(transaction: Omit<Movimentacao, "id">) {
    if (!companyId) throw new Error("Empresa não encontrada.");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Usuário não autenticado.");

    const category = categories.find(
      (item) =>
        item.name === transaction.category && item.type === transaction.type,
    );

    if (!category) {
      throw new Error(
        `A categoria "${transaction.category}" não foi encontrada.`,
      );
    }

    const transactionDate = getDatabaseDate(transaction.date);

    const { error } = await supabase.from("transactions").insert({
      company_id: companyId,
      category_id: category.id,
      created_by_user_id: user.id,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      payment_method: transaction.paymentMethod,
      transaction_date: transactionDate,
      origin: "web",
    });

    if (error) {
      console.error("❌ Erro ao inserir transação:", error);
      throw error;
    }

    await loadTransactions(companyId);

    const typeLabel = transaction.type === "income" ? "Receita" : "Despesa";
    const amountLabel = transaction.amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    showToast(
      "success",
      `${typeLabel} registrada com sucesso!`,
      `${transaction.description} — ${amountLabel}`,
    );
  }

  async function handleUpdateTransaction(
    id: string,
    transaction: Omit<Movimentacao, "id">,
  ) {
    if (!companyId) throw new Error("Empresa não encontrada.");

    const category = categories.find(
      (item) =>
        item.name === transaction.category && item.type === transaction.type,
    );

    if (!category) {
      throw new Error(
        `A categoria "${transaction.category}" não foi encontrada.`,
      );
    }

    const transactionDate = getDatabaseDate(transaction.date);

    const { error } = await supabase
      .from("transactions")
      .update({
        category_id: category.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        payment_method: transaction.paymentMethod,
        transaction_date: transactionDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) {
      console.error("❌ Erro ao atualizar transação:", error);
      throw error;
    }

    await loadTransactions(companyId);
  }

  async function handleDeleteTransaction(id: string) {
    if (!companyId) throw new Error("Empresa não encontrada.");

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) {
      console.error("❌ Erro ao excluir transação:", error);
      throw error;
    }

    await loadTransactions(companyId);
  }

  return {
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
  };
}
