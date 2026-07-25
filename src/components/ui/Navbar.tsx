"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES, HOME_SECTIONS } from "@/lib/constants";
import { useAppStore } from "@/lib/store";

export function Navbar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useAppStore();

  // Scroll spy to highlight the active section on the homepage
  const [activeSection, setActiveSection] = useState<string>(HOME_SECTIONS[0].id);

  const onHome = pathname === ROUTES.home;

  useEffect(() => {
    if (!onHome) return;

    const sections = HOME_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  const activeHref = onHome
    ? HOME_SECTIONS.find((s) => s.id === activeSection)?.href
    : undefined;

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-[#2e2617]/60 transition-colors duration-300">
        <nav className="relative mx-auto flex max-w-[1600px] items-center justify-between px-4 sm:px-6 py-3 md:py-3.5">
          
          {/* Brand Logo - Left Side */}
          <Link href="/" className="group flex items-center gap-3 shrink-0 z-10">
            {/* Circular AP Badge */}
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#c9a96e]/60 bg-[#0d0c0a] shadow-[0_0_15px_rgba(201,169,110,0.15)] transition-all duration-300 group-hover:border-[#e6ce96] group-hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]">
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#e6ce96]">
                AP
              </span>
            </div>

            {/* Audemars Piguet Text Block */}
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-[13px] font-extrabold tracking-[0.2em] text-[#e6ce96] uppercase leading-tight transition-colors group-hover:text-white">
                AUDEMARS PIGUET
              </span>
              <span className="text-[8px] sm:text-[9px] font-medium tracking-[0.22em] text-[#a39474]/80 uppercase mt-0.5">
                LE BRASSUS, SUISSE
              </span>
            </div>
          </Link>

          {/* Center Floating Capsule Navigation - Desktop */}
          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-[#3d3321]/90 bg-[#0c0b08]/90 backdrop-blur-2xl p-1.5 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              {HOME_SECTIONS.map((link) => {
                const isActive = activeHref === link.href || (onHome && link.href === "/#home" && activeSection === "home");

                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={cn(
                      "relative px-3 xl:px-4 py-1.5 text-[11px] xl:text-[12px] font-extrabold tracking-[0.16em] uppercase transition-colors duration-200 rounded-full select-none",
                      isActive
                        ? "text-[#0a0a0a]"
                        : "text-[#d6c5a3]/80 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-glow"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3d687] to-[#b89228] shadow-[0_0_22px_rgba(229,193,88,0.55)]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50 rounded-full border border-[#4a3e28] p-2 text-[#e6ce96] hover:bg-[#c9a96e]/10 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer - Fast, Lightweight Luxury Typography */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#0a0a0a] px-6 pt-28 pb-12 lg:hidden"
          >
            <div className="relative z-10 flex flex-col items-center justify-center gap-6 my-auto w-full max-w-sm mx-auto">
              <span className="mb-2 text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a96e]/70">
                NAVIGATION
              </span>

              {HOME_SECTIONS.map((link) => {
                const isActive = activeHref === link.href;

                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "group flex flex-col items-center text-center py-1.5 transition-colors duration-150",
                      isActive
                        ? "text-[#f3d687] font-extrabold"
                        : "text-[#d6c5a3]/80 hover:text-white font-medium"
                    )}
                  >
                    <span className="text-xl sm:text-2xl tracking-[0.22em] uppercase">
                      {link.label}
                    </span>
                    {isActive && (
                      <span className="mt-1 h-0.5 w-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3d687]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2 text-center border-t border-[#2e2617]/80 pt-6">
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#a39474]/70">
                AUDEMARS PIGUET • LE BRASSUS, SUISSE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
