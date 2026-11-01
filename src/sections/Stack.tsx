import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { skillsData } from "../data/portfolio";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Travel time for a full pass, and for the shorter jumps. */
const RUN_MS = 2200;
const HOP_MS = 240;

const pad = (n: number) => String(n).padStart(2, "0");

/** Brand marks resolved by name, so the icons live in `skillsData` only. */
const iconByName = new Map(
  skillsData.flatMap((category) =>
    category.technologies.map((tech) => [tech.name, tech.icon] as const)
  )
);

interface Stage {
  label: string;
  /** What the stage actually is, in the words of the project. */
  title: string;
  description: string;
  tech: string[];
}

const STAGES: Stage[] = [
  {
    label: "Client",
    title: "React + TypeScript",
    description:
      "Typed components rendered in the browser, calling the API over fetch and holding no business rules of their own.",
    tech: ["React", "TypeScript"],
  },
  {
    label: "Transport",
    title: "REST API",
    description:
      "JSON over HTTPS — the seam that keeps the interface replaceable without touching the server.",
    tech: ["REST APIs"],
  },
  {
    label: "Application",
    title: "Django + Python",
    description:
      "Views, permissions and role rules, with the ORM mapping Python objects onto rows.",
    tech: ["Django", "Python"],
  },
  {
    label: "Data",
    title: "PostgreSQL",
    description:
      "Requirements, submissions and attendance records kept in one relational schema.",
    tech: ["PostgreSQL"],
  },
  {
    label: "Hosting",
    title: "Vercel + Render",
    description:
      "Frontend and API deployed from the Git repository, with a preview build on every push.",
    tech: ["Vercel", "Render"],
  },
];

const TOTAL = STAGES.length;

/** Stage the packet has reached at path position `t`. */
const stageAt = (t: number) =>
  Math.min(TOTAL - 1, Math.floor(t * (TOTAL - 1) + 0.001));

/**
 * How the stack connects, rather than what is in it.
 *
 * `Skills` already lists every technology with its mark and name, so repeating
 * that inventory here made the two sections read as one. This shows the part
 * `Skills` cannot: the order of the layers and the seams between them.
 *
 * The rail is driven by a packet you can send or drag. Animation is the point
 * rather than decoration here — watching a request walk the five stages is the
 * fastest way to explain what a stack is, and it gives the reader something to
 * do with a section that would otherwise be a paragraph of architecture.
 *
 * Three things keep it honest:
 *   - The packet is moved with `translate3d` from a rAF loop and nothing else,
 *     so a full pass re-lays-out zero times; state changes only when the
 *     packet crosses a node, which is five renders per run.
 *   - Node positions are measured, not computed from the grid, so the same
 *     path works for the vertical rail below `lg` and the horizontal one above.
 *   - Dragging is gated to a fine pointer. On touch the rail sits under the
 *     page's scroll gesture, and a drag that swallows it traps the finger;
 *     there, tapping a stage steps the packet instead.
 */
