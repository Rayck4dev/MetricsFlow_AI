import { useCallback, useEffect, useState } from "react";

import type { Movimentacao } from "@/components/movimentacoes/types";
import { createClient } from "@/lib/supabase/client";

import { formatTransactionRecords } from "./transactionFormatting";
import type { Category, TransactionQueryRecord } from "./types";

type SupabaseClient = ReturnType<typeof createClient>;

export function useMovimentacoesPageData(supabase: SupabaseClient) {
  const [transactions, setTransactions] = useState<Movimentacao[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [transactionDatabaseDates, setTransactionDatabaseDates] = useState<
    Record<string, string>
  >({});
  const [userName, setUserName] = useState("Usuário");
  const [companyName, setCompanyName] = useState("Empresa");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCompany = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("Usuário não autenticado.");

    setCurrentUserId(user.id);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (profile?.name) setUserName(profile.name);

    const { data: membership, error: membershipError } = await supabase
      .from("company_members")
      .select("company_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError) throw membershipError;
    if (!membership?.company_id) {
      throw new Error("Nenhuma empresa foi encontrada para este usuário.");
    }

    setCompanyId(membership.company_id);

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("name")
      .eq("id", membership.company_id)
      .maybeSingle();

    if (companyError) throw companyError;
    if (company?.name) setCompanyName(company.name);

    return { userId: user.id, companyId: membership.company_id };
  }, [supabase]);

  const loadCategories = useCallback(
    async (currentCompanyId: string) => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, type")
        .eq("company_id", currentCompanyId)
        .order("name");

      if (error) throw error;
      setCategories((data ?? []) as Category[]);
    },
    [supabase],
  );

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
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = formatTransactionRecords(
        (data ?? []) as TransactionQueryRecord[],
      );
      setTransactionDatabaseDates(formatted.databaseDates);
      setTransactions(formatted.transactions);
    },
    [supabase],
  );

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
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [loadCompany, loadCategories, loadTransactions]);

  return {
    transactions,
    currentUserId,
    transactionDatabaseDates,
    userName,
    companyName,
    companyId,
    categories,
    loading,
    loadCompany,
    loadCategories,
    loadTransactions,
  };
}
