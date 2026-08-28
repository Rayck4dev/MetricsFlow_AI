"use client";

import { useCallback, useEffect, useState } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Movimentacoes } from "@/components/movimentacoes/Movimentacoes";
import type { Movimentacao } from "@/components/movimentacoes/types";

import { createClient } from "@/lib/supabase/client";
import { useCompanyRole } from "@/hooks/useCompanyRole";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

export default function MovimentacoesPage() {
  const [transactions, setTransactions] = useState<Movimentacao[]>([]);

  const [userName, setUserName] = useState("Usuário");
  const [companyName, setCompanyName] = useState("Empresa");

  const [companyId, setCompanyId] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const { role, loading: roleLoading } = useCompanyRole();
  const isOwner = role === "owner";

  const supabase = createClient();

  /*
   * =========================================================
   * CONVERTER DATA DO BANCO
   * =========================================================
   */

  function formatTransactionDate(date: string) {
    const transactionDate = new Date(`${date}T12:00:00`);

    if (Number.isNaN(transactionDate.getTime())) {
      return date;
    }

    const today = new Date();

    const todayString = today.toISOString().split("T")[0];

    if (date === todayString) {
      return "Hoje";
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayString = yesterday.toISOString().split("T")[0];

    if (date === yesterdayString) {
      return "Ontem";
    }

    return transactionDate.toLocaleDateString("pt-BR");
  }

  const loadCompany = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    /*
     * Perfil
     */
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (profile?.name) {
      setUserName(profile.name);
    }

    /*
     * Empresa vinculada
     */
    const { data: membership, error: membershipError } = await supabase
      .from("company_members")
      .select("company_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError) {
      throw membershipError;
    }

    if (!membership?.company_id) {
      throw new Error("Nenhuma empresa foi encontrada para este usuário.");
    }

    setCompanyId(membership.company_id);

    /*
     * Dados da empresa
     */
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("name")
      .eq("id", membership.company_id)
      .maybeSingle();

    if (companyError) {
      throw companyError;
    }

    if (company?.name) {
      setCompanyName(company.name);
    }

    return {
      userId: user.id,
      companyId: membership.company_id,
    };
  }, [supabase]);

  /*
   * =========================================================
   * CARREGAR CATEGORIAS
   * =========================================================
   */

  const loadCategories = useCallback(
    async (currentCompanyId: string) => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, type")
        .eq("company_id", currentCompanyId)
        .order("name");

      if (error) {
        throw error;
      }

      setCategories((data ?? []) as Category[]);
    },
    [supabase],
  );

  /*
   * =========================================================
   * CARREGAR TRANSAÇÕES
   * =========================================================
   */

  const loadTransactions = useCallback(
    async (currentCompanyId: string) => {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          id,
          type,
          amount,
          description,
          payment_method,
          transaction_date,
          category_id,
          categories (
            name
          )
        `,
        )
        .eq("company_id", currentCompanyId)
        .order("transaction_date", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      const formattedTransactions: Movimentacao[] = (data ?? []).map(
        (item: any) => {
          const category = Array.isArray(item.categories)
            ? item.categories[0]
            : item.categories;

          return {
            id: item.id,
            type: item.type,
            amount: Number(item.amount),
            category: category?.name ?? "Sem categoria",
            paymentMethod: item.payment_method,
            description: item.description,
            date: formatTransactionDate(item.transaction_date),
          };
        },
      );

      setTransactions(formattedTransactions);
    },
    [supabase],
  );

  /*
   * =========================================================
   * CARREGAMENTO INICIAL
   * =========================================================
   */

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const { companyId: currentCompanyId } = await loadCompany();

        if (!mounted) return;

        await Promise.all([
          loadCategories(currentCompanyId),
          loadTransactions(currentCompanyId),
        ]);
      } catch (error) {
        console.error("❌ Erro ao carregar movimentações:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [loadCompany, loadCategories, loadTransactions]);

  /*
   * =========================================================
   * ADICIONAR TRANSAÇÃO
   * =========================================================
   */

  async function handleAddTransaction(transaction: Omit<Movimentacao, "id">) {
    if (!companyId) {
      throw new Error("Empresa não encontrada.");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    /*
     * Descobre a categoria pelo nome.
     */
    const category = categories.find(
      (item) =>
        item.name === transaction.category && item.type === transaction.type,
    );

    if (!category) {
      throw new Error(
        `A categoria "${transaction.category}" não foi encontrada.`,
      );
    }

    /*
     * A tabela usa DATE.
     *
     * Como o componente atual pode mandar "Hoje",
     * "Ontem" ou uma data, normalizamos para YYYY-MM-DD.
     */
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

    /*
     * Recarrega do banco.
     */
    await loadTransactions(companyId);
  }

  /*
   * =========================================================
   * EDITAR TRANSAÇÃO
   * =========================================================
   */

  async function handleUpdateTransaction(
    id: string,
    transaction: Omit<Movimentacao, "id">,
  ) {
    if (!companyId) {
      throw new Error("Empresa não encontrada.");
    }

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

  /*
   * =========================================================
   * EXCLUIR TRANSAÇÃO
   * =========================================================
   */

  async function handleDeleteTransaction(id: string) {
    if (!companyId) {
      throw new Error("Empresa não encontrada.");
    }

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

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="min-w-0 flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1400px] px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <div className="space-y-6">
                <div className="h-24 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />

                <div className="h-32 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />

                <div className="h-96 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * PÁGINA
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={userName} companyName={companyName} />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] min-w-0 px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Movimentacoes
              transactions={transactions}
              userName={userName}
              companyName={companyName}
              onAddIncome={handleAddTransaction}
              onAddExpense={handleAddTransaction}
              onUpdateTransaction={
                isOwner ? handleUpdateTransaction : undefined
              }
              onDeleteTransaction={
                isOwner ? handleDeleteTransaction : undefined
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * NORMALIZAÇÃO DE DATA
 * =========================================================
 */

function getDatabaseDate(date: string): string {
  const today = new Date();

  /*
   * Se já estiver no formato YYYY-MM-DD.
   */
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  /*
   * Hoje
   */
  if (date.toLowerCase().startsWith("hoje")) {
    return today.toISOString().split("T")[0];
  }

  /*
   * Ontem
   */
  if (date.toLowerCase().startsWith("ontem")) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return yesterday.toISOString().split("T")[0];
  }

  /*
   * Tenta interpretar outras datas.
   */
  const parsed = new Date(date);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  /*
   * Fallback.
   */
  return today.toISOString().split("T")[0];
}
