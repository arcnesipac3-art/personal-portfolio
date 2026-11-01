import { useEffect, useState } from "react";

/**
 * Returns true if the media query matches.
 * Used to detect touch devices, reduced motion, and screen sizes.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** Convenience hook: true on desktop (pointer: fine) */
export function useIsDesktop(): boolean {
  return useMediaQuery("(pointer: fine)");
}

/** Convenience hook: true when user prefers reduced motion */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
