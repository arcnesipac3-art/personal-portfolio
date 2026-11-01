import { useEffect, useRef, useState } from "react";
import { useIsDesktop, usePrefersReducedMotion } from "../hooks/useMediaQuery";

/**
 * Optional custom cursor for desktop with pointer-fine support.
 * Renders a dot + ring that follow the mouse smoothly.
 * Hides completely on touch devices.
 */
export function CustomCursor() {
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      // Move dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      }

      // Detect hover over interactive elements
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, textarea, [role='button'], [data-cursor='pointer']");
      setHovering(!!interactive);
    };

    const onLeave = () => setVisible(false);

    // Smooth ring follow with lerp
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        const size = hovering ? 36 : 24;
        ringRef.current.style.transform = `translate(${ringX - size / 2}px, ${ringY - size / 2}px)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isDesktop, prefersReducedMotion, hovering]);

  if (!isDesktop || prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-blue-400 transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full border border-blue-400/40 transition-all duration-200"
        style={{
          opacity: visible ? 1 : 0,
          borderColor: hovering ? "rgba(56, 189, 248, 0.5)" : "rgba(59, 130, 246, 0.3)",
          backgroundColor: hovering ? "rgba(56, 189, 248, 0.05)" : "transparent",
        }}
      />
    </div>
  );
}
