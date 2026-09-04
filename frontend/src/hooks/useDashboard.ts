"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import type { DashboardTransaction } from "@/components/dashboard/DashboardTransactions";

import {
  formatPaymentMethod,
  formatTransactionDate,
} from "@/lib/formatters/dashboard";

interface UseDashboardReturn {
  transactions: DashboardTransaction[];
  userName: string;
  companyName: string;
  loading: boolean;
}

export function useDashboard(): UseDashboardReturn {
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);

  const [userName, setUserName] = useState("Usuário");
  const [companyName, setCompanyName] = useState("Empresa");

  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    const supabase = createClient();

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

    const companyId = membership.company_id;

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("name")
      .eq("id", companyId)
      .maybeSingle();

    if (companyError) {
      throw companyError;
    }

    if (company?.name) {
      setCompanyName(company.name);
    }

    const { data: transactionData, error: transactionsError } = await supabase
      .from("transactions")
      .select(
        `
            id,
            type,
            amount,
            description,
            payment_method,
            transaction_date,
            created_at,
            categories (
              name
            )
          `,
      )
      .eq("company_id", companyId)
      .order("transaction_date", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

    if (transactionsError) {
      throw transactionsError;
    }

    const formattedTransactions: DashboardTransaction[] = (
      transactionData ?? []
    ).map((item: any) => {
      const category = Array.isArray(item.categories)
        ? item.categories[0]
        : item.categories;

      return {
        id: item.id,
        type: item.type,
        amount: Number(item.amount),
        category: category?.name ?? "Sem categoria",
        paymentMethod: formatPaymentMethod(item.payment_method),
        description: item.description,
        date: formatTransactionDate(item.transaction_date),
      };
    });

    setTransactions(formattedTransactions);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        await loadDashboard();
      } catch (error) {
        console.error("❌ Erro ao carregar dashboard:", error);
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
  }, [loadDashboard]);

  return {
    transactions,
    userName,
    companyName,
    loading,
  };
}
