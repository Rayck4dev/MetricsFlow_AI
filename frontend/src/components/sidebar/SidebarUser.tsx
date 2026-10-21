"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CircleUserRound } from "lucide-react";
import { UserMenu } from "./sidebar-user/UserMenu";

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
