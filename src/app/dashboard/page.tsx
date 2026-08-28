"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Dashboard } from "@/components/dashboard/Dashboard";
import type { DashboardTransaction } from "@/components/dashboard/DashboardTransactions";

import { Sidebar } from "@/components/layout/Sidebar";

import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);

  const [userName, setUserName] = useState("Usuário");
  const [companyName, setCompanyName] = useState("Empresa");

  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  /*
   * =========================================================
   * CARREGAR DASHBOARD
   * =========================================================
   */

  const loadDashboard = useCallback(async () => {
    /*
     * ---------------------------------------------------------
     * USUÁRIO AUTENTICADO
     * ---------------------------------------------------------
     */

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
     * ---------------------------------------------------------
     * PERFIL
     * ---------------------------------------------------------
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
     * ---------------------------------------------------------
     * EMPRESA DO USUÁRIO
     * ---------------------------------------------------------
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

    const companyId = membership.company_id;

    /*
     * ---------------------------------------------------------
     * EMPRESA
     * ---------------------------------------------------------
     */

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

    /*
     * ---------------------------------------------------------
     * TRANSAÇÕES
     * ---------------------------------------------------------
     */

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

    /*
     * ---------------------------------------------------------
     * CONVERTER TRANSAÇÕES
     * ---------------------------------------------------------
     */

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
  }, [supabase]);

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

  /*
   * =========================================================
   * NAVEGAÇÃO
   * =========================================================
   */

  function handleAddIncome() {
    router.push("/movimentacoes");
  }

  function handleAddExpense() {
    router.push("/movimentacoes");
  }

  function handleViewFinance() {
    router.push("/movimentacoes");
  }

  function handleViewDre() {
    router.push("/dre");
  }

  function handleViewAllTransactions() {
    router.push("/movimentacoes");
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
              <div className="space-y-6">
                <div className="h-40 animate-pulse rounded-3xl border border-surface-border bg-surface-panel" />

                <div className="h-64 animate-pulse rounded-3xl border border-surface-border bg-surface-panel" />

                <div className="h-96 animate-pulse rounded-3xl border border-surface-border bg-surface-panel" />
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

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
            <Dashboard
              transactions={transactions}
              userName={userName}
              companyName={companyName}
              demo={false}
              onAddIncome={handleAddIncome}
              onAddExpense={handleAddExpense}
              onViewFinance={handleViewFinance}
              onViewDre={handleViewDre}
              onViewAllTransactions={handleViewAllTransactions}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * FORMATAR DATA
 * =========================================================
 */

function formatTransactionDate(date: string) {
  if (!date) {
    return "";
  }

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

  return transactionDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

/*
 * =========================================================
 * FORMA DE PAGAMENTO
 * =========================================================
 */

function formatPaymentMethod(paymentMethod: string) {
  const methods: Record<string, string> = {
    pix: "Pix",
    credit_card: "Cartão de crédito",
    debit_card: "Cartão de débito",
    bank_slip: "Boleto",
    cash: "Dinheiro",
    transfer: "Transferência",
    other: "Outro",
  };

  return methods[paymentMethod] ?? paymentMethod;
}
