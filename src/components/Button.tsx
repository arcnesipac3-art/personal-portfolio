import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function Button({
  children,
  href,
  variant = "primary",
  external = false,
  className = "",
  onClick,
  ariaLabel,
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-ring active:scale-[0.97]";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20",
    secondary:
      "border border-white/10 text-slate-200 hover:border-blue-500/50 hover:text-white hover:bg-white/5",
    ghost:
      "text-slate-400 hover:text-white",
  };

  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

/**
 * Animated icon wrapper — moves arrow on hover.
 * Use inside a Button or any link with the `group` class.
 */
export function AnimatedArrow({ children }: { children: ReactNode }) {
  return (
    <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
      {children}
    </span>
  );
}
