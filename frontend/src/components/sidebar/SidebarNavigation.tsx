"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import {
  type NavigationItem,
  type SidebarSection,
} from "@/data/sidebar.data";

import { SidebarNavigationItem } from "@/components/sidebar/SidebarNavigationItem";

interface SidebarNavigationProps {
  demo: boolean;
  userLoading: boolean;
  visibleItems: NavigationItem[];
  activeSection: SidebarSection;
  hoveredTab: SidebarSection | null;
  onHover: (section: SidebarSection | null) => void;
  onDemoNavigation: (section: SidebarSection) => void;
}

export function SidebarNavigation({
  demo,
  userLoading,
  visibleItems,
  activeSection,
  hoveredTab,
  onHover,
  onDemoNavigation,
}: SidebarNavigationProps) {
  return (
    <div className="flex-1 space-y-1">
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Sparkles size={10} className="text-brand-400/60" />
          </motion.div>
        )}
      </div>

      {userLoading && !demo ? (
        <NavigationSkeleton />
      ) : (
        visibleItems.map((item) => (
          <SidebarNavigationItem
            key={item.id}
            item={item}
            active={demo ? activeSection === item.id : false}
            hovered={hoveredTab === item.id}
            demo={demo}
            onHover={onHover}
            onDemoNavigation={onDemoNavigation}
          />
        ))
      )}
    </div>
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
