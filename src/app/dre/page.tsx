"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Dre from "@/components/dre/Dre";
import type { DreTransaction } from "@/hooks/useDre";

import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/client";
import { useCompanyRole } from "@/hooks/useCompanyRole";

export default function DrePage() {
  const [transactions, setTransactions] = useState<DreTransaction[]>([]);

  const [userName, setUserName] = useState("Usuário");
  const [companyName, setCompanyName] = useState("Empresa");

  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { role, loading: roleLoading } = useCompanyRole();

  const supabase = createClient();

  const loadData = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("Usuário não autenticado.");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    if (profile?.name) setUserName(profile.name);

    const { data: membership, error: membershipError } = await supabase
      .from("company_members")
      .select("company_id, role")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (membershipError) throw membershipError;

    if (membership?.role === "collaborator") {
      router.replace("/dashboard");
      return;
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

    if (companyError) throw companyError;

    if (company?.name) setCompanyName(company.name);

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
          categories (
            name
          )
        `,
      )
      .eq("company_id", companyId)
      .order("transaction_date", { ascending: true })
      .order("created_at", { ascending: true });

    if (transactionsError) throw transactionsError;

    const formattedTransactions: DreTransaction[] = (transactionData ?? []).map(
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
          date: item.transaction_date,
        };
      },
    );

    setTransactions(formattedTransactions);
  }, [router, supabase]);

  useEffect(() => {
    if (!roleLoading && role === "collaborator") {
      router.replace("/dashboard");
    }
  }, [role, roleLoading, router]);

  useEffect(() => {
    if (roleLoading || role === "collaborator") return;

    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        await loadData();
      } catch (error) {
        console.error("❌ Erro ao carregar dados do DRE:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [loadData, role, roleLoading]);

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="min-w-0 flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1400px] px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <div className="space-y-6">
                <div className="h-24 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
                <div className="h-64 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
                <div className="h-96 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (role === "collaborator") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-main text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar userName={userName} companyName={companyName} />
          <main className="min-w-0 flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1400px] px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <div className="space-y-6">
                <div className="h-24 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
                <div className="h-64 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
                <div className="h-96 animate-pulse rounded-2xl border border-surface-border bg-surface-panel" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={userName} companyName={companyName} />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] min-w-0 px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Dre
              transactions={transactions}
              userName={userName}
              companyName={companyName}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
