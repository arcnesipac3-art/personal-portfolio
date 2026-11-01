import { useEffect, useRef, useState } from "react";
import { useIsDesktop, usePrefersReducedMotion } from "../hooks/useMediaQuery";

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, [role='button'], [data-cursor='pointer']";

/** Ring diameter in px — resting, then while over an interactive element. */
const RING_SIZE = 24;
const RING_SIZE_HOVER = 36;

/**
 * Optional custom cursor for desktop with pointer-fine support.
 * A dot tracks the pointer exactly; a ring trails it with frame-rate
 * independent smoothing.
 * Hides completely on touch devices.
 */
export function CustomCursor() {
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const visibleRef = useRef(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let ringSize = RING_SIZE;
    let lastTime = 0;
    let lastTarget: EventTarget | null = null;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // On first movement, snap the ring in rather than sweeping from the corner.
      if (!visibleRef.current) {
        visibleRef.current = true;
        ringX = mouseX;
        ringY = mouseY;
        setVisible(true);
      }

      // Move dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
      }

      // Re-test only when the pointer enters a different element.
      const target = e.target as HTMLElement;
      if (target !== lastTarget) {
        lastTarget = target;
        const interactive = !!target.closest(INTERACTIVE_SELECTOR);
        if (interactive !== hoveringRef.current) {
          hoveringRef.current = interactive;
          setHovering(interactive);
        }
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    // Trail the pointer. Normalised per frame so the feel is identical on
    // 60Hz and 120Hz displays.
    const animateRing = (now: number) => {
      const delta = lastTime ? Math.min((now - lastTime) / 16.667, 4) : 1;
      lastTime = now;

      const k = 1 - Math.pow(1 - 0.3, delta);
      ringX += (mouseX - ringX) * k;
      ringY += (mouseY - ringY) * k;

      const ring = ringRef.current;
      if (ring) {
        const size = hoveringRef.current ? RING_SIZE_HOVER : RING_SIZE;
        // Only write size on change — a per-frame read/write would force layout.
        if (size !== ringSize) {
          ringSize = size;
          ring.style.width = `${size}px`;
          ring.style.height = `${size}px`;
        }
        // translate(-50%, -50%) self-centres, so the transform never needs the size.
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
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
  }, [isDesktop, prefersReducedMotion]);

  if (!isDesktop || prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden>
      {/* Dot — tracks the pointer exactly */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-blue-400 transition-opacity duration-200 will-change-transform"
        style={{ opacity: visible ? 1 : 0 }}
      />
      {/* Ring — trails the pointer. Its transform is rewritten every frame, so the
          transition must exclude transform or it fights the RAF loop and lags. */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full border will-change-transform"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          opacity: visible ? 1 : 0,
          transition:
            "width 200ms ease, height 200ms ease, opacity 200ms ease, border-color 200ms ease, background-color 200ms ease",
          borderColor: hovering ? "rgba(56, 189, 248, 0.5)" : "rgba(59, 130, 246, 0.3)",
          backgroundColor: hovering ? "rgba(56, 189, 248, 0.05)" : "transparent",
        }}
      />
    </div>
  );
}
