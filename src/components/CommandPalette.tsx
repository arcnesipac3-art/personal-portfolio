import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Home, ArrowUpToLine } from "lucide-react";
import { navLinks } from "../data/portfolio";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: typeof Home;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

/** The accelerator differs per platform; showing the wrong one is worse than none. */
const SHORTCUT_LABEL =
  typeof navigator !== "undefined" && /Mac|iP(hone|ad|od)/.test(navigator.userAgent)
    ? "⌘ K"
    : "Ctrl+K";

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  useFocusTrap(paletteRef, open);

  const commands: Command[] = [
    ...navLinks.map((link) => ({
      id: link.href,
      label: link.label,
      hint: "Navigate",
      icon: Search,
      action: () => onNavigate(link.href),
    })),
    {
      id: "#top",
      label: "Scroll to Top",
      hint: "Action",
      icon: ArrowUpToLine,
      action: () => onNavigate("#home"),
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[selected];
        if (cmd) {
          cmd.action();
          onClose();
        }
      }
    },
    [filtered, selected, onClose]
  );

  // Focus input + attach keyboard listener when open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  // Reset selected when query changes
  useEffect(() => {
    setSelected(0);
  }, [query]);

  // Lock background scrolling while open, matching the mobile menu and modal.
  // Restores the previous value so overlapping locks don't clobber each other.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-200 flex items-start justify-center pt-[20vh] px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="modal-scrim absolute inset-0 backdrop-blur-md" />

          {/* Palette */}
          <motion.div
            ref={paletteRef}
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-bg-secondary shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search size={16} className="text-text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
                aria-label="Search commands"
                autoComplete="off"
              />
              <kbd className="hidden sm:block rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-text-muted">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-75 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-text-muted">No results found</p>
                </div>
              ) : (
                filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelected(i)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        i === selected
                          ? "bg-blue/10 text-text-primary"
                          : "text-text-muted hover:bg-white/2"
                      }`}
                    >
                      <Icon size={15} className={i === selected ? "text-blue" : "text-text-muted"} />
                      <span className="flex-1 text-sm">{cmd.label}</span>
                      <span className="font-mono text-[10px] text-text-muted">{cmd.hint}</span>
                      {i === selected && (
                        <CornerDownLeft size={13} className="text-blue shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-[10px] text-text-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ArrowUp size={10} />
                  <ArrowDown size={10} />
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft size={10} />
                  Select
                </span>
              </div>
              <span className="font-mono">{SHORTCUT_LABEL}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
