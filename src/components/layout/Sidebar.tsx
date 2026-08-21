"use client";

import { useState } from "react";
import {
  BarChart3,
  CircleUserRound,
  FileText,
  LogOut,
  MessageSquare,
  PieChart,
  Receipt,
  Settings,
  Sparkles,
  Store,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export type SidebarSection = "dashboard" | "whatsapp" | "dre" | "transactions";

export interface SidebarProps {
  userName?: string;
  companyName?: string;

  /**
   * Ativa o comportamento da demonstração.
   * Na demo, os itens não redirecionam para outras páginas.
   */
  demo?: boolean;

  /**
   * Se estiver na demo, controla qual seção está ativa.
   */
  activeDemoSection?: SidebarSection;

  /**
   * Chamado quando uma seção da demo é selecionada.
   */
  onDemoSectionChange?: (section: SidebarSection) => void;

  /**
   * Futuramente conectar com Supabase/Auth/etc.
   */
  onLogout?: () => void;
}

const navigation: {
  id: SidebarSection;
  label: string;
  href: string;
  icon: typeof BarChart3;
}[] = [
  {
    id: "dashboard",
    label: "Visão geral",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "/whatsapp",
    icon: MessageSquare,
  },
  {
    id: "dre",
    label: "DRE",
    href: "/dre",
    icon: PieChart,
  },
  {
    id: "transactions",
    label: "Movimentações",
    href: "/movimentacoes",
    icon: Receipt,
  },
];

export function Sidebar({
  userName = "Usuário",
  companyName = "Minha empresa",
  demo = false,
  activeDemoSection = "dashboard",
  onDemoSectionChange,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const [hoveredTab, setHoveredTab] = useState<SidebarSection | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  function handleDemoNavigation(section: SidebarSection) {
    if (!demo) return;

    onDemoSectionChange?.(section);
  }

  function handleLogout() {
    if (demo) return;

    onLogout?.();
  }

  return (
    <aside className="sticky top-0 z-40 flex h-screen w-[240px] shrink-0 flex-col border-r border-surface-border bg-surface-sidebar/95 backdrop-blur-xl select-none">
      {/* =====================================================
          LOGO / EMPRESA
      ===================================================== */}

      <div className="border-b border-surface-border p-4">
        <Link
          href={demo ? "/" : "/dashboard"}
          className="group flex items-center gap-3"
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: 2,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          >
            <div className="absolute inset-0 rounded-xl bg-brand-500/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

            <Image
              src="/logo_metrics_bg.png"
              alt="MetricsFlow AI"
              width={34}
              height={34}
              priority
              className="relative z-10 object-contain"
            />
          </motion.div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-heading text-sm font-bold tracking-tight text-white">
                MetricsFlow
              </p>

              <span className="rounded-md border border-brand-500/20 bg-brand-500/10 px-1.5 py-0.5 text-[9px] font-bold text-brand-400">
                AI
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5">
              <Store size={9} className="shrink-0 text-slate-600" />

              <p className="truncate text-[10px] font-medium text-slate-500">
                {companyName}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* =====================================================
          NAVEGAÇÃO
      ===================================================== */}

      <nav
        className="relative flex-1 space-y-1 overflow-y-auto p-3"
        onMouseLeave={() => setHoveredTab(null)}
      >
        <div className="flex items-center justify-between px-3 pb-2.5 pt-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
            {demo ? "Demonstração" : "Navegação"}
          </p>

          {demo && <Sparkles size={10} className="text-brand-400/60" />}
        </div>

        {navigation.map((item) => {
          const Icon = item.icon;

          const active = demo
            ? activeDemoSection === item.id
            : pathname === item.href;

          const isHovered = hoveredTab === item.id;

          const content = (
            <>
              {/* Active background */}
              {active && (
                <motion.div
                  layoutId={demo ? "demoActiveTab" : "activeTab"}
                  className="absolute inset-0 rounded-xl border border-brand-500/20 bg-brand-500/10 shadow-sm"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              {/* Hover background */}
              {isHovered && !active && (
                <motion.div
                  layoutId={demo ? "demoHoverTab" : "hoverTab"}
                  className="absolute inset-0 rounded-xl bg-surface-panel/60"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                  }}
                />
              )}

              <div className="relative z-10 flex w-full items-center gap-3">
                <Icon
                  size={16}
                  className={`transition-colors duration-200 ${
                    active
                      ? "text-brand-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />

                <span
                  className={`text-[11px] font-semibold transition-colors duration-200 ${
                    active
                      ? "text-brand-300"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </span>

                {active && (
                  <motion.span
                    layoutId={demo ? "demoActiveDot" : "activeDot"}
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                  />
                )}
              </div>
            </>
          );

          {
            /* =================================================
              DEMO
          ================================================= */
          }

          if (demo) {
            return (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onMouseEnter={() => setHoveredTab(item.id)}
                onClick={() => handleDemoNavigation(item.id)}
                className="group relative flex w-full cursor-pointer items-center px-3 py-2.5 text-left"
              >
                {content}
              </motion.button>
            );
          }

          {
            /* =================================================
              DASHBOARD REAL
          ================================================= */
          }

          return (
            <motion.div key={item.id} whileTap={{ scale: 0.97 }}>
              <Link
                href={item.href}
                onMouseEnter={() => setHoveredTab(item.id)}
                className="group relative flex w-full items-center px-3 py-2.5"
              >
                {content}
              </Link>
            </motion.div>
          );
        })}

        {/* ===================================================
            CONFIGURAÇÕES
        =================================================== */}

        {!demo && (
          <div className="mt-5 border-t border-surface-border pt-4">
            <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Conta
            </p>

            <Link
              href="/configuracoes"
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-panel"
            >
              <Settings
                size={16}
                className="text-slate-500 transition-colors group-hover:text-slate-300"
              />

              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-200">
                Configurações
              </span>
            </Link>
          </div>
        )}
      </nav>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <div className="border-t border-surface-border p-3">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden rounded-xl border border-brand-500/15 bg-gradient-to-b from-brand-500/[0.05] to-transparent p-3"
        >
          <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-brand-500/10 blur-xl" />

          <div className="mb-1.5 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
              {demo ? "Modo demonstração" : "Sistema ativo"}
            </span>
          </div>

          <p className="text-[9.5px] font-medium leading-4 text-slate-400">
            {demo
              ? "Dados fictícios para explorar a plataforma."
              : "Sua conta está sincronizada em tempo real."}
          </p>
        </motion.div>
      </div>

      {/* =====================================================
          USUÁRIO
      ===================================================== */}

      <div className="relative border-t border-surface-border p-3">
        <button
          type="button"
          onClick={() => !demo && setShowUserMenu((value) => !value)}
          className={`group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${
            demo ? "cursor-default" : "hover:bg-surface-panel"
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-500/20 bg-brand-500/10">
            <CircleUserRound size={17} className="text-brand-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold text-slate-200">
              {userName}
            </p>

            <p className="truncate text-[8px] text-slate-600">
              {demo ? "Visitante" : "Conta MetricsFlow"}
            </p>
          </div>

          {!demo && (
            <span className="text-slate-600 transition-transform group-hover:translate-x-0.5">
              ⋯
            </span>
          )}
        </button>

        {/* =================================================
            MENU DO USUÁRIO
        ================================================= */}

        {!demo && showUserMenu && (
          <motion.div
            initial={{
              opacity: 0,
              y: 6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            className="absolute bottom-[72px] left-3 right-3 z-50 overflow-hidden rounded-xl border border-surface-border bg-surface-panel p-1.5 shadow-2xl"
          >
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[10px] font-semibold text-slate-400 transition-colors hover:bg-surface-sidebar hover:text-white"
            >
              <ExternalLink size={13} />
              Voltar ao site
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[10px] font-semibold text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut size={13} />
              Sair da conta
            </button>
          </motion.div>
        )}
      </div>
    </aside>
  );
}
