import { useRef, type ReactNode, type MouseEvent } from "react";
import { useIsDesktop, usePrefersReducedMotion } from "../hooks/useMediaQuery";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  href: string;
  onClick?: () => void;
  ariaLabel?: string;
  external?: boolean;
}

/**
 * Wraps content with magnetic pointer attraction on desktop.
 * Falls back to normal behavior on touch / reduced motion.
 */
export function MagneticButton({
  children,
  className = "",
  strength = 0.25,
  href,
  onClick,
  ariaLabel,
  external = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isDesktop || prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`inline-flex transition-transform duration-200 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  );
}
