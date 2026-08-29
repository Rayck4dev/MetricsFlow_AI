"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";

const navItems = [
  {
    label: "Como Funciona",
    href: "#como-funciona",
  },
  {
    label: "Recursos",
    href: "#recursos",
  },
  {
    label: "Para MEIs",
    href: "#diferenciais",
  },
];

export function Navbar() {
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          px-4
          sm:px-6
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
            pt-4
            sm:pt-5
          "
        >
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
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              flex
              items-center
              justify-between
              border
              backdrop-blur-xl
            "
          >
            <Link
              href="/"
              onClick={(event) => {
                closeMobileMenu();
                if (window.location.pathname === "/") {
                  event.preventDefault();

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }
              }}
              className="group flex items-center gap-3 shrink-0"
            >
              <Image
                src="/logo_metrics_bg.png"
                alt="MetricsFlow AI"
                width={58}
                height={53}
                priority
                className="
      h-[50px]
      w-[50px]
      object-contain
      transition-transform
      duration-300
      group-hover:scale-105
    "
              />

              <span
                className="
      font-heading
      text-[15px]
      font-bold
      tracking-tight
      text-white
      sm:text-base
    "
              >
                MetricsFlow <span className="text-brand-400">AI</span>
              </span>
            </Link>

            <nav
              className="
                hidden
                items-center
                gap-7
                md:flex
              "
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="
                    group
                    relative
                    py-2
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                    transition-colors
                    duration-300
                    hover:text-white
                  "
                >
                  {item.label}

                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-px
                      w-0
                      bg-brand-400
                      transition-all
                      duration-300
                      group-hover:w-full
                    "
                  />
                </a>
              ))}
            </nav>

            <div className="hidden md:block">
              <Link
                href="/demo"
                className="
                  group
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-brand-600
                  px-4
                  py-2.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                  shadow-lg
                  shadow-brand-600/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-brand-500
                  hover:shadow-brand-500/20
                "
              >
                <Sparkles
                  size={13}
                  className="
                    transition-transform
                    duration-300
                    group-hover:rotate-12
                  "
                />
                Testar Plataforma
                <ArrowRight
                  size={13}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </Link>
            </div>

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.03]
                md:hidden
              "
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{
                      opacity: 0,
                      rotate: -45,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: 45,
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                  >
                    <div className="flex flex-col gap-1.5">
                      <span className="h-px w-5 bg-white" />
                      <span className="h-px w-3.5 self-end bg-white/70" />
                      <span className="h-px w-5 bg-white" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              fixed
              inset-x-0
              top-0
              z-40
              min-h-screen
              bg-[#09090b]/95
              px-6
              pb-10
              pt-28
              backdrop-blur-2xl
              md:hidden
            "
          >
            <div className="pointer-events-none absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/[0.07] blur-[90px]" />

            <nav className="relative flex flex-col gap-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.05 + index * 0.06,
                  }}
                  className="
                    border-b
                    border-white/[0.06]
                    py-4
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                    transition-colors
                    hover:text-white
                  "
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay: 0.25,
              }}
              className="relative mt-8"
            >
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-brand-600
                  py-3.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                  shadow-xl
                  shadow-brand-600/20
                "
              >
                <Sparkles size={14} />
                Testar Plataforma
                <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.4,
              }}
              className="
                relative
                mt-6
                text-center
                text-[9px]
                text-slate-600
              "
            >
              Gestão financeira no ritmo da sua conversa.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
