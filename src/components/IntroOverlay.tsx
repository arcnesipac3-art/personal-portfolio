import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "motion/react";
import { personalInfo } from "../data/portfolio";
import { markIntroSeen, shouldShowIntro } from "../utils/intro";

/** Hold before the exit starts. Any input short-circuits straight to the exit. */
const HOLD_MS = 1300;
const CONTENT_OUT_MS = 260;
const CURTAIN_MS = 620;

type Phase = "hold" | "content" | "curtain" | "done";

const NEXT_PHASE: Record<Exclude<Phase, "done">, Phase> = {
  hold: "content",
  content: "curtain",
  curtain: "done",
};

const PHASE_MS: Record<Exclude<Phase, "done">, number> = {
  hold: HOLD_MS,
  content: CONTENT_OUT_MS,
  curtain: CURTAIN_MS,
};

/** Status lines, written in the same `// comment` style the stack section uses. */
const STATUS_LINES = [
  `// ${personalInfo.role.toLowerCase()}`,
  `// ${personalInfo.school.toLowerCase()}`,
  `// learning ${personalInfo.currentlyLearning.toLowerCase()}`,
];

interface IntroOverlayProps {
  /** Fired as the curtain starts to part, so the page can animate in behind it. */
  onDone: () => void;
}

/**
 * Interactive branded intro: pointer-reactive parallax, a tilting monogram and a
 * progress counter, exiting as a curtain that splits apart to reveal the page.
 *
 * Decorative only — marked aria-hidden so assistive tech reaches the real content
 * immediately, and every input (click, key, wheel, tap) dismisses it at once.
 */
export function IntroOverlay({ onDone }: IntroOverlayProps) {
  const [phase, setPhase] = useState<Phase>(() => (shouldShowIntro() ? "hold" : "done"));

  const rootRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Mark as seen immediately so reloading mid-intro does not replay it.
  useEffect(() => {
    if (phase !== "hold") return;
    markIntroSeen();
  }, [phase]);

  // Advance through the phases on a timer.
  useEffect(() => {
    if (phase === "done") return;
    const timer = window.setTimeout(() => setPhase(NEXT_PHASE[phase]), PHASE_MS[phase]);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Hand off as the curtain opens, so the page animates in behind the reveal
  // rather than being uncovered already settled.
  useEffect(() => {
    if (phase === "curtain") onDone();
  }, [phase, onDone]);

  const skip = useCallback(() => {
    setPhase((current) => (current === "hold" ? "content" : current));
  }, []);

  // Lock scrolling and treat any input during the hold as "skip".
  useEffect(() => {
    if (phase !== "hold") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      // Ignore bare modifiers so Cmd/Ctrl shortcuts still reach the app.
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") return;
      skip();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      skip();
    };
    const onTouch = () => skip();

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [phase, skip]);

  // Drive the counter and progress bar from one rAF loop, writing straight to the
  // DOM so the animation never triggers a React re-render.
  useEffect(() => {
    if (phase !== "hold") return;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / HOLD_MS, 1);
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p})`;
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (phase !== "hold") return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = (x / rect.width - 0.5) * 2;
    const cy = (y / rect.height - 0.5) * 2;

    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(340px circle at ${x}px ${y}px, rgba(40, 120, 240, 0.11), transparent 70%)`;
    }
    // Layers travel at different rates and directions for depth.
    if (gridRef.current) {
      gridRef.current.style.transform = `translate3d(${cx * -7}px, ${cy * -7}px, 0)`;
    }
    if (dotsRef.current) {
      dotsRef.current.style.transform = `translate3d(${cx * 15}px, ${cy * 15}px, 0)`;
    }
    if (monogramRef.current) {
      monogramRef.current.style.transform = `perspective(700px) rotateX(${-cy * 13}deg) rotateY(${cx * 15}deg)`;
    }
  };

  const handlePointerLeave = () => {
    if (spotlightRef.current) spotlightRef.current.style.background = "";
    if (gridRef.current) gridRef.current.style.transform = "";
    if (dotsRef.current) dotsRef.current.style.transform = "";
    if (monogramRef.current) monogramRef.current.style.transform = "";
  };

  if (phase === "done") return null;

  const splitting = phase === "curtain";

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={skip}
      aria-hidden
      className={`fixed inset-0 z-[400] overflow-hidden ${
        splitting ? "pointer-events-none" : "cursor-pointer"
      }`}
    >
      {/* Curtain halves — the solid backdrop, which parts to reveal the page */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: splitting ? "-101%" : 0 }}
        transition={{ duration: CURTAIN_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 top-0 h-1/2 bg-[#080b12]"
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: splitting ? "101%" : 0 }}
        transition={{ duration: CURTAIN_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#080b12]"
      />

      {/* Visual layer — fades out just before the curtain parts */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={phase === "hold" ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
        transition={{ duration: CONTENT_OUT_MS / 1000, ease: "easeIn" }}
        className="absolute inset-0"
      >
        <div ref={gridRef} className="absolute -inset-8 bg-grid opacity-40 will-change-transform" />
        <div ref={spotlightRef} className="absolute inset-0" />

        <div ref={dotsRef} className="absolute -inset-4 will-change-transform">
          <div className="absolute left-[14%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#2878f0]/40" />
          <div className="absolute right-[18%] top-[38%] h-1 w-1 rounded-full bg-[#38bdf8]/50" />
          <div className="absolute left-[22%] bottom-[26%] h-1 w-1 rounded-full bg-[#2878f0]/50" />
          <div className="absolute right-[12%] bottom-[34%] h-1.5 w-1.5 rounded-full bg-[#38bdf8]/40" />
        </div>

        {/* HUD corner brackets */}
        <div className="absolute left-5 top-5 h-5 w-5 border-l border-t border-[#2878f0]/25" />
        <div className="absolute right-5 top-5 h-5 w-5 border-r border-t border-[#2878f0]/25" />
        <div className="absolute bottom-5 left-5 h-5 w-5 border-b border-l border-[#2878f0]/25" />
        <div className="absolute bottom-5 right-5 h-5 w-5 border-b border-r border-[#2878f0]/25" />

        {/* Centre piece */}
        <div className="relative flex h-full flex-col items-center justify-center px-6">
          <div
            ref={monogramRef}
            className="will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-16 w-16 items-center justify-center border border-[#2878f0]/40 bg-[#0e1522] font-mono text-xl font-bold text-[#2878f0] shadow-[0_0_50px_-14px_rgba(40,120,240,0.7)]"
            >
              {personalInfo.monogram}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="mt-5 font-display text-lg font-bold tracking-tight text-[#f4f7fc] sm:text-xl"
          >
            {personalInfo.name}
          </motion.p>

          <div className="mt-3 flex flex-col items-center gap-1">
            {STATUS_LINES.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.4 + i * 0.16 }}
                className="font-mono text-[10px] tracking-wider text-[#66758b]"
              >
                {line}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex items-center gap-3"
          >
            <span
              ref={counterRef}
              className="font-mono text-[10px] tabular-nums text-[#2878f0]"
            >
              000
            </span>
            <div className="h-px w-32 overflow-hidden bg-[#192437]">
              <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-[#2878f0]" />
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="absolute inset-x-0 bottom-10 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#66758b]"
        >
          Click or press any key to skip
        </motion.p>
      </motion.div>
    </div>
  );
}
