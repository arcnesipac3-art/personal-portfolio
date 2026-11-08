import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/** Corner registration marks — thin framing brackets at the viewport edges. */
const CORNERS = [
  "left-5 top-5 border-l border-t",
  "right-5 top-5 border-r border-t",
  "left-5 bottom-5 border-l border-b",
  "right-5 bottom-5 border-r border-b",
];

/** Lazier still, so the tilt reads as weight rather than as jitter. */
const DRIFT = { stiffness: 60, damping: 20, mass: 0.6 } as const;

/* Scroll travel, as a percentage of each layer's own height. The layers are
   over-sized by BLEED so the travel stays inside the slack and no edge can
   appear: a 120%-tall layer moving 7% of itself covers 8.4% of the viewport,
   comfortably under the 10% of bleed. */
const BLEED = "inset-[-10%]";
const DRIFT_WASH = "-4%";
const DRIFT_GRID = "-7%";

type Caps = { motionOk: boolean; finePointer: boolean };

/**
 * Read synchronously in the state initializer — Motion's own reduced-motion
 * handling is not enough here, and a post-mount flip would flash the backdrop
 * from static to moving on first paint.
 */
function readCaps(): Caps {
  return {
    motionOk: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    finePointer: window.matchMedia("(pointer: fine)").matches,
  };
}

function useAmbientCaps(): Caps {
  const [caps, setCaps] = useState<Caps>(() =>
    typeof window === "undefined" ? { motionOk: false, finePointer: false } : readCaps()
  );

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => setCaps(readCaps());
    calm.addEventListener("change", update);
    fine.addEventListener("change", update);
    return () => {
      calm.removeEventListener("change", update);
      fine.removeEventListener("change", update);
    };
  }, []);

  return caps;
}

/**
 * Fixed backdrop for the whole page, sitting behind every section at `-z-10`.
 * It lives at the app root rather than inside `<main>`: `main` carries
 * `overflow-x: clip` (see `.no-scroll-x`), which would anchor a `fixed`
 * descendant to the container instead of the viewport.
 *
 * Sections that paint their own band (Projects, Achievements) still sit on top;
 * every other section is transparent and lets this show through, so the wash and
 * the grid read as one continuous surface rather than restarting per section.
 *
 * Layout rule, and the reason an earlier pass stuttered: exactly one animated
 * element per layer, and nothing animated nested inside it. A transform on a
 * child is not a compositor op on the parent — it dirties the parent's paint,
 * so the parent's full-screen texture gets re-rastered every frame. So each
 * layer here is a motion wrapper around a *static* child, which is rastered
 * once and then only translated. For the same reason there is no `scale` (a
 * raster-scale change re-rasterizes).
 *
 * Motion, in two registers:
 *  - On scroll the grid climbs faster than the wash behind it, the wash's top
 *    light dims, and a cooler light rises from the foot of the page, so the
 *    backdrop changes character from hero to contact.
 *  - On fine pointers the wash and grid tilt a few pixels in opposition.
 *
 * Touch devices and reduced-motion users get the static backdrop.
 */
export function PageBackground() {
  const { motionOk, finePointer } = useAmbientCaps();
  const interactive = motionOk && finePointer;

  const { scrollYProgress } = useScroll();
  const washDrift = useTransform(scrollYProgress, [0, 1], ["0%", DRIFT_WASH]);
  const washFade = useTransform(scrollYProgress, [0, 0.6], [1, 0.5]);
  const gridDrift = useTransform(scrollYProgress, [0, 1], ["0%", DRIFT_GRID]);
  const deepFade = useTransform(scrollYProgress, [0.35, 1], [0, 1]);

  const pointerX = useSpring(0, DRIFT);
  const washX = useTransform(pointerX, [-1, 1], [-14, 14]);
  const gridX = useTransform(pointerX, [-1, 1], [9, -9]);

  useEffect(() => {
    if (!interactive) return;

    const onMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, pointerX]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <motion.div
        className={`absolute ${BLEED} will-change-transform`}
        style={motionOk ? { x: washX, y: washDrift, opacity: washFade } : undefined}
      >
        <div className="page-backdrop absolute inset-0" />
      </motion.div>

      <motion.div
        className="page-backdrop-deep absolute inset-0"
        style={motionOk ? { opacity: deepFade } : undefined}
      />

      <motion.div
        className={`absolute ${BLEED} will-change-transform`}
        style={motionOk ? { x: gridX, y: gridDrift } : undefined}
      >
        <div className="page-grid absolute inset-0" />
      </motion.div>

      <div className="page-vignette absolute inset-0" />

      {CORNERS.map((corner) => (
        <span
          key={corner}
          className={`absolute hidden h-6 w-6 border-blue/20 lg:block ${corner}`}
        />
      ))}
    </div>
  );
}
