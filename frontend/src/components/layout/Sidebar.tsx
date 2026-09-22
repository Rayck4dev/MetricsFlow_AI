"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Settings, Sparkles, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useUser } from "@/contexts/UserContext";

import {
  navigation,
  accountNavigation,
  type SidebarSection,
} from "@/data/sidebar.data";

import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { SidebarNavigationItem } from "@/components/sidebar/SidebarNavigationItem";
import { SidebarStatus } from "@/components/sidebar/SidebarStatus";
import { SidebarUser } from "@/components/sidebar/SidebarUser";

export interface SidebarProps {
  userName?: string;
  companyName?: string;
  demo?: boolean;
  activeDemoSection?: SidebarSection;
  onDemoSectionChange?: (section: SidebarSection) => void;
  onLogout?: () => void;
}

export function Sidebar({
  userName,
  companyName,
  demo = false,
  activeDemoSection = "dashboard",
  onDemoSectionChange,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const { user, loading: userLoading } = useUser();

  const [hoveredTab, setHoveredTab] = useState<SidebarSection | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role ?? null;

  const isOwner = role === "owner";

  const displayUserName = demo
    ? userName || "Carlos"
    : user?.name || userName || "Usuário";

  const displayCompanyName = demo
    ? companyName || "Carlos Design"
    : user?.companyName || companyName || "Empresa";

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function canSeeMainItem(id: SidebarSection) {
    if (demo) return true;
    if (userLoading) return false;

    if (id === "dashboard" || id === "transactions" || id === "whatsapp") {
      return true;
    }

    if (id === "dre") {
      return isOwner;
    }

    return false;
  }

  function canSeeAccountItem(id: SidebarSection) {
    if (demo) return true;
    if (userLoading) return false;

    if (id === "profile" || id === "preferences") {
      return true;
    }

    if (id === "company") {
      return isOwner;
    }

    return false;
  }

  function handleDemoNavigation(section: SidebarSection) {
    if (!demo) return;

    onDemoSectionChange?.(section);
  }

  const closeMobileSidebar = useCallback(() => {
    setMobileOpen(false);
    setHoveredTab(null);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobileSidebar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileSidebar]);

  const visibleNavigation = navigation.filter((item) =>
    canSeeMainItem(item.id),
  );

  const visibleAccountNavigation = accountNavigation.filter((item) =>
    canSeeAccountItem(item.id),
  );

  return (
    <>
      <button
        type="button"
        aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((current) => !current)}
        className="
          fixed
          left-4
          top-4
          z-[10020]
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl
          border
          border-surface-border
          bg-surface-sidebar/95
          text-slate-100
          shadow-2xl
          shadow-black/30
          backdrop-blur-xl
          transition-colors
          hover:border-brand-500/25
          hover:text-brand-300
          lg:hidden
        "
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu lateral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closeMobileSidebar}
              className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="
                fixed
                inset-y-0
                left-0
                z-[10010]
                w-[min(82vw,288px)]
                select-none
                overflow-hidden
                border-r
                border-surface-border
                bg-surface-sidebar/98
                pt-16
                shadow-2xl
                shadow-black/50
                backdrop-blur-xl
                lg:hidden
              "
            >
              <div className="flex h-full min-h-0 flex-col">
                <SidebarContent
                  demo={demo}
                  displayCompanyName={displayCompanyName}
                  displayUserName={displayUserName}
                  userLoading={userLoading}
                  role={role}
                  visibleNavigation={visibleNavigation}
                  visibleAccountNavigation={visibleAccountNavigation}
                  activeDemoSection={activeDemoSection}
                  hoveredTab={hoveredTab}
                  layoutNamespace="mobile-sidebar"
                  isActive={isActive}
                  onHover={setHoveredTab}
                  onNavigate={closeMobileSidebar}
                  onDemoNavigation={handleDemoNavigation}
                  onLogout={onLogout}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

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
          <SidebarContent
            demo={demo}
            displayCompanyName={displayCompanyName}
            displayUserName={displayUserName}
            userLoading={userLoading}
            role={role}
            visibleNavigation={visibleNavigation}
            visibleAccountNavigation={visibleAccountNavigation}
            activeDemoSection={activeDemoSection}
            hoveredTab={hoveredTab}
            layoutNamespace="desktop-sidebar"
            isActive={isActive}
            onHover={setHoveredTab}
            onNavigate={closeMobileSidebar}
            onDemoNavigation={handleDemoNavigation}
            onLogout={onLogout}
          />
        </div>
      </aside>
    </>
  );
}

