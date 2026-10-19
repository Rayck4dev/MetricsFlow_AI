"use client";

import { navItems } from "./nav-data";

export function DesktopNavigation() {
  return (
    <nav className="hidden items-center gap-7 md:flex">
      {navItems.map((item) => (
        <DesktopNavItem key={item.href} label={item.label} href={item.href} />
      ))}
    </nav>
  );
}

interface DesktopNavItemProps {
  label: string;
  href: string;
}

function DesktopNavItem({ label, href }: DesktopNavItemProps) {
  return (
    <a
      href={href}
      className="group relative py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition-colors duration-300 hover:text-white"
    >
      {label}
      <span className="absolute bottom-0 left-0 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-full" />
    </a>
  );
}
