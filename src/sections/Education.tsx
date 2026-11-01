import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ArrowDown, BookOpen, GraduationCap, School, type LucideIcon } from "lucide-react";
import { educationData, type EducationEntry } from "../data/portfolio";

const levelIcons: Record<string, LucideIcon> = {
  "Senior High School": GraduationCap,
  "Junior High School": School,
  Elementary: BookOpen,
};

const TOTAL = educationData.length;

/** Viewport-heights of scroll owned by each entry while the section is pinned. */
const STEP_VH = 100;
/** Wheel delta that counts as one deliberate scroll. */
const STEP_THRESHOLD = 20;
/** A gap this long in wheel events means the gesture ended and a new one may step. */
const QUIET_MS = 130;

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Pinning rewrites the page height, which would yank the viewport mid-scroll if
 * the decision were made in an effect. Read it synchronously so the tall
 * container is already there on the first paint.
 */
function usePinnedJourney() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(wide.matches && !calm.matches);
    wide.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}

/** Faint grids, blue lighting and corner marks shared by both layouts. */
function PanelDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1728] via-[#0a1018] to-[#080b12]" />
      <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[#2878f0]/[0.14] blur-[90px]" />
      <div className="absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-[#38bdf8]/[0.07] blur-[100px]" />
      <div className="absolute inset-0 bg-grid-fine opacity-30" />

      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#2878f0]/40 via-[#2878f0]/5 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#2878f0]/40 via-transparent to-transparent" />
      <div className="absolute right-4 top-4 h-8 w-8 border-r border-t border-[#2878f0]/25" />
      <div className="absolute bottom-4 left-4 h-8 w-8 border-b border-l border-[#2878f0]/20" />
      <div className="absolute bottom-6 right-6 h-1.5 w-1.5 rotate-45 bg-[#38bdf8]/30" />
    </div>
  );
}

