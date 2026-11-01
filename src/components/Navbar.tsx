import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { personalInfo, navLinks } from "../data/portfolio";
import { scrollToSection } from "../utils/scroll";
import { ScrollProgressBar } from "./ScrollProgressBar";

const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

/** Shown on the palette trigger — the accelerator differs per platform. */
const SHORTCUT_LABEL =
  typeof navigator !== "undefined" && /Mac|iP(hone|ad|od)/.test(navigator.userAgent)
    ? "⌘ K"
    : "Ctrl K";

export function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
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
            ? "border-b border-border bg-bg/90 shadow-[0_12px_32px_-24px_rgba(0,0,0,1)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`shell flex items-center justify-between transition-[padding] duration-300 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
            className="flex items-center gap-2.5 rounded transition-transform active:scale-[0.97] focus-ring"
          >
            <span className="flex h-7 w-7 items-center justify-center border border-border font-mono text-[11px] font-bold text-text-secondary transition-colors hover:border-blue/40 hover:text-blue">
              {personalInfo.monogram}
            </span>
            <span className="font-display text-[13px] font-semibold tracking-tight text-text-primary">
              {personalInfo.name}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
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
                      ? "text-text-primary"
                      : "text-text-muted hover:bg-white/3 hover:text-text-secondary"
                  }`}
                  aria-current={isActive ? "location" : undefined}
                >
                  {/* One shared element, so the highlight glides between links */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded border border-blue/20 bg-blue/8"
                      aria-hidden
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            {/* Palette trigger — the only way to reach it on touch devices */}
            <button
              onClick={onOpenPalette}
              className="flex h-8 items-center gap-1.5 rounded border border-border px-2 text-text-secondary transition-all hover:border-blue/40 hover:text-blue active:scale-95 focus-ring"
              aria-label="Open command palette"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <Search size={13} />
              <kbd className="hidden font-mono text-[10px] tracking-wider lg:inline">
                {SHORTCUT_LABEL}
              </kbd>
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded text-text-secondary transition-all hover:text-text-primary active:scale-90 md:hidden focus-ring"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
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
              className="absolute inset-0 bg-bg/95 backdrop-blur-xl"
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
                      isActive ? "text-blue" : "text-text-secondary hover:text-blue"
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
