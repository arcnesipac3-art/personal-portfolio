import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Home, ArrowUpToLine } from "lucide-react";
import { navLinks } from "../data/portfolio";

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

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-md" />

          {/* Palette */}
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#0d1421] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search size={16} className="text-slate-500 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
                aria-label="Search commands"
                autoComplete="off"
              />
              <kbd className="hidden sm:block rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-slate-500">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-500">No results found</p>
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
                          ? "bg-blue-500/10 text-slate-100"
                          : "text-slate-400 hover:bg-white/[0.02]"
                      }`}
                    >
                      <Icon size={15} className={i === selected ? "text-blue-400" : "text-slate-500"} />
                      <span className="flex-1 text-sm">{cmd.label}</span>
                      <span className="font-mono text-[10px] text-slate-600">{cmd.hint}</span>
                      {i === selected && (
                        <CornerDownLeft size={13} className="text-blue-400 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-[10px] text-slate-600">
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
              <span className="font-mono">Ctrl+K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