/** Everything inside an entry panel, without the surrounding animation. */
function EntryBody({ entry, index }: { entry: EducationEntry; index: number }) {
  const Icon = levelIcons[entry.level] ?? School;

  return (
    <>
      <span
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-display text-[6rem] font-bold leading-none text-white/[0.02] lg:text-[7rem]"
        aria-hidden
      >
        {pad(index + 1)}
      </span>

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center border border-[#2878f0]/25 bg-[#0a0f1a]">
            <Icon size={14} className="text-[#2878f0]" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#66758b]">
            {entry.level}
          </span>
          {entry.strand && (
            <span className="border border-[#38bdf8]/25 bg-[#38bdf8]/[0.05] px-2 py-0.5 font-mono text-[10px] text-[#38bdf8]">
              {entry.strand}
            </span>
          )}
        </div>

        <p className="mt-6 font-mono text-[13px] tracking-[0.06em] text-[#2878f0]">
          {entry.years}
        </p>
        <h3 className="mt-2 max-w-xl font-display text-[1.75rem] font-bold leading-[1.08] tracking-tight text-[#f4f7fc] sm:text-4xl lg:text-[2.4rem]">
          {entry.school}
        </h3>
        <p className="mt-3.5 max-w-lg text-[14px] leading-relaxed text-[#8b9ab1] sm:text-[15px]">
          {entry.description}
        </p>

        {entry.highlights.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {entry.highlights.map((highlight) => (
              <li
                key={highlight}
                className="inline-flex items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] text-[#8b9ab1]"
              >
                <span className="h-1 w-1 shrink-0 bg-[#2878f0]/70" aria-hidden />
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/**
 * All entries stacked in a single grid cell, so the panel keeps the height of
 * the tallest one and the deck glides between entries like a filmstrip.
 */
function EntryStage({
  active,
  offset,
  className = "",
}: {
  active: number;
  offset: number;
  className?: string;
}) {
  return (
    <div className={`relative z-10 grid min-w-0 grid-rows-1 ${className}`}>
      {educationData.map((entry, i) => {
        const isActive = i === active;

        return (
          <motion.div
            key={`${entry.school}-${entry.level}-${i}`}
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              // Entries keep their distance from the active one, so the deck
              // travels as a unit and the direction reads for free.
              y: (i - active) * offset,
              scale: isActive ? 1 : 0.97,
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden={!isActive}
            className="relative col-start-1 row-start-1 flex min-h-[280px] min-w-0 flex-col justify-center p-6 will-change-transform sm:p-8 lg:min-h-0 lg:p-10"
          >
            <EntryBody entry={entry} index={i} />
          </motion.div>
        );
      })}
    </div>
  );
}

/** The selected-entry panel: border, decor and the animated entry deck. */
function EntryPanel({ active, offset, className = "" }: { active: number; offset: number; className?: string }) {
  return (
    <div
      id="journey-panel"
      className={`relative overflow-hidden border border-white/[0.07] bg-[#0a0f1a] ${className}`}
    >
      <PanelDecor />
      <EntryStage active={active} offset={offset} className="h-full" />
    </div>
  );
}

/**
 * The timeline doubles as the section's navigation: every row is a real button
 * reachable by Tab, and arrow keys walk the list while Home/End jump to the ends.
 */
function TimelineRail({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;

    const target =
      step !== 0
        ? (index + step + TOTAL) % TOTAL
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? TOTAL - 1
            : -1;

    if (target < 0) return;

    event.preventDefault();
    onSelect(target);
    itemRefs.current[target]?.focus();
  };

  return (
    <nav aria-label="Education timeline" className="min-w-0">
      <div className="relative">
        <span
          className="absolute bottom-8 left-[5px] top-8 w-px bg-gradient-to-b from-[#2878f0]/25 via-white/[0.07] to-transparent"
          aria-hidden
        />

        <ul className="flex flex-col gap-1.5">
          {educationData.map((entry, i) => {
            const isActive = i === active;

            return (
              <li key={`${entry.school}-${entry.level}-${i}`} className="relative pl-6">
                <span
                  className="absolute left-0 top-1/2 flex h-3 w-3 -translate-y-1/2 items-center justify-center"
                  aria-hidden
                >
                  <span
                    className={`h-1.5 w-1.5 rotate-45 transition-[background-color,box-shadow] duration-300 ${
                      isActive
                        ? "bg-[#38bdf8] shadow-[0_0_10px_2px_rgba(56,189,248,0.45)]"
                        : "bg-[#243049]"
                    }`}
                  />
                </span>

                <button
                  ref={(node) => {
                    itemRefs.current[i] = node;
                  }}
                  type="button"
                  onClick={() => onSelect(i)}
                  onKeyDown={(event) => moveFocus(event, i)}
                  aria-current={isActive ? "step" : undefined}
                  aria-controls="journey-panel"
                  title={entry.school}
                  className={`relative isolate block w-full cursor-pointer overflow-hidden border px-3.5 py-3 text-left transition-colors duration-300 lg:py-2.5 ${
                    isActive
                      ? "border-[#2878f0]/45 bg-[#2878f0]/[0.07]"
                      : "border-white/[0.06] bg-[#0d1220]/25 hover:border-white/[0.14] hover:bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-px bg-[#2878f0] transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden
                  />

                  <span className="flex items-center justify-between gap-3">
                    <span
                      className={`font-mono text-[10px] tabular-nums transition-colors duration-300 ${
                        isActive ? "text-[#38bdf8]" : "text-[#4a5768]"
                      }`}
                    >
                      {entry.years}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] transition-opacity duration-300 ${
                        isActive ? "text-[#2878f0] opacity-100" : "opacity-0"
                      }`}
                    >
                      Active
                    </span>
                  </span>

                  <span
                    className={`mt-1.5 block truncate font-display text-[14px] tracking-tight transition-colors duration-300 ${
                      isActive ? "font-semibold text-[#f4f7fc]" : "font-medium text-[#8b9ab1]"
                    }`}
                  >
                    {entry.school}
                  </span>

                  <span
                    className={`mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-300 ${
                      isActive ? "text-[#66758b]" : "text-[#3d4a5c]"
                    }`}
                  >
                    {entry.level}
                    {entry.strand ? ` · ${entry.strand}` : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/** Section label, heading, supporting line and the live entry counter. */
function JourneyHeader({ active }: { active: number }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-5 sm:gap-8">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-[#66758b]">05</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#66758b]">
            Journey
          </span>
        </div>

        <h2 className="mt-5 font-display text-3xl font-bold leading-[1.08] tracking-tight text-[#f4f7fc] sm:text-4xl md:text-[2.6rem]">
          Keep building.
        </h2>

        <p className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-[#66758b] sm:text-base">
          A journey of learning, competing, and growing — one step at a time.
        </p>

        <span
          className="mt-5 block h-px w-20 bg-gradient-to-r from-[#2878f0] via-[#2878f0]/50 to-transparent"
          aria-hidden
        />
      </div>

      <div className="shrink-0 text-right" role="status" aria-live="polite">
        <p className="font-mono text-[26px] leading-none tabular-nums text-[#2878f0] sm:text-[32px] lg:text-[40px]">
          {pad(active + 1)}
          <span className="text-[#233149]">/{pad(TOTAL)}</span>
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a5768]">
          Entry
        </p>
      </div>
    </div>
  );
}

/** Thin progress line, blue segment, downward arrow and the travel label. */
function JourneyProgress({ active }: { active: number }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="mt-6 flex shrink-0 items-center gap-4">
      <div className="relative h-px flex-1 bg-white/[0.07]">
        <motion.span
          initial={false}
          animate={{ scaleX: (active + 1) / TOTAL }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 origin-left bg-[#2878f0]"
        />
      </div>

      <span className="flex shrink-0 items-center gap-2">
        <motion.span
          aria-hidden
          animate={reduceMotion ? undefined : { y: [0, 3, 0] }}
          transition={
            reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <ArrowDown size={12} className="text-[#2878f0]" />
        </motion.span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a5768]">
          Scroll to travel
        </span>
      </span>
    </div>
  );
}

/** Click-driven layout for narrow viewports and reduced-motion users. */
function StaticJourney() {
  const [active, setActive] = useState(0);

  return (
    <section id="journey" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <JourneyHeader active={active} />

        <div className="mt-8 grid gap-5 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-7">
            <EntryPanel active={active} offset={20} />
          </div>

          <div className="md:col-span-5">
            <TimelineRail active={active} onSelect={setActive} />
          </div>
        </div>

        <JourneyProgress active={active} />
      </div>
    </section>
  );
}

/**
 * Scroll-pinned story: the section sticks to the viewport and the timeline
 * walks one entry per scroll gesture, then releases to the next section.
 *
 * A raw wheel is left to move the page freely; here one gesture is coalesced
 * into exactly one entry so a single flick never skips two.
 */
function PinnedJourney() {
  const containerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(Math.floor(progress * TOTAL), TOTAL - 1);
    setActive((previous) => (previous === next ? previous : next));
  });

  /** Centre of the scroll slice that shows the given entry. */
  const goTo = useCallback((index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: Math.max(top + (range * (index + 0.5)) / TOTAL, 0),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let accumulated = 0;
    let armed = true;
    let quietTimer = 0;

    const onWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      // Only own the scroll while the section actually fills the viewport.
      if (rect.top > 1 || rect.bottom < window.innerHeight - 1) return;

      const range = el.offsetHeight - window.innerHeight;
      const index = Math.min(Math.max(Math.floor((-rect.top / range) * TOTAL), 0), TOTAL - 1);
      const direction = e.deltaY > 0 ? 1 : -1;

      // At either end, hand the scroll back so the page leaves the section.
      if ((direction === -1 && index === 0) || (direction === 1 && index === TOTAL - 1)) {
        return;
      }

      e.preventDefault();

      // Wheel events keep arriving for the whole gesture, so a quiet gap — not a
      // timer — is what marks the end of one and re-arms the next step.
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(() => {
        accumulated = 0;
        armed = true;
      }, QUIET_MS);

      if (!armed) return;

      accumulated += e.deltaY;
      if (Math.abs(accumulated) < STEP_THRESHOLD) return;

      accumulated = 0;
      armed = false;
      goTo(index + direction);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(quietTimer);
    };
  }, [goTo, containerRef]);

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative"
      style={{ height: `calc(100vh + ${TOTAL * STEP_VH}vh)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2878f0]/30 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-5 pt-24 pb-8 sm:px-6 lg:px-8">
          <JourneyHeader active={active} />

          <div className="mt-6 grid min-h-0 flex-1 gap-6 lg:grid-cols-12 lg:grid-rows-1 lg:gap-10">
            <EntryPanel active={active} offset={46} className="min-h-0 lg:col-span-7" />

            <div className="flex min-h-0 flex-col justify-center lg:col-span-5">
              <TimelineRail active={active} onSelect={goTo} />
            </div>
          </div>

          <JourneyProgress active={active} />
        </div>
      </div>
    </section>
  );
}

export function Education() {
  const pinned = usePinnedJourney();
  return pinned ? <PinnedJourney /> : <StaticJourney />;
}
