import { Moon, Sun } from "lucide-react";
import type { MouseEvent } from "react";
import { toggleTheme, useTheme } from "../hooks/useTheme";

interface ThemeToggleProps {
  /**
   * Names the control beside the icon. Used inside the mobile menu, where the
   * extra width is free and an unlabelled glyph would be ambiguous; the navbar
   * keeps the bare icon so it matches the palette trigger next to it.
   */
  labelled?: boolean;
}

/**
 * The icon shows what the button *does* — a sun means "there is a light theme
 * to switch to" — and the accessible name spells the same thing out, so the
 * visible and spoken labels never disagree.
 */
export function ThemeToggle({ labelled = false }: ThemeToggleProps) {
  const theme = useTheme();
  const toLight = theme === "dark";
  const Icon = toLight ? Sun : Moon;
  const label = toLight ? "Switch to light theme" : "Switch to dark theme";

  // The new palette sweeps out from the control that was pressed, so the
  // reveal starts under the pointer rather than in the middle of the screen.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className={
        labelled
          ? "flex h-10 items-center gap-2.5 rounded border border-border px-3.5 text-text-secondary transition-colors hover:border-blue/40 hover:text-blue focus-ring"
          : "flex h-8 w-8 items-center justify-center rounded border border-border text-text-secondary transition-all hover:border-blue/40 hover:text-blue active:scale-95 focus-ring"
      }
    >
      <Icon size={labelled ? 15 : 14} aria-hidden />
      {labelled && (
        <span className="text-[13px] font-medium">
          {toLight ? "Light" : "Dark"} mode
        </span>
      )}
    </button>
  );
}