export function Stack() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const canDrag = useMediaQuery("(hover: hover) and (pointer: fine)") && !reduceMotion;

  const pathRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const points = useRef<{ x: number; y: number }[]>([]);
  const frame = useRef<number | null>(null);
  const dragging = useRef(false);
  /** Where the packet sits, 0 at the client and 1 at hosting. */
  const progress = useRef(0);

  const current = STAGES[active];

  const pointAt = useCallback((t: number) => {
    const pts = points.current;
    if (pts.length < 2) return { x: 0, y: 0 };
    const seg = t * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(seg));
    const f = seg - i;
    const a = pts[i];
    const b = pts[i + 1];
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  }, []);

  /** Transform-only, so driving the packet never dirties a layout. */
  const paint = useCallback(() => {
    const el = packetRef.current;
    if (!el) return;
    const { x, y } = pointAt(progress.current);
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, [pointAt]);

  const measure = useCallback(() => {
    const box = pathRef.current?.getBoundingClientRect();
    if (!box) return;
    points.current = nodeRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    paint();
  }, [paint]);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (pathRef.current) observer.observe(pathRef.current);
    // Webfonts land after first paint and shift every node with them.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [measure]);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    []
  );

  const tween = useCallback(
    (from: number, to: number, duration: number, onDone?: () => void) => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        progress.current = from + (to - from) * t;
        paint();
        // Same value every frame until a node is crossed, so React bails out.
        setActive((prev) => (prev === stageAt(progress.current) ? prev : stageAt(progress.current)));

        if (t < 1) frame.current = requestAnimationFrame(step);
        else {
          frame.current = null;
          onDone?.();
        }
      };

      frame.current = requestAnimationFrame(step);
    },
    [paint]
  );

  const stop = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setRunning(false);
  };

  /**
   * Fly the packet to a path position. `active` is left to the tween, so the
   * stages it crosses light up in turn rather than the highlight teleporting.
   */
  const goto = (targetT: number) => {
    if (reduceMotion || Math.abs(progress.current - targetT) < 0.001) {
      progress.current = targetT;
      paint();
      setActive(stageAt(targetT));
      return;
    }
    tween(progress.current, targetT, HOP_MS);
  };

  /** Park the packet on a node — used by clicks, taps and the arrow keys. */
  const select = (index: number) => {
    stop();
    goto(index / (TOTAL - 1));
  };

  const run = () => {
    if (reduceMotion) {
      progress.current = 1;
      paint();
      setActive(TOTAL - 1);
      return;
    }

    stop();
    setRunning(true);
    // Already parked at hosting: fly back to the client first, so a second
    // press reads as a new request rather than a teleport.
    const send = () => tween(0, 1, RUN_MS, () => setRunning(false));
    if (progress.current > 0.001) tween(progress.current, 0, HOP_MS, send);
    else send();
  };

  const scrubTo = (clientX: number, clientY: number) => {
    const box = pathRef.current?.getBoundingClientRect();
    const pts = points.current;
    if (!box || pts.length < 2) return;

    const px = clientX - box.left;
    const py = clientY - box.top;

    // Closest point on the path, so a drag works whether the rail runs across
    // the page or down it.
    let nearestT = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const lenSq = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / lenSq));
      const distSq = (px - (a.x + dx * t)) ** 2 + (py - (a.y + dy * t)) ** 2;
      if (distSq < nearestDist) {
        nearestDist = distSq;
        nearestT = (i + t) / (pts.length - 1);
      }
    }

    progress.current = nearestT;
    paint();
    setActive((prev) => {
      const next = stageAt(nearestT);
      return prev === next ? prev : next;
    });
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLSpanElement>) => {
    stop();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubTo(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (!dragging.current) return;
    scrubTo(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    // Settle on the nearest node, so the packet is never left between stages.
    goto(Math.round(progress.current * (TOTAL - 1)) / (TOTAL - 1));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      select((active + 1) % TOTAL);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      select((active - 1 + TOTAL) % TOTAL);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0);
    } else if (e.key === "End") {
      e.preventDefault();
      select(TOTAL - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      run();
    }
  };

  return (
    <section
      id="stack"
      className="relative section-padding overflow-x-clip border-y border-white/4 bg-bg/80"
    >
      <div className="absolute inset-0 bg-grid-fine opacity-15" aria-hidden />

      <div className="shell relative z-10">
        <SectionHeading
          number="04"
          label="Technology Stack"
          title="How the pieces connect."
          description="The path a request takes through TRACK — from typed components in the browser down to rows in PostgreSQL, and what hosts each end. Send one through, or drag it along the rail."
        />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
            {pad(active + 1)} <span className="text-text-muted">/</span> {pad(TOTAL)} ·{" "}
            <span className="text-blue">{current.label}</span>
          </p>

          <div className="flex items-center gap-3">
            {/* Otherwise the rail reads as a diagram and neither the keys nor
                the drag are discoverable. */}
            <p
              className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted sm:block"
              aria-hidden
            >
              {canDrag ? "← → step · drag the rail" : "tap a stage"}
            </p>

            {!reduceMotion && (
              <button
                type="button"
                onClick={run}
                className="flex items-center gap-1.5 border border-white/8 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary transition-colors duration-300 hover:border-blue/40 hover:bg-blue/6 hover:text-blue focus-ring"
              >
                <Play size={9} className={running ? "animate-pulse" : undefined} />
                {running ? "In flight" : "Send request"}
              </button>
            )}
          </div>
        </div>

        <div
          ref={pathRef}
          role="group"
          aria-label="Request path — step through the stages with the arrow keys, or press Enter to send a request"
          onKeyDown={handleKeyDown}
          className="relative mt-10"
        >
          <div className="relative border-l border-white/8 pl-6 lg:border-t lg:border-l-0 lg:pt-8 lg:pl-0">
            {/* Leading accent, drawn along whichever axis the rail runs. */}
            <span
              className="absolute top-0 -left-px h-24 w-px bg-linear-to-b from-blue to-transparent lg:hidden"
              aria-hidden
            />
            <span
              className="absolute -top-px left-0 hidden h-px w-24 bg-linear-to-r from-blue to-transparent lg:block"
              aria-hidden
            />

            {/* Drag surface. Declared before the list so the node buttons,
                which come later in tree order, keep their own clicks; it only
                needs to catch the rail itself. */}
            {canDrag && (
              <span
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="absolute top-0 -left-8 h-full w-8 cursor-grab active:cursor-grabbing lg:-top-8 lg:left-0 lg:h-8 lg:w-full"
                aria-hidden
              />
            )}

            <ol className="grid gap-8 lg:grid-cols-5 lg:gap-6">
              {STAGES.map((stage, index) => {
                const isActive = index === active;

                return (
                  <li
                    key={stage.label}
                    // The whole row is the target on touch and for the mouse;
                    // the node stays the real control for keyboard and AT.
                    onClick={() => select(index)}
                    className="group/stage relative cursor-pointer"
                  >
                    <button
                      ref={(el) => {
                        nodeRefs.current[index] = el;
                      }}
                      type="button"
                      onClick={() => select(index)}
                      onFocus={() => select(index)}
                      aria-label={`Stage ${index + 1} of ${TOTAL}: ${stage.label} — ${stage.title}`}
                      aria-current={isActive ? "step" : undefined}
                      className="absolute -top-2.5 -left-10 grid h-8 w-8 place-items-center rounded-full focus-ring lg:-top-13 lg:-left-5 lg:h-10 lg:w-10"
                    >
                      {/* Fires once, as the packet lands. */}
                      {isActive && !reduceMotion && (
                        <motion.span
                          key={active}
                          initial={{ scale: 0.8, opacity: 0.7 }}
                          animate={{ scale: 2.4, opacity: 0 }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className="col-start-1 row-start-1 h-4 w-4 rounded-full border border-blue/60"
                          aria-hidden
                        />
                      )}

                      {isActive &&
                        (reduceMotion ? (
                          <span
                            className="col-start-1 row-start-1 h-4 w-4 rounded-full border border-blue/50 bg-blue/15"
                            aria-hidden
                          />
                        ) : (
                          <motion.span
                            layoutId="stack-stage-node"
                            transition={{ type: "spring", stiffness: 340, damping: 30 }}
                            className="col-start-1 row-start-1 h-4 w-4 rounded-full border border-blue/50 bg-blue/15"
                            aria-hidden
                          />
                        ))}

                      <span
                        className={`col-start-1 row-start-1 h-1.5 w-1.5 rotate-45 transition-colors duration-300 ${
                          isActive
                            ? "bg-blue"
                            : index < active
                              ? "bg-blue/35"
                              : "border border-white/25 group-hover/stage:border-blue/60"
                        }`}
                        aria-hidden
                      />
                    </button>

                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                      transition={{
                        duration: 0.45,
                        delay: reduceMotion ? 0 : index * 0.07,
                        ease: EASE,
                      }}
                    >
                      <div
                        className={`transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-55 group-hover/stage:opacity-90"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[10px] transition-colors duration-300 ${
                              isActive ? "text-blue" : "text-text-muted"
                            }`}
                          >
                            {pad(index + 1)}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                            {stage.label}
                          </span>
                        </div>

                        <h3 className="mt-3 font-display text-[15px] font-semibold tracking-tight text-text-primary">
                          {stage.title}
                        </h3>

                        <p className="mt-2 max-w-[34ch] text-[12.5px] leading-relaxed text-text-muted lg:max-w-none">
                          {stage.description}
                        </p>

                        <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          {stage.tech.map((name) => (
                            <li key={name} className="flex items-center gap-1.5">
                              <img
                                src={iconByName.get(name)}
                                alt=""
                                aria-hidden
                                loading="lazy"
                                decoding="async"
                                className="h-3.5 w-3.5 object-contain opacity-85"
                              />
                              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-secondary">
                                {name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </li>
                );
              })}
            </ol>

            {!reduceMotion && (
              <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
                <div ref={packetRef} className="absolute top-0 left-0 will-change-transform">
                  <span
                    className={`relative block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-blue ${
                      running ? "animate-pulse" : ""
                    }`}
                  >
                    <span className="absolute -inset-1.5 bg-blue/25 blur-[5px]" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* The stage change is otherwise only a shift in weight and colour. */}
        <p className="sr-only" role="status" aria-live="polite">
          Stage {active + 1} of {TOTAL} — {current.label}: {current.title}
        </p>
      </div>
    </section>
  );
}
