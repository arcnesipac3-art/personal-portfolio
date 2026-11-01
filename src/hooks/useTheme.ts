import { useEffect, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

/** Chrome colours, kept in step with the `theme-color` meta in index.html. */
const CHROME: Record<Theme, string> = { dark: "#080B12", light: "#FAF9F7" };

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

/** Flip the theme and remember the choice. Only ever called from a click. */
export function toggleTheme() {
  const next: Theme = current === "dark" ? "light" : "dark";
  commit(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* Private mode or a locked-down localStorage: the session still switches. */
  }
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
