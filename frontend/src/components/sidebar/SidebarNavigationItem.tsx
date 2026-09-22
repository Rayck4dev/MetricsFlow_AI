"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { NavigationItem, SidebarSection } from "@/data/sidebar.data";

interface SidebarNavigationItemProps {
  item: NavigationItem;
  active: boolean;
  hovered: boolean;
  demo: boolean;
  onHover: (id: SidebarSection) => void;
  onDemoNavigation?: (section: SidebarSection) => void;
  variant?: "main" | "account";
  layoutNamespace?: string;
  onNavigate?: () => void;
}

export function SidebarNavigationItem({
  item,
  active,
  hovered,
  demo,
  onHover,
  onDemoNavigation,
  variant = "main",
  layoutNamespace = "sidebar",
  onNavigate,
}: SidebarNavigationItemProps) {
  const Icon = item.icon;
  const isAccount = variant === "account";
  const activeLayoutId = `${layoutNamespace}-${
    isAccount ? "account-active" : "active-tab"
  }`;
  const hoverLayoutId = `${layoutNamespace}-${
    isAccount ? "account-hover" : "hover-tab"
  }`;
  const dotLayoutId = `${layoutNamespace}-${
    isAccount ? "account-dot" : "active-dot"
  }`;

  const content = (
    <>
      {active && (
        <motion.div
          layoutId={activeLayoutId}
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

      {hovered && !active && (
        <motion.div
          layoutId={hoverLayoutId}
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
              active
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
            layoutId={dotLayoutId}
            className="
              ml-auto
              h-1.5 w-1.5
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

  const baseClass = `
    group
    relative
    flex
    w-full
    items-center
    rounded-xl
    px-2.5
    py-2.5
    text-left
  `;

  if (demo) {
    return (
      <motion.button
        key={item.id}
        type="button"
        whileTap={{ scale: 0.97 }}
        onMouseEnter={() => onHover(item.id)}
        onClick={() => {
          onDemoNavigation?.(item.id);
          onNavigate?.();
        }}
        className={baseClass}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div key={item.id} whileTap={{ scale: 0.97 }}>
      <Link
        href={item.href}
        onMouseEnter={() => onHover(item.id)}
        onClick={onNavigate}
        className={baseClass}
      >
        {content}
      </Link>
    </motion.div>
  );
}
