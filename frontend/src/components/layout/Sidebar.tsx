"use client";

import { useState } from "react";
import { Settings, Sparkles } from "lucide-react";
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
  const router = useRouter();

  const { user, loading: userLoading } = useUser();

  const [hoveredTab, setHoveredTab] = useState<SidebarSection | null>(null);

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

  const visibleNavigation = navigation.filter((item) =>
    canSeeMainItem(item.id),
  );

  const visibleAccountNavigation = accountNavigation.filter((item) =>
    canSeeAccountItem(item.id),
  );

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
                    onHover={setHoveredTab}
                    onDemoNavigation={handleDemoNavigation}
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
                        demo
                          ? activeDemoSection === item.id
                          : isActive(item.href)
                      }
                      hovered={hoveredTab === item.id}
                      onHover={setHoveredTab}
                      onDemoNavigation={handleDemoNavigation}
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
      </div>
    </aside>
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
