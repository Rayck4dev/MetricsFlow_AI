"use client";

import { useCallback, useEffect, useState } from "react";
import { SidebarLayout } from "./sidebar/SidebarLayout";
import { usePathname } from "next/navigation";

import { useUser } from "@/contexts/UserContext";

import {
  navigation,
  accountNavigation,
  type SidebarSection,
} from "@/data/sidebar.data";


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

  return <SidebarLayout
    demo={demo}
    displayCompanyName={displayCompanyName}
    displayUserName={displayUserName}
    userLoading={userLoading}
    role={role}
    visibleNavigation={visibleNavigation}
    visibleAccountNavigation={visibleAccountNavigation}
    activeDemoSection={activeDemoSection}
    hoveredTab={hoveredTab}
    setHoveredTab={setHoveredTab}
    mobileOpen={mobileOpen}
    onToggleMobileMenu={() => setMobileOpen((current) => !current)}
    closeMobileSidebar={closeMobileSidebar}
    isActive={isActive}
    handleDemoNavigation={handleDemoNavigation}
    onLogout={onLogout}
  />;
}

