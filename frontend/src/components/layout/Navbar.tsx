"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { DesktopCta } from "./navbar/DesktopCta";
import { DesktopNavigation } from "./navbar/DesktopNavigation";
import { MobileMenu } from "./navbar/MobileMenu";
import { MobileMenuButton } from "./navbar/MobileMenuButton";
import { animationEase } from "./navbar/nav-data";
import { NavbarContainer } from "./navbar/NavbarContainer";
import { NavbarLogo } from "./navbar/NavbarLogo";

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
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    closeMobileMenu();

    if (window.location.pathname !== "/") {
      return;
    }

    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: animationEase }}
        className="fixed left-0 right-0 top-0 z-50 px-4 sm:px-6"
      >
        <div className="mx-auto max-w-5xl pt-4 sm:pt-5">
          <NavbarContainer scrolled={scrolled}>
            <NavbarLogo onClick={handleLogoClick} />
            <DesktopNavigation />
            <DesktopCta />
            <MobileMenuButton
              open={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((current) => !current)}
            />
          </NavbarContainer>
        </div>
      </motion.header>

      <MobileMenu open={mobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
