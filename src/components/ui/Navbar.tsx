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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
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
          className="relative z-50 text-cream md:hidden"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center gap-8">
              {HOME_SECTIONS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-light tracking-widest text-cream/80 uppercase transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
