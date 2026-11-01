import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/** Corner registration marks — thin framing brackets at the viewport edges. */
const CORNERS = [
  "left-5 top-5 border-l border-t",
  "right-5 top-5 border-r border-t",
  "left-5 bottom-5 border-l border-b",
  "right-5 bottom-5 border-r border-b",
];

/** Diameter of the soft light that trails the cursor. */
const SPOTLIGHT = 720;
/** Slow, viscous follow — the light should lag the cursor, not stick to it. */
const FOLLOW = { stiffness: 90, damping: 22, mass: 0.7 } as const;
/** Even lazier spring for the parallax offset, so layers feel weighty. */
const DRIFT = { stiffness: 60, damping: 20, mass: 0.6 } as const;
/** Percent of the layer's own (over-sized) height the scroll drift covers.
 *  Must stay under the 8% bleed the layers are given, or an edge shows. */
const DRIFT_WASH = "-3%";
const DRIFT_GRID = "-6%";

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

const initialSpot = (axis: "x" | "y") =>
  typeof window === "undefined" ? 0 : axis === "x" ? window.innerWidth / 2 : window.innerHeight * 0.42;

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
 * Motion: the wash and the grid drift upward at different rates as the page
 * scrolls, and tilt a few pixels against the cursor, with a soft light trailing
 * it. Everything is `transform`-only on absolutely positioned layers — no
 * layout, no React re-render per frame. Touch devices and reduced-motion users
 * get the static backdrop.
 */
export function PageBackground() {
  const { motionOk, finePointer } = useAmbientCaps();
  const interactive = motionOk && finePointer;

  const { scrollYProgress } = useScroll();
  const washDrift = useTransform(scrollYProgress, [0, 1], ["0%", DRIFT_WASH]);
  const gridDrift = useTransform(scrollYProgress, [0, 1], ["0%", DRIFT_GRID]);

  const pointerX = useSpring(0, DRIFT);
  const pointerY = useSpring(0, DRIFT);
  const washX = useTransform(pointerX, [-1, 1], [-14, 14]);
  const washY = useTransform(pointerY, [-1, 1], [-9, 9]);
  const gridX = useTransform(pointerX, [-1, 1], [9, -9]);
  const gridY = useTransform(pointerY, [-1, 1], [6, -6]);

  const spotX = useSpring(initialSpot("x"), FOLLOW);
  const spotY = useSpring(initialSpot("y"), FOLLOW);

  useEffect(() => {
    if (!interactive) return;

    const onMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
      spotX.set(event.clientX);
      spotY.set(event.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, pointerX, pointerY, spotX, spotY]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* 8% of bleed on every side gives the drift somewhere to travel. */}
      <motion.div
        className="absolute -inset-[8%]"
        style={motionOk ? { y: washDrift } : undefined}
      >
        <motion.div
          className="page-backdrop absolute inset-0 will-change-transform"
          style={interactive ? { x: washX, y: washY } : undefined}
        />
      </motion.div>

      {interactive && (
        <motion.div
          className="absolute rounded-full bg-[#2878f0]/[0.055] blur-[140px] will-change-transform"
          style={{
            x: spotX,
            y: spotY,
            left: -SPOTLIGHT / 2,
            top: -SPOTLIGHT / 2,
            width: SPOTLIGHT,
            height: SPOTLIGHT,
          }}
        />
      )}

      <motion.div
        className="absolute -inset-[8%]"
        style={motionOk ? { y: gridDrift } : undefined}
      >
        <motion.div
          className="page-grid absolute inset-0 will-change-transform"
          style={interactive ? { x: gridX, y: gridY } : undefined}
        />
      </motion.div>

      <div className="page-vignette absolute inset-0" />

      {CORNERS.map((corner) => (
        <span
          key={corner}
          className={`absolute hidden h-6 w-6 border-[#2878f0]/20 lg:block ${corner}`}
        />
      ))}
    </div>
  );
}
