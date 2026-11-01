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
      "bg-blue text-on-accent hover:bg-blue/85 hover:shadow-lg hover:shadow-blue/20",
    secondary:
      "border border-border-strong text-text-secondary hover:border-blue/50 hover:text-text-primary hover:bg-white/5",
    ghost:
      "text-text-muted hover:text-text-primary",
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
