"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navigation, accountNavigation, type SidebarSection } from "@/data/sidebar.data";
import { SidebarContent } from "./SidebarContent";

interface SidebarLayoutProps {
  demo: boolean;
  displayCompanyName: string;
  displayUserName: string;
  userLoading: boolean;
  role: "owner" | "collaborator" | null;
  visibleNavigation: typeof navigation;
  visibleAccountNavigation: typeof accountNavigation;
  activeDemoSection: SidebarSection;
  hoveredTab: SidebarSection | null;
  setHoveredTab: (section: SidebarSection | null) => void;
  mobileOpen: boolean;
  onToggleMobileMenu: () => void;
  closeMobileSidebar: () => void;
  isActive: (href: string) => boolean;
  handleDemoNavigation: (section: SidebarSection) => void;
  onLogout?: () => void;
}

export function SidebarLayout({
  demo, displayCompanyName, displayUserName, userLoading, role,
  visibleNavigation, visibleAccountNavigation, activeDemoSection, hoveredTab,
  setHoveredTab, mobileOpen, onToggleMobileMenu, closeMobileSidebar, isActive,
  handleDemoNavigation, onLogout,
}: SidebarLayoutProps) {
  return (
    <>
      <button
        type="button"
        aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={mobileOpen}
        onClick={() => onToggleMobileMenu()}
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
