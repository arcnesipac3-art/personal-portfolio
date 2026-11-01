import { useEffect, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

/** Chrome colours, kept in step with the `theme-color` meta in index.html. */
const CHROME: Record<Theme, string> = { dark: "#080B12", light: "#E7E3DA" };

/**
 * Read once at module load, which is after the pre-paint script in index.html
 * has already stamped `<html>`. Seeding from the DOM rather than from
 * localStorage means the store agrees with the page that is on screen even if
 * the OS preference is what resolved, and there is no window in which the
 * toggle shows the wrong icon.
 */
let current: Theme =
  typeof document !== "undefined" && document.documentElement.classList.contains("light")
    ? "light"
    : "dark";

const listeners = new Set<() => void>();

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", CHROME[theme]);
}

function commit(theme: Theme) {
  if (theme === current) return;
  current = theme;
  apply(theme);
  for (const notify of listeners) notify();
}

/** The subset of the View Transitions API we use, typed so the feature check
 *  stays honest on browsers that have not shipped it. */
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

/** Where the reveal should start, in viewport pixels — normally the centre of
 *  the switch that was clicked. */
export interface RevealOrigin {
  x: number;
  y: number;
}

/**
 * Flip the theme and remember the choice. Only ever called from a click.
 *
 * Changing the theme repaints every element on the page, so without help it
 * reads as a hard cut. Where the browser supports view transitions the new
 * palette is painted on the incoming snapshot and revealed by a circle grown
 * from the switch, which turns the swap into something that looks intentional.
 * Everywhere else — and for anyone who asked for less motion — the cut stays.
 */
export function toggleTheme(origin?: RevealOrigin) {
  const next: Theme = current === "dark" ? "light" : "dark";

  const commitChoice = () => {
    commit(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Private mode or a locked-down localStorage: the session still switches. */
    }
  };

  const viewTransition = (document as ViewTransitionDocument).startViewTransition;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (calm || !viewTransition) {
    commitChoice();
    return;
  }

  const transition = viewTransition.call(document, commitChoice);
  transition.ready
    .then(() => {
      const x = origin?.x ?? window.innerWidth - 32;
      const y = origin?.y ?? 32;
      // Far enough to clear whichever corner is furthest from the switch.
      const reach = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${reach}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 620,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      /* The transition was skipped (a second toggle, or a hidden document);
         the new theme is already applied either way. */
    });
}

/**
 * Reads as an external store rather than local state because the toggle is
 * rendered twice — once in the navbar, once inside the mobile menu. Two
 * `useState` copies would each hold their own idea of the theme and the
 * un-clicked one would show a stale icon.
 */
export function useTheme(): Theme {
  const theme = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );

  // Until the visitor picks a side, follow the OS. Once `localStorage` holds a
  // choice the toggle owns the theme and this defers to it.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        return;
      }
      commit(event.matches ? "light" : "dark");
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return theme;
}
