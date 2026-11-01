import { useEffect, useState } from "react";

/**
 * Returns true when the page has been scrolled past the threshold.
 * Used for navbar background transitions.
 */
export function useScrollPosition(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();

    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  return scrolled;
}
