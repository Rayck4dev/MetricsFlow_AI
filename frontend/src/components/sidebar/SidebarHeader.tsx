"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Store } from "lucide-react";

interface SidebarHeaderProps {
  demo: boolean;
  companyName: string;
  userLoading: boolean;
}

export function SidebarHeader({
  demo,
  companyName,
  userLoading,
}: SidebarHeaderProps) {
  return (
    <div className="border-b border-surface-border p-4">
      <Link
        href={demo ? "/" : "/dashboard"}
        className="group flex items-center gap-3"
      >
        <motion.div
          whileHover={{
            scale: 1.05,
            rotate: 2,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="
            relative
            flex h-10 w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
          "
        >
          <div
            className="
              absolute inset-0
              rounded-xl
              bg-brand-500/10
              opacity-0
              blur-xl
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          />

          <Image
            src="/logo_metrics_bg.png"
            alt="MetricsFlow AI"
            width={34}
            height={34}
            priority
            className="relative z-10 object-contain"
          />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-heading text-sm font-bold tracking-tight text-white">
              MetricsFlow
            </p>

            <span
              className="
                rounded-md
                border border-brand-500/20
                bg-brand-500/10
                px-1.5 py-0.5
                text-[9px]
                font-bold
                text-brand-400
              "
            >
              AI
            </span>
          </div>

          <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
            <Store size={9} className="shrink-0 text-slate-600" />

            <p className="truncate text-[10px] font-medium text-slate-500">
              {demo ? companyName : userLoading ? "Carregando..." : companyName}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
