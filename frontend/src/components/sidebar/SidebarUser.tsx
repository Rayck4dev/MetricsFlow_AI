"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CircleUserRound,
  ExternalLink,
  LogOut,
  Settings,
  Store,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface SidebarUserProps {
  demo: boolean;
  userName: string;
  userRole: "owner" | "collaborator" | null;
  onLogout?: () => void;
}

export function SidebarUser({
  demo,
  userName,
  userRole,
  onLogout,
}: SidebarUserProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const supabase = createClient();

  async function handleLogout() {
    if (demo || isLoggingOut) return;

    setIsLoggingOut(true);
    setShowUserMenu(false);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro ao sair:", error);
        return;
      }

      onLogout?.();
    } catch (error) {
      console.error("Erro inesperado ao fazer logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="relative border-t border-surface-border p-3">
      <motion.button
        type="button"
        whileTap={{ scale: demo ? 1 : 0.98 }}
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
            flex h-8 w-8
            shrink-0
            items-center justify-center
            rounded-full
            border border-brand-500/20
            bg-brand-500/10
          "
        >
          <CircleUserRound size={17} className="text-brand-400" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold text-slate-200">
            {userName}
          </p>

          <p className="truncate text-[8px] text-slate-600">
            {demo
              ? "Visitante"
              : userRole === "collaborator"
                ? "Colaborador"
                : userRole === "owner"
                  ? "Proprietário"
                  : "Conta MetricsFlow"}
          </p>
        </div>

        {!demo && (
          <motion.span
            animate={{ x: showUserMenu ? 2 : 0 }}
            className="text-slate-600"
          >
            ⋯
          </motion.span>
        )}
      </motion.button>

      {!demo && showUserMenu && (
        <UserMenu
          isOwner={userRole === "owner"}
          isLoggingOut={isLoggingOut}
          onClose={() => setShowUserMenu(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

interface UserMenuProps {
  isOwner: boolean;
  isLoggingOut: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function UserMenu({ isOwner, isLoggingOut, onClose, onLogout }: UserMenuProps) {
  return (
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
        border border-surface-border
        bg-surface-panel
        p-1.5
        shadow-2xl
        shadow-black/40
      "
    >
      <UserMenuLink
        href="/perfil"
        icon={CircleUserRound}
        label="Meu perfil"
        onClick={onClose}
      />

      {isOwner && (
        <UserMenuLink
          href="/empresa"
          icon={Store}
          label="Empresa"
          onClick={onClose}
        />
      )}

      <UserMenuLink
        href="/preferencias"
        icon={Settings}
        label="Preferências"
        onClick={onClose}
      />

      <div className="my-1 h-px bg-surface-border" />

      <UserMenuLink
        href="/"
        icon={ExternalLink}
        label="Voltar ao site"
        onClick={onClose}
      />

      <div className="my-1 h-px bg-surface-border" />

      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="
          flex
          w-full
          items-center
          gap-2.5
          rounded-lg
          px-3 py-2.5
          text-[10px]
          font-semibold
          text-red-400
          transition-colors
          hover:bg-red-500/10
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <LogOut size={13} className={isLoggingOut ? "animate-pulse" : ""} />

        {isLoggingOut ? "Saindo..." : "Sair da conta"}
      </button>
    </motion.div>
  );
}

function UserMenuLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: typeof CircleUserRound;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex
        items-center
        gap-2.5
        rounded-lg
        px-3 py-2.5
        text-[10px]
        font-semibold
        text-slate-400
        transition-colors
        hover:bg-surface-sidebar
        hover:text-white
      "
    >
      <Icon size={13} />
      {label}
    </Link>
  );
}
