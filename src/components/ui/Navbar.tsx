"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES, BRAND, HOME_SECTIONS } from "@/lib/constants";
import { useAppStore } from "@/lib/store";

export function Navbar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useAppStore();

  // Which homepage section is currently centered in the viewport. Only
  // meaningful on the home page; the scroll-spy observer keeps it in sync.
  const [activeSection, setActiveSection] = useState<string>(HOME_SECTIONS[0].id);

  const onHome = pathname === ROUTES.home;

  useEffect(() => {
    if (!onHome) return;

    const sections = HOME_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    // A narrow band across the vertical middle of the viewport decides which
    // section is "active" — whichever crosses the band is highlighted.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  // The active anchor href for the gold pill. On the home page it follows the
  // scrolled-to section; elsewhere nothing is highlighted (these are anchors).
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
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-200",
          !isMobileMenuOpen && "mix-blend-difference"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-bold tracking-widest text-cream uppercase">
            {BRAND.name.split(" ")[0]}
            <span className="text-gold">.</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {HOME_SECTIONS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-200",
                  activeHref === link.href
                    ? "text-black"
                    : "text-cream/70 hover:text-cream"
                )}
              >
                {activeHref === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-sm bg-gold"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-50 p-2 text-cream hover:text-gold transition-colors md:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>
      </header>

      {/* Mobile Navigation Fullscreen Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-black/98 px-6 pt-24 pb-12 backdrop-blur-2xl md:hidden"
            style={{ isolation: "isolate" }}
          >
            {/* Ambient Gold Background Glow */}
            <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gold/10 blur-[100px]" />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 my-auto">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold/60 font-medium">
                Navigation
              </span>

              {HOME_SECTIONS.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex flex-col items-center text-center"
                  >
                    <span className="text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase text-cream transition-colors group-hover:text-gold">
                      {link.label}
                    </span>
                    <span className="mt-1 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-8" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4 text-center border-t border-white/10 pt-6">
              <Link
                href={ROUTES.collections}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full max-w-xs rounded-sm border border-gold/40 bg-gold/10 py-3 text-xs font-medium tracking-[0.2em] uppercase text-gold transition-all hover:bg-gold hover:text-black"
              >
                Explore Timepieces
              </Link>
              <p className="text-[10px] tracking-widest uppercase text-cream/40">
                {BRAND.tagline}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
