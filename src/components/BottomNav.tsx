import { motion, useReducedMotion } from "motion/react";
import {
  Code2,
  FolderKanban,
  GraduationCap,
  Mail,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";
import { navLinks } from "../data/portfolio";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { scrollToSection } from "../utils/scroll";

const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

/** One glyph per section, keyed by the href it points at. */
const ICONS: Record<string, LucideIcon> = {
  "#about": User,
  "#projects": FolderKanban,
  "#skills": Code2,
  "#journey": GraduationCap,
  "#achievements": Trophy,
  "#contact": Mail,
};

/**
 * Floating bottom bar for small screens.
 *
 * The top bar carries identity and the palette trigger, which left navigation
 * on mobile behind a hamburger — every section cost two taps and the menu
 * covered the page while you chose. This puts all six sections one tap away
 * along the thumb edge instead, using the same active-pill vocabulary as the
 * desktop links so the two read as one nav.
 *
 * Labels are dropped rather than shrunk: six of them cannot fit legibly at
 * 320px, so each button is an icon with an `aria-label` and the bar widens to
 * `md` only to disappear there, where the inline links take over.
 *
 * Sits at `z-30` on purpose — the mobile menu overlay is `z-40` and has to
 * still cover it.
 */
export function BottomNav() {
  const activeId = useScrollSpy(sectionIds, 80);
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-3 md:hidden">
      <motion.nav
        aria-label="Sections"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: reduceMotion ? 0 : 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-white/8 bg-bg-secondary/85 p-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      >
        {navLinks.map((link) => {
          const id = link.href.replace("#", "");
          const isActive = activeId === id;
          const Icon = ICONS[link.href] ?? User;

          return (
            <button
              key={link.href}
              type="button"
              onClick={() => scrollToSection(link.href)}
              aria-label={link.label}
              aria-current={isActive ? "location" : undefined}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 focus-ring ${
                isActive ? "text-blue" : "text-text-muted active:text-text-secondary"
              }`}
            >
              {/* Shared element, so the highlight glides between sections
                  instead of blinking from one to the next. */}
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-active"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full border border-blue/20 bg-blue/8"
                  aria-hidden
                />
              )}
              <Icon size={18} className="relative" />
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
