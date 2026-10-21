import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function HeroActions({ variants }: { variants: Variants }) {
  return (
<motion.div
                variants={variants}
                className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Link
                  href="/cadastro"
                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-brand-600
                    px-7
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-xl
                    shadow-brand-600/20
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-brand-500
                    hover:shadow-2xl
                    hover:shadow-brand-500/20
                    sm:w-auto
                  "
                >
                  Começar grátis
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/demo"
                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-surface-border
                    bg-surface-panel/80
                    px-7
                    py-3.5
                    text-sm
                    font-semibold
                    text-slate-300
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-slate-600
                    hover:bg-surface-sidebar
                    hover:text-white
                    sm:w-auto
                  "
                >
                  Ver demonstração
                  <ArrowUpRight
                    size={16}
                    className="text-slate-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </motion.div>
  );
}
