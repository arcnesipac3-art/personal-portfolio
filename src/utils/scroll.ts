/**
 * Height of the fixed navbar plus a little breathing room.
 * Used to offset anchor scrolling so section headings are not hidden
 * behind the navigation bar.
 */
const NAV_OFFSET = 72;

/**
 * Smoothly scrolls to an in-page section (e.g. "#projects"),
 * offsetting for the fixed navbar. Falls back to a normal jump when
 * the user prefers reduced motion.
 */
export function scrollToSection(href: string) {
  if (!href.startsWith("#")) return;

  const id = href.slice(1);
  const behavior: ScrollBehavior = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
    ? "auto"
    : "smooth";

  if (!id || id === "top" || id === "home") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top: Math.max(top, 0), behavior });
}
