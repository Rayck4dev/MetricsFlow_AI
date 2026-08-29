"use client";

import { useState } from "react";
import {
  BarChart3,
  CircleUserRound,
  ExternalLink,
  LogOut,
  MessageSquare,
  PieChart,
  Receipt,
  Settings,
  Sparkles,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/contexts/UserContext";

export type SidebarSection =
  | "dashboard"
  | "whatsapp"
  | "dre"
  | "transactions"
  | "profile"
  | "company"
  | "preferences";

export interface SidebarProps {
  userName?: string;
  companyName?: string;

  demo?: boolean;

  activeDemoSection?: SidebarSection;

  onDemoSectionChange?: (section: SidebarSection) => void;

  onLogout?: () => void;
}

interface NavigationItem {
  id: SidebarSection;
  label: string;
  href: string;
  icon: typeof BarChart3;
  comingSoon?: boolean;
}

const navigation: NavigationItem[] = [
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
    comingSoon: true,
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

const accountNavigation: NavigationItem[] = [
  {
    id: "profile",
    label: "Perfil",
    href: "/perfil",
    icon: CircleUserRound,
  },
  {
    id: "company",
    label: "Empresa",
    href: "/empresa",
    icon: Store,
  },
  {
    id: "preferences",
    label: "Preferências",
    href: "/preferencias",
    icon: Settings,
  },
];

export function Sidebar({
  userName,
  companyName,
  demo = false,
  activeDemoSection = "dashboard",
  onDemoSectionChange,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading: userLoading } = useUser();

  const role = user?.role ?? null;

  const isOwner = role === "owner";
  const isCollaborator = role === "collaborator";

  const supabase = createClient();

  const [hoveredTab, setHoveredTab] = useState<SidebarSection | null>(null);

  const [showUserMenu, setShowUserMenu] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayUserName = demo
    ? userName || "Carlos"
    : user?.name || userName || "Usuário";

  const displayCompanyName = demo
    ? companyName || "Carlos Design"
    : user?.companyName || companyName || "Empresa";

  function canSeeMainItem(item: NavigationItem) {
    if (demo) {
      return true;
    }

    if (userLoading) {
      return false;
    }

    if (
      item.id === "dashboard" ||
      item.id === "transactions" ||
      item.id === "whatsapp"
    ) {
      return true;
    }

    if (item.id === "dre") {
      return isOwner;
    }

    return false;
  }

  function canSeeAccountItem(item: NavigationItem) {
    if (demo) {
      return true;
    }

    if (userLoading) {
      return false;
    }

    if (item.id === "profile" || item.id === "preferences") {
      return true;
    }

    if (item.id === "company") {
      return isOwner;
    }

    return false;
  }

  function handleDemoNavigation(section: SidebarSection) {
    if (!demo) return;

    onDemoSectionChange?.(section);
  }

  async function handleLogout() {
    if (demo || isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      setShowUserMenu(false);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro ao sair:", error);

        return;
      }

      onLogout?.();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Erro inesperado ao fazer logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  function isDemoActive(id: SidebarSection) {
    return demo && activeDemoSection === id;
  }

  function isRealActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function renderNavigationItem(item: NavigationItem) {
    const Icon = item.icon;

    const active = demo ? isDemoActive(item.id) : isRealActive(item.href);

    const isHovered = hoveredTab === item.id;

    const content = (
      <>
        {active && (
          <motion.div
            layoutId="sidebar-active-tab"
            className="
              absolute
              inset-0
              rounded-xl
              border
              border-brand-500/20
              bg-brand-500/10
              shadow-[0_8px_20px_rgba(14,165,233,0.05)]
            "
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
          />
        )}

        {isHovered && !active && !item.comingSoon && (
          <motion.div
            layoutId="sidebar-hover-tab"
            className="
                absolute
                inset-0
                rounded-xl
                bg-surface-panel/60
              "
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
            className={`
              shrink-0
              transition-colors
              duration-200
              ${
                item.comingSoon
                  ? "text-slate-700"
                  : active
                    ? "text-brand-400"
                    : "text-slate-500 group-hover:text-slate-300"
              }
            `}
          />

          <span
            className={`
              min-w-0
              flex-1
              truncate
              text-[11px]
              font-semibold
              transition-colors
              duration-200
              ${
                item.comingSoon
                  ? "text-slate-700"
                  : active
                    ? "text-brand-300"
                    : "text-slate-400 group-hover:text-slate-200"
              }
            `}
          >
            {item.label}
          </span>

          {item.comingSoon ? (
            <span
              className="
                shrink-0
                rounded-full
                border
                border-slate-700/60
                bg-slate-800/70
                px-1.5
                py-0.5
                text-[7px]
                font-bold
                uppercase
                tracking-wider
                text-slate-600
              "
            >
              Em breve
            </span>
          ) : (
            active && (
              <motion.span
                layoutId="sidebar-active-dot"
                className="
                  ml-auto
                  h-1.5
                  w-1.5
                  shrink-0
                  rounded-full
                  bg-brand-400
                  shadow-[0_0_8px_rgba(56,189,248,0.8)]
                "
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                }}
              />
            )
          )}
        </div>
      </>
    );

    if (demo) {
      if (item.comingSoon) {
        return (
          <motion.div
            key={item.id}
            className="
              group
              relative
              flex
              w-full
              cursor-not-allowed
              items-center
              rounded-xl
              px-2.5
              py-2.5
              opacity-70
            "
          >
            {content}
          </motion.div>
        );
      }

      return (
        <motion.button
          key={item.id}
          type="button"
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setHoveredTab(item.id)}
          onClick={() => handleDemoNavigation(item.id)}
          className="
            group
            relative
            flex
            w-full
            cursor-pointer
            items-center
            rounded-xl
            px-2.5
            py-2.5
            text-left
          "
        >
          {content}
        </motion.button>
      );
    }

    if (item.comingSoon) {
      return (
        <motion.div
          key={item.id}
          className="
            group
            relative
            flex
            w-full
            cursor-not-allowed
            items-center
            rounded-xl
            px-2.5
            py-2.5
            opacity-70
          "
        >
          {content}
        </motion.div>
      );
    }

    return (
      <motion.div key={item.id} whileTap={{ scale: 0.97 }}>
        <Link
          href={item.href}
          onMouseEnter={() => setHoveredTab(item.id)}
          className="
            group
            relative
            flex
            w-full
            items-center
            rounded-xl
            px-2.5
            py-2.5
          "
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  function renderAccountItem(item: NavigationItem) {
    const Icon = item.icon;

    const active = demo ? isDemoActive(item.id) : isRealActive(item.href);

    const isHovered = hoveredTab === item.id;

    const content = (
      <>
        {active && (
          <motion.div
            layoutId="sidebar-account-active"
            className="
              absolute
              inset-0
              rounded-xl
              border
              border-brand-500/20
              bg-brand-500/10
            "
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
          />
        )}

        {isHovered && !active && (
          <motion.div
            layoutId="sidebar-account-hover"
            className="
              absolute
              inset-0
              rounded-xl
              bg-surface-panel/60
            "
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
            className={`
              shrink-0
              transition-colors
              ${
                active
                  ? "text-brand-400"
                  : "text-slate-500 group-hover:text-slate-300"
              }
            `}
          />

          <span
            className={`
              text-[11px]
              font-semibold
              transition-colors
              ${
                active
                  ? "text-brand-300"
                  : "text-slate-400 group-hover:text-slate-200"
              }
            `}
          >
            {item.label}
          </span>

          {active && (
            <motion.span
              layoutId="sidebar-account-dot"
              className="
                ml-auto
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-brand-400
                shadow-[0_0_8px_rgba(56,189,248,0.8)]
              "
            />
          )}
        </div>
      </>
    );

    if (demo) {
      return (
        <motion.button
          key={item.id}
          type="button"
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setHoveredTab(item.id)}
          onClick={() => handleDemoNavigation(item.id)}
          className="
            group
            relative
            flex
            w-full
            items-center
            rounded-xl
            px-3
            py-2.5
            text-left
          "
        >
          {content}
        </motion.button>
      );
    }

    return (
      <motion.div key={item.id} whileTap={{ scale: 0.97 }}>
        <Link
          href={item.href}
          onMouseEnter={() => setHoveredTab(item.id)}
          className="
            group
            relative
            flex
            w-full
            items-center
            rounded-xl
            px-3
            py-2.5
          "
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  const visibleNavigation = navigation.filter(canSeeMainItem);

  const visibleAccountNavigation = accountNavigation.filter(canSeeAccountItem);

  return (
    <aside
      className="
        relative
        z-40
        hidden
        w-[240px]
        shrink-0
        select-none
        border-r
        border-surface-border
        bg-surface-sidebar/95
        backdrop-blur-xl
        lg:block
      "
    >
      <div className="sticky top-0 flex min-h-screen flex-col">
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
              className="
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  rounded-xl
                  bg-brand-500/10
                  opacity-0
                  blur-xl
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />

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

                <span
                  className="
                    rounded-md
                    border
                    border-brand-500/20
                    bg-brand-500/10
                    px-1.5
                    py-0.5
                    text-[9px]
                    font-bold
                    text-brand-400
                  "
                >
                  AI
                </span>
              </div>

              <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                <Store size={9} className="shrink-0 text-slate-600" />

                <p className="truncate text-[10px] font-medium text-slate-500">
                  {demo
                    ? displayCompanyName
                    : userLoading
                      ? "Carregando..."
                      : displayCompanyName}
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <nav
            className="
              relative
              flex-1
              space-y-1
              overflow-y-auto
              p-3
            "
            onMouseLeave={() => setHoveredTab(null)}
          >
            <div className="flex items-center justify-between px-3 pb-2.5 pt-2">
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-slate-600
                "
              >
                {demo ? "Demonstração" : "Navegação"}
              </p>

              {demo && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                >
                  <Sparkles size={10} className="text-brand-400/60" />
                </motion.div>
              )}
            </div>

            <div className="space-y-1">
              {userLoading && !demo ? (
                <div className="space-y-2 px-2 py-1">
                  <div className="h-9 animate-pulse rounded-xl bg-surface-panel/50" />
                  <div className="h-9 animate-pulse rounded-xl bg-surface-panel/40" />
                  <div className="h-9 animate-pulse rounded-xl bg-surface-panel/40" />
                </div>
              ) : (
                visibleNavigation.map(renderNavigationItem)
              )}
            </div>

            <div className="mt-5 border-t border-surface-border pt-4">
              <div className="flex items-center justify-between px-3 pb-2">
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-600
                  "
                >
                  Conta
                </p>

                <Settings size={11} className="text-slate-700" />
              </div>

              <div className="space-y-1">
                {userLoading && !demo ? (
                  <div className="space-y-2 px-2 py-1">
                    <div className="h-9 animate-pulse rounded-xl bg-surface-panel/40" />
                    <div className="h-9 animate-pulse rounded-xl bg-surface-panel/40" />
                  </div>
                ) : (
                  visibleAccountNavigation.map(renderAccountItem)
                )}
              </div>
            </div>
          </nav>

          <div className="border-t border-surface-border p-3">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="
                relative
                overflow-hidden
                rounded-xl
                border
                border-brand-500/15
                bg-gradient-to-b
                from-brand-500/[0.05]
                to-transparent
                p-3
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-4
                  -top-4
                  h-12
                  w-12
                  rounded-full
                  bg-brand-500/10
                  blur-xl
                "
              />

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

          <div className="relative border-t border-surface-border p-3">
            <motion.button
              type="button"
              whileTap={{
                scale: demo ? 1 : 0.98,
              }}
              onClick={() => !demo && setShowUserMenu((value) => !value)}
              className={`
                group
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                p-2
                text-left
                transition-all
                ${demo ? "cursor-default" : "hover:bg-surface-panel"}
              `}
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-brand-500/20
                  bg-brand-500/10
                "
              >
                <CircleUserRound size={17} className="text-brand-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-bold text-slate-200">
                  {demo
                    ? displayUserName
                    : userLoading
                      ? "Carregando..."
                      : displayUserName}
                </p>

                <p className="truncate text-[8px] text-slate-600">
                  {demo
                    ? "Visitante"
                    : userLoading
                      ? "Carregando..."
                      : isCollaborator
                        ? "Colaborador"
                        : isOwner
                          ? "Proprietário"
                          : "Conta MetricsFlow"}
                </p>
              </div>

              {!demo && (
                <motion.span
                  animate={{
                    x: showUserMenu ? 2 : 0,
                  }}
                  className="text-slate-600"
                >
                  ⋯
                </motion.span>
              )}
            </motion.button>

            {!demo && showUserMenu && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.16,
                  ease: "easeOut",
                }}
                className="
                  absolute
                  bottom-[76px]
                  left-3
                  right-3
                  z-[100]
                  overflow-hidden
                  rounded-xl
                  border
                  border-surface-border
                  bg-surface-panel
                  p-1.5
                  shadow-2xl
                  shadow-black/40
                "
              >
                <Link
                  href="/perfil"
                  onClick={() => setShowUserMenu(false)}
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-lg
                    px-3
                    py-2.5
                    text-[10px]
                    font-semibold
                    text-slate-400
                    transition-colors
                    hover:bg-surface-sidebar
                    hover:text-white
                  "
                >
                  <CircleUserRound size={13} />
                  Meu perfil
                </Link>

                {isOwner && (
                  <Link
                    href="/empresa"
                    onClick={() => setShowUserMenu(false)}
                    className="
                      flex
                      items-center
                      gap-2.5
                      rounded-lg
                      px-3
                      py-2.5
                      text-[10px]
                      font-semibold
                      text-slate-400
                      transition-colors
                      hover:bg-surface-sidebar
                      hover:text-white
                    "
                  >
                    <Store size={13} />
                    Empresa
                  </Link>
                )}

                <Link
                  href="/preferencias"
                  onClick={() => setShowUserMenu(false)}
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-lg
                    px-3
                    py-2.5
                    text-[10px]
                    font-semibold
                    text-slate-400
                    transition-colors
                    hover:bg-surface-sidebar
                    hover:text-white
                  "
                >
                  <Settings size={13} />
                  Preferências
                </Link>

                <div className="my-1 h-px bg-surface-border" />

                <Link
                  href="/"
                  onClick={() => setShowUserMenu(false)}
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-lg
                    px-3
                    py-2.5
                    text-[10px]
                    font-semibold
                    text-slate-400
                    transition-colors
                    hover:bg-surface-sidebar
                    hover:text-white
                  "
                >
                  <ExternalLink size={13} />
                  Voltar ao site
                </Link>

                <div className="my-1 h-px bg-surface-border" />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="
                    flex
                    w-full
                    items-center
                    gap-2.5
                    rounded-lg
                    px-3
                    py-2.5
                    text-[10px]
                    font-semibold
                    text-red-400
                    transition-colors
                    hover:bg-red-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <LogOut
                    size={13}
                    className={isLoggingOut ? "animate-pulse" : ""}
                  />

                  {isLoggingOut ? "Saindo..." : "Sair da conta"}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
