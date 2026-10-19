"use client";

import Link from "next/link";
import Image from "next/image";

export interface NavbarLogoProps {
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function NavbarLogo({ onClick }: NavbarLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group flex shrink-0 items-center gap-3"
    >
      <Image
        src="/logo_metrics_bg.png"
        alt="MetricsFlow AI"
        width={58}
        height={53}
        priority
        className="h-[50px] w-[50px] object-contain transition-transform duration-300 group-hover:scale-105"
      />

      <span className="font-heading text-[15px] font-bold tracking-tight text-white sm:text-base">
        MetricsFlow <span className="text-brand-400">AI</span>
      </span>
    </Link>
  );
}