interface SidebarContentProps {
  demo: boolean;
  displayCompanyName: string;
  displayUserName: string;
  userLoading: boolean;
  role: "owner" | "collaborator" | null;
  visibleNavigation: typeof navigation;
  visibleAccountNavigation: typeof accountNavigation;
  activeDemoSection: SidebarSection;
  hoveredTab: SidebarSection | null;
  layoutNamespace: string;
  isActive: (href: string) => boolean;
  onHover: (id: SidebarSection | null) => void;
  onNavigate: () => void;
  onDemoNavigation: (section: SidebarSection) => void;
  onLogout?: () => void;
}

function SidebarContent({
  demo,
  displayCompanyName,
  displayUserName,
  userLoading,
  role,
  visibleNavigation,
  visibleAccountNavigation,
  activeDemoSection,
  hoveredTab,
  layoutNamespace,
  isActive,
  onHover,
  onNavigate,
  onDemoNavigation,
  onLogout,
}: SidebarContentProps) {
  const router = useRouter();

  return (
    <>
      <SidebarHeader
        demo={demo}
        companyName={displayCompanyName}
        userLoading={userLoading}
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <nav
          className="
            relative
            flex-1
            space-y-1
            overflow-y-auto
            p-3
          "
          onMouseLeave={() => onHover(null)}
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

            {demo && <Sparkles size={10} className="text-brand-400/60" />}
          </div>

          <div className="space-y-1">
            {userLoading && !demo ? (
              <NavigationSkeleton />
            ) : (
              visibleNavigation.map((item) => (
                <SidebarNavigationItem
                  key={item.id}
                  item={item}
                  demo={demo}
                  active={
                    demo ? activeDemoSection === item.id : isActive(item.href)
                  }
                  hovered={hoveredTab === item.id}
                  layoutNamespace={layoutNamespace}
                  onHover={onHover}
                  onNavigate={onNavigate}
                  onDemoNavigation={onDemoNavigation}
                />
              ))
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
                <NavigationSkeleton />
              ) : (
                visibleAccountNavigation.map((item) => (
                  <SidebarNavigationItem
                    key={item.id}
                    item={item}
                    demo={demo}
                    variant="account"
                    active={
                      demo ? activeDemoSection === item.id : isActive(item.href)
                    }
                    hovered={hoveredTab === item.id}
                    layoutNamespace={layoutNamespace}
                    onHover={onHover}
                    onNavigate={onNavigate}
                    onDemoNavigation={onDemoNavigation}
                  />
                ))
              )}
            </div>
          </div>
        </nav>

        <SidebarStatus demo={demo} />

        <SidebarUser
          demo={demo}
          userName={userLoading && !demo ? "Carregando..." : displayUserName}
          userRole={role}
          onLogout={() => {
            onLogout?.();
            router.replace("/login");
            router.refresh();
          }}
        />
      </div>
    </>
  );
}

function NavigationSkeleton() {
  return (
    <div className="space-y-2 px-2 py-1">
      <div className="h-9 animate-pulse rounded-xl bg-surface-panel/50" />
      <div className="h-9 animate-pulse rounded-xl bg-surface-panel/40" />
      <div className="h-9 animate-pulse rounded-xl bg-surface-panel/40" />
    </div>
  );
}

