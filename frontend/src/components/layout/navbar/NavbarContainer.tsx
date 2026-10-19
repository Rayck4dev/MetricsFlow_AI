"use client";

import { motion } from "framer-motion";
import { animationEase } from "./nav-data";

export interface NavbarContainerProps {
  scrolled: boolean;
  children: React.ReactNode;
}

export function NavbarContainer({ scrolled, children }: NavbarContainerProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        paddingLeft: scrolled ? 20 : 4,
        paddingRight: scrolled ? 20 : 4,
        paddingTop: scrolled ? 8 : 4,
        paddingBottom: scrolled ? 8 : 4,
        borderRadius: scrolled ? 999 : 20,
        backgroundColor: scrolled
          ? "rgba(12, 12, 16, 0.72)"
          : "rgba(12, 12, 16, 0)",
        borderColor: scrolled
          ? "rgba(255, 255, 255, 0.07)"
          : "rgba(255, 255, 255, 0)",
        boxShadow: scrolled
          ? "0 18px 50px rgba(0, 0, 0, 0.35)"
          : "0 0 0 rgba(0, 0, 0, 0)",
      }}
      transition={{
        duration: 0.45,
        ease: animationEase,
      }}
      className="flex items-center justify-between border backdrop-blur-xl"
    >
      {children}
    </motion.div>
  );
}
