"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";
import { animationEase, navItems } from "./nav-data";

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: animationEase }}
          className="fixed inset-x-0 top-0 z-40 min-h-screen bg-[#09090b]/95 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden"
        >
          <div className="pointer-events-none absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/[0.07] blur-[90px]" />

          <MobileNavigation onClose={onClose} />
          <MobileCta onClose={onClose} />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative mt-6 text-center text-[9px] text-slate-600"
          >
            Gestão financeira no ritmo da sua conversa.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MobileNavigationProps {
  onClose: () => void;
}

function MobileNavigation({ onClose }: MobileNavigationProps) {
  return (
    <nav className="relative flex flex-col gap-2">
      {navItems.map((item, index) => (
        <motion.a
          key={item.href}
          href={item.href}
          onClick={onClose}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 + index * 0.06 }}
          className="border-b border-white/[0.06] py-4 text-sm font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
        >
          {item.label}
        </motion.a>
      ))}
    </nav>
  );
}

interface MobileCtaProps {
  onClose: () => void;
}

function MobileCta({ onClose }: MobileCtaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="relative mt-8 space-y-3"
    >
      <Link
        href="/demo"
        onClick={onClose}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-brand-600/20 transition-all duration-300 hover:bg-brand-500 hover:shadow-brand-500/20"
      >
        <Sparkles
          size={14}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
        Testar Plataforma
        <ArrowRight
          size={14}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>

      <Link
        href="/login"
        onClick={onClose}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3.5 text-xs font-bold uppercase tracking-wider text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-brand-500/20 hover:bg-brand-500/[0.06] hover:text-white"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.05] text-slate-400 transition-colors duration-300 group-hover:bg-brand-500/10 group-hover:text-brand-400">
          <LogIn size={13} />
        </span>
        Já tenho uma conta
      </Link>
    </motion.div>
  );
}
