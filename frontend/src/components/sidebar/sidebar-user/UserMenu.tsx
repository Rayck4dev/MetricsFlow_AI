import Link from "next/link";
import { motion } from "framer-motion";
import {
  CircleUserRound,
  ExternalLink,
  LogOut,
  Settings,
  Store,
} from "lucide-react";

interface UserMenuProps {
  isOwner: boolean;
  isLoggingOut: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function UserMenu({
  isOwner,
  isLoggingOut,
  onClose,
  onLogout,
}: UserMenuProps) {
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
