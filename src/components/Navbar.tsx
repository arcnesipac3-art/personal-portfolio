import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { personalInfo, navLinks } from "../data/portfolio";
import { scrollToSection } from "../utils/scroll";
import { ScrollProgressBar } from "./ScrollProgressBar";

const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrollPosition(20);
  const activeId = useScrollSpy(sectionIds, 80);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(mobileMenuRef, mobileOpen);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    scrollToSection(href);
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <nav
        aria-label="Primary"
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-[#192437] bg-[#080b12]/90 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
            className="flex items-center gap-2.5 rounded transition-transform active:scale-[0.97] focus-ring"
          >
            <span className="flex h-7 w-7 items-center justify-center border border-[#192437] font-mono text-[11px] font-bold text-[#9aa8bd] transition-colors hover:border-[#2878f0]/40 hover:text-[#2878f0]">
              {personalInfo.monogram}
            </span>
            <span className="font-display text-[13px] font-semibold tracking-tight text-[#f4f7fc]">
              {personalInfo.name}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeId === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`relative rounded px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-200 focus-ring ${
                    isActive
                      ? "bg-white/[0.04] text-[#f4f7fc]"
                      : "text-[#66758b] hover:text-[#9aa8bd]"
                  }`}
                  aria-current={isActive ? "location" : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-px w-3 bg-[#2878f0]" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded text-[#9aa8bd] transition-all hover:text-[#f4f7fc] active:scale-90 md:hidden focus-ring"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-[#080b12]/95 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative flex h-full flex-col items-center justify-center gap-1.5 px-6"
            >
              {navLinks.map((link, i) => {
                const id = link.href.replace("#", "");
                const isActive = activeId === id;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i + 0.08, duration: 0.25 }}
                    aria-current={isActive ? "location" : undefined}
                    className={`font-display text-2xl font-semibold tracking-tight transition-colors active:scale-[0.98] ${
                      isActive ? "text-[#2878f0]" : "text-[#9aa8bd] hover:text-[#2878f0]"
                    }`}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
