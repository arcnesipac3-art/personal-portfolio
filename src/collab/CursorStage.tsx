import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AGENTS, ENTRY_POINTS, type AgentId } from "./agents";
import {
  scanBlueprint,
  type Blueprint,
  type BuildUnit,
  type UnitAction,
  type UnitEl,
} from "./blueprint";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import "./collab.css";

/* ── Rebuild director ──────────────────────────────────────────────────────
   One requestAnimationFrame loop drives everything: it reads live rects for
   every build unit, fast-forwards anything scrolled out of reach, lets idle
   cursors claim work, advances each reveal, and only then writes transforms.
   Layout reads are batched before any write, so the page reflows once per
   frame at most and never re-renders while the swarm moves. */

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

/** Spring constants: ~0.6s to settle with a hint of overshoot. */
const STIFFNESS = 52;
const DAMPING = 11.5;

/** Cursor waits: swarm waits for the intro, reveal waits for the cursor. */
const LEAD_MS = 700;
const ARRIVE_PX = 26;
const FORCE_ARM_MS = 2200;

/**
 * Chip placement per agent, relative to its pointer. Two collaborators often
 * work on adjacent lines, and a single shared offset stacks their labels on
 * top of each other; splitting them above/below keeps both readable.
 */
const CHIP_OFFSETS: Record<AgentId, { dx: number; dy: number }> = {
  designer: { dx: 14, dy: 16 },
  writer: { dx: 14, dy: -28 },
  developer: { dx: 14, dy: 44 },
  editor: { dx: 14, dy: -58 },
};

/** Where a cursor sits for a given action, in viewport coordinates. */
function pointFor(action: UnitAction, rect: DOMRect, p: number): { x: number; y: number } {
  switch (action) {
    case "type": {
      const cy = rect.top + Math.min(rect.height * 0.5, 22);
      const cx = rect.left + 3 + p * Math.max(rect.width - 6, 0);
      return { x: cx + 4, y: cy - 6 };
    }
    case "resize":
      return { x: rect.right - 4, y: rect.bottom - 4 };
    case "arrange":
      return {
        x: rect.left + Math.min(rect.width * 0.16, 38),
        y: rect.top + Math.min(rect.height * 0.5, 26),
      };
    case "click":
      return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 };
    default:
      return { x: rect.left + 4, y: rect.top + Math.min(rect.height * 0.5, 18) };
  }
}

interface AgentMotion {
  x: number;
  y: number;
  /** Spring offset from the live anchor point. */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  baseDirty: boolean;
  chipA: number;
  /** The unit this cursor is currently rebuilding. */
  task: BuildUnit | null;
}

/** What React renders: a construction frame per unit in flight. */
interface RenderedBox {
  key: string;
  id: number;
  agent: AgentId;
  action: UnitAction;
  /** Chip copy while this unit is in flight. */
  label: string;
}

interface BoxEntry {
  el: HTMLElement;
  tint: HTMLElement | null;
  caret: HTMLElement | null;
  unitId: number;
  action: UnitAction;
  w: number;
  h: number;
}

interface CursorStageProps {
  /** Held false while the intro curtain is up; the swarm waits for `onDone`. */
  enabled: boolean;
  /** Freezes the active clock: cursors hold, reveals hold. */
  paused: boolean;
  /** Auto-scrolls the page while the swarm reconstructs. */
  tour: boolean;
  /** Fired when the tour reaches the page end or the visitor takes over. */
  onTourEnd: () => void;
}

function createMotions(): Record<AgentId, AgentMotion> {
  const seed = {} as Record<AgentId, AgentMotion>;
  for (const agent of AGENTS) {
    seed[agent.id] = {
      x: -80,
      y: -80,
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      baseX: -80,
      baseY: -80,
      baseDirty: false,
      chipA: 0,
      task: null,
    };
  }
  return seed;
}

/**
 * The swarm reconstruction stage.
 *
 * Decorative by contract: `aria-hidden`, never accepts pointer events. The
 * portfolio underneath is the real DOM — hidden only behind `clip-path`
 * reveals that this loop opens as the cursors work. Removing the stage
 * (Go Live / Replay / unmount) strips every attribute and restores the
 * page's full interactivity.
 */
export function CursorStage({
  enabled,
  paused,
  tour,
  onTourEnd,
}: CursorStageProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [rendered, setRendered] = useState<RenderedBox[]>([]);

  const bpRef = useRef<Blueprint | null>(null);
  const enabledRef = useRef(enabled);
  const pausedRef = useRef(paused);
  const tourRef = useRef(tour);
  const onTourEndRef = useRef(onTourEnd);
  const enabledAtRef = useRef(0);
  const disabledSinceRef = useRef<number | null>(null);
  const clockRef = useRef(0);
  const alphaRef = useRef(0);
  const dialogRef = useRef(false);
  const genRef = useRef(0);
  const renderedRef = useRef<RenderedBox[]>([]);
  const renderKeyRef = useRef("");
  const boxRefs = useRef(new Map<string, BoxEntry>());
  const chipSizeRef = useRef(new Map<AgentId, { w: number; h: number }>());

  const cursorRefs = useRef<Partial<Record<AgentId, HTMLDivElement | null>>>({});
  const chipRefs = useRef<Partial<Record<AgentId, HTMLDivElement | null>>>({});
  // Created once, mutated by the animation loop, never re-rendered. A ref
  // rather than state: the loop writes it every frame and React must never
  // see a new value.
  const motionsRef = useRef<Record<AgentId, AgentMotion>>(createMotions());

  useEffect(() => {
    enabledRef.current = enabled;
    if (enabled) enabledAtRef.current = performance.now();
    else if (disabledSinceRef.current === null) disabledSinceRef.current = performance.now();
  }, [enabled]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    tourRef.current = tour;
  }, [tour]);

  useEffect(() => {
    onTourEndRef.current = onTourEnd;
  }, [onTourEnd]);

  // Chip boxes are measured whenever the label set changes, so each chip can
  // be clamped inside the viewport instead of overflowing an edge.
  useEffect(() => {
    for (const agent of AGENTS) {
      const el = chipRefs.current[agent.id];
      if (el) chipSizeRef.current.set(agent.id, { w: el.offsetWidth, h: el.offsetHeight });
    }
  }, [rendered]);

  // Scan + hide in a layout effect so the page never paints fully visible and
  // then snaps blank. Reduced motion is checked synchronously here — the hook
  // only syncs after its own effect, which would be one paint too late.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bp = scanBlueprint(null);
    bpRef.current = bp;
    return () => {
      bp.teardown();
      if (bpRef.current === bp) bpRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!bpRef.current) return;
    const motions = motionsRef.current;

    let raf = 0;
    let last = 0;
    let lastDialog = 0;
    let lastTourAcc = 0;
    let rescanTimer: number | null = null;
    let lastWidth = window.innerWidth;
    let stopped = false;

    const commitRendered = (list: RenderedBox[]) => {
      const key = list.map((box) => box.key).join("|");
      if (key === renderKeyRef.current) return;
      renderKeyRef.current = key;
      renderedRef.current = list;
      setRendered(list);
    };

    /** Hard stop: reveal everything, remove every trace, end the loop. */
    const stop = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(raf);
      bpRef.current?.teardown();
      bpRef.current = null;
      boxRefs.current.clear();
      commitRendered([]);
    };

    /** Re-plan after a breakpoint change, keeping completed work completed. */
    const doRescan = () => {
      const prev = bpRef.current;
      if (!prev || stopped) return;
      genRef.current++;
      bpRef.current = scanBlueprint(prev);
      boxRefs.current.clear();
      for (const agent of AGENTS) {
        motions[agent.id].task = null;
        motions[agent.id].baseDirty = true;
      }
      commitRendered([]);
    };

    const onResize = () => {
      const width = window.innerWidth;
      if (Math.abs(width - lastWidth) <= 40) return;
      lastWidth = width;
      if (rescanTimer !== null) clearTimeout(rescanTimer);
      rescanTimer = window.setTimeout(() => {
        rescanTimer = null;
        doRescan();
      }, 250);
    };

    const cancelTour = (event: Event) => {
      if (!tourRef.current) return;
      // Any interaction with the control pill is the visitor operating the
      // playback UI, not taking over the scroll — and one click arrives as
      // pointerdown *and* mousedown *and* click, so guarding only the first
      // would let the later ones cancel the tour they were meant to control.
      const target = event.target;
      if (target instanceof Element && target.closest("[data-rebuild-controls]")) {
        return;
      }
      onTourEndRef.current();
    };

    /**
     * Accessibility failsafe: keyboard focus must never land on clipped
     * content. Reveal the focused unit and every ancestor unit instantly.
     */
    const onFocusIn = (event: FocusEvent) => {
      const bp = bpRef.current;
      if (!bp || stopped) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      let el: Element | null = target;
      while (el) {
        const unit = bp.unitByEl.get(el as UnitEl);
        if (unit) {
          let chain: BuildUnit | null = unit;
          while (chain) {
            if (chain.state !== "built") bp.markBuilt(chain);
            chain = chain.parent;
          }
          break;
        }
        el = el.parentElement;
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("load", doRescan);
    window.addEventListener("wheel", cancelTour, { passive: true });
    window.addEventListener("touchstart", cancelTour, { passive: true });
    window.addEventListener("pointerdown", cancelTour, { passive: true });
    window.addEventListener("keydown", cancelTour);
    document.addEventListener("focusin", onFocusIn);
    const reduceMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => {
      if (reduceMql.matches) stop();
    };
    reduceMql.addEventListener("change", onReduce);

    const syncRendered = (bp: Blueprint) => {
      const list: RenderedBox[] = [];
      for (const unit of bp.units) {
        if (unit.state === "building" && unit.claimedBy) {
          list.push({
            key: `${genRef.current}-${unit.id}`,
            id: unit.id,
            agent: unit.claimedBy,
            action: unit.action,
            label: unit.label,
          });
        }
      }
      commitRendered(list);
    };

    const snapAll = (vw: number, vh: number) => {
      for (const agent of AGENTS) {
        const point = ENTRY_POINTS[agent.id](vw, vh);
        const motion = motions[agent.id];
        motion.x = point.x;
        motion.y = point.y;
        motion.ox = 0;
        motion.oy = 0;
        motion.vx = 0;
        motion.vy = 0;
        motion.baseX = point.x;
        motion.baseY = point.y;
        motion.baseDirty = false;
        motion.task = null;
      }
    };

    const frame = (now: number) => {
      const dt = last ? clamp((now - last) / 1000, 0.001, 0.05) : 0.016;
      last = now;

      const bp = bpRef.current;
      if (!bp || stopped) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const compact = vw < 768;
      const leadOk = now - enabledAtRef.current > LEAD_MS;

      if (now - lastDialog > 450) {
        lastDialog = now;
        dialogRef.current = !!document.querySelector("[role='dialog'][aria-modal='true']");
      }

      // ── Watchdog ────────────────────────────────────────────────────────
      // If the intro never reports done and is no longer on screen, never
      // leave the visitor on a blank page.
      if (!enabledRef.current) {
        if (disabledSinceRef.current === null) disabledSinceRef.current = now;
        if (
          now - disabledSinceRef.current > 6000 &&
          !document.querySelector(".z-400") &&
          !bp.allBuilt()
        ) {
          bp.revealAll();
        }
      } else {
        disabledSinceRef.current = null;
      }

      const running =
        enabledRef.current && !pausedRef.current && !dialogRef.current && leadOk;

      // ── Reads ───────────────────────────────────────────────────────────
      const rects = new Map<number, DOMRect>();
      for (const unit of bp.units) {
        rects.set(unit.id, unit.el.getBoundingClientRect());
      }

      const bandTop = window.scrollY <= 1 ? 0 : vh * 0.16;
      // At the very bottom of the page nothing can scroll further, so the
      // band must close at the viewport edge — otherwise units in the last
      // slice of screen could never enter the band and would stay hidden.
      const atBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
      const bandBottom = atBottom ? vh : vh * 0.86;
      let changed = false;

      // ── Fast-forward: anything scrolled above the band is finished ──────
      // Pre-order, so containers settle before their children and no unit can
      // be stranded waiting on a parent the visitor already scrolled past.
      for (const unit of bp.units) {
        if (unit.state === "built") continue;
        const rect = rects.get(unit.id)!;
        const gone = rect.bottom <= bandTop;
        const empty = rect.width === 0 && rect.height === 0;
        if (unit.state === "pending" && (gone || empty)) {
          bp.markBuilt(unit);
          changed = true;
        } else if (unit.state === "building" && (gone || empty)) {
          bp.markBuilt(unit);
          if (unit.claimedBy && motions[unit.claimedBy].task === unit) {
            motions[unit.claimedBy].task = null;
            motions[unit.claimedBy].baseDirty = true;
          }
          changed = true;
        }
      }

      // ── Claims: idle cursors take the next in-band unit in DOM order ────
      if (running && !bp.allBuilt()) {
        const idle = AGENTS.filter((agent) => !motions[agent.id].task);
        if (idle.length > 0) {
          let runningCount = AGENTS.length - idle.length;
          for (const agent of idle) {
            // Small screens run two collaborators at a time: one alone
            // leaves a section blank for seconds, four crowd a phone measure.
            if (compact && runningCount > 1) break;

            let candidate: BuildUnit | null = null;
            for (const unit of bp.units) {
              if (unit.state !== "pending") continue;
              if (unit.parent && unit.parent.state !== "built") continue;
              const rect = rects.get(unit.id)!;
              if (rect.bottom <= bandTop || rect.top >= bandBottom) continue;
              candidate = unit;
              break;
            }
            if (!candidate) break;

            bp.claim(candidate, agent.id, clockRef.current);
            const motion = motions[agent.id];
            motion.task = candidate;
            motion.baseDirty = true;
            runningCount++;
            changed = true;
          }
        }
      }

      if (running) clockRef.current += dt * 1000;
      const clock = clockRef.current;

      // ── Anchors ─────────────────────────────────────────────────────────
      // Working cursors track their unit; idle cursors drift to the next
      // pending unit (or an off-screen entry point when there is no work in
      // reach), so nobody floats over finished sections.
      const anchors = new Map<AgentId, { x: number; y: number }>();
      let nextPending: BuildUnit | null = null;
      if (!bp.allBuilt()) {
        for (const unit of bp.units) {
          if (unit.state !== "pending") continue;
          if (unit.parent && unit.parent.state !== "built") continue;
          const rect = rects.get(unit.id)!;
          if (rect.bottom <= bandTop || rect.top >= bandBottom) continue;
          nextPending = unit;
          break;
        }
      }

      for (const agent of AGENTS) {
        const motion = motions[agent.id];
        if (motion.task && motion.task.state === "building") {
          const rect = rects.get(motion.task.id)!;
          anchors.set(agent.id, pointFor(motion.task.action, rect, motion.task.p));
        } else {
          if (motion.task) {
            motion.task = null;
            motion.baseDirty = true;
          }
          if (nextPending) {
            const rect = rects.get(nextPending.id)!;
            anchors.set(agent.id, pointFor(nextPending.action, rect, 0));
          } else {
            anchors.set(agent.id, ENTRY_POINTS[agent.id](vw, vh));
          }
        }
      }

      // ── Springs ─────────────────────────────────────────────────────────
      for (const agent of AGENTS) {
        const motion = motions[agent.id];
        const anchor = anchors.get(agent.id)!;
        if (motion.baseDirty) {
          motion.ox = motion.x - anchor.x;
          motion.oy = motion.y - anchor.y;
          motion.vx = 0;
          motion.vy = 0;
          motion.baseDirty = false;
        }
        motion.baseX = anchor.x;
        motion.baseY = anchor.y;

        motion.vx += (-motion.ox * STIFFNESS - motion.vx * DAMPING) * dt;
        motion.vy += (-motion.oy * STIFFNESS - motion.vy * DAMPING) * dt;
        motion.ox += motion.vx * dt;
        motion.oy += motion.vy * dt;
        motion.x = motion.baseX + motion.ox;
        motion.y = motion.baseY + motion.oy;
      }

      // ── Arrival, arming and reveal progress ─────────────────────────────
      // A reveal only opens once its cursor is in place (or after a grace
      // period, so a stray spring can never strand a unit half-hidden).
      for (const agent of AGENTS) {
        const motion = motions[agent.id];
        const unit = motion.task;
        if (!unit || unit.state !== "building") continue;
        const rect = rects.get(unit.id)!;

        if (unit.armAt === null && running) {
          const point = pointFor(unit.action, rect, unit.p);
          const dist = Math.hypot(motion.x - point.x, motion.y - point.y);
          if (dist < ARRIVE_PX || clock - unit.t0 > FORCE_ARM_MS) {
            unit.armAt = clock;
          }
        }

        if (unit.armAt !== null && running) {
          const raw = clamp((clock - unit.armAt) / unit.duration, 0, 1);
          bp.progress(unit, raw);
          if (raw >= 1) {
            bp.markBuilt(unit);
            motion.task = null;
            motion.baseDirty = true;
            changed = true;
          }
        }
      }

      // ── Fade ────────────────────────────────────────────────────────────
      const alphaTarget = enabledRef.current && !bp.allBuilt() ? 1 : 0;
      const fade = 1 - Math.exp(-dt / 0.1);
      alphaRef.current += (alphaTarget - alphaRef.current) * fade;
      const alpha = alphaRef.current;

      // ── Writes ──────────────────────────────────────────────────────────
      for (const agent of AGENTS) {
        const motion = motions[agent.id];
        const cursor = cursorRefs.current[agent.id];
        const chip = chipRefs.current[agent.id];
        if (!cursor || !chip) continue;

        let press = 1;
        const task = motion.task;
        if (task && task.action === "click" && task.armAt !== null) {
          const p = clamp((clock - task.armAt) / task.duration, 0, 1);
          if (p > 0.1 && p < 0.42) press = 1 - 0.22 * Math.sin(Math.PI * ((p - 0.1) / 0.32));
        }

        cursor.style.transform = `translate3d(${motion.x}px, ${motion.y}px, 0) scale(${press})`;
        cursor.style.opacity = alpha.toFixed(3);

        const onScreen =
          motion.x > -8 && motion.x < vw + 8 && motion.y > -8 && motion.y < vh + 8;
        const chipTarget = alpha * (onScreen ? 1 : 0);
        motion.chipA += (chipTarget - motion.chipA) * fade;
        const size = chipSizeRef.current.get(agent.id) ?? { w: 90, h: 18 };
        const off = CHIP_OFFSETS[agent.id];
        const chipX = clamp(motion.x + off.dx, 6, Math.max(6, vw - size.w - 6));
        const chipY = clamp(motion.y + off.dy, 6, Math.max(6, vh - size.h - 6));
        chip.style.transform = `translate3d(${chipX}px, ${chipY}px, 0)`;
        chip.style.opacity = motion.chipA.toFixed(3);
      }

      for (const entry of boxRefs.current.values()) {
        const unit = bp.units[entry.unitId];
        const rect = rects.get(entry.unitId);
        if (!unit || !rect) continue;
        // Frames over units larger than half the screen only add noise.
        const huge = rect.width * rect.height > vw * vh * 0.5;
        entry.el.style.opacity = unit.state === "building" && !huge ? "" : "0";

        const pad = 2;
        let x = rect.left - pad;
        let y = rect.top - pad;
        let scale = 1;
        const p = unit.armAt !== null ? clamp((clock - unit.armAt) / unit.duration, 0, 1) : 0;

        if (entry.action === "arrange") {
          const e = easeOut(p);
          x += -9 * (1 - e);
          y += -6 * (1 - e);
        } else if (entry.action === "resize") {
          scale = 0.955 + 0.045 * easeOut(clamp(p / 0.7, 0, 1));
        }

        entry.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

        const w = rect.width + pad * 2;
        const h = rect.height + pad * 2;
        if (Math.abs(entry.w - w) > 0.5 || Math.abs(entry.h - h) > 0.5) {
          entry.w = w;
          entry.h = h;
          entry.el.style.width = `${w}px`;
          entry.el.style.height = `${h}px`;
        }

        if (entry.tint) {
          const wipe =
            entry.action === "type"
              ? clamp(p / 0.75, 0, 1)
              : easeOut(clamp(p / 0.4, 0, 1));
          entry.tint.style.transform = `scaleX(${wipe})`;
        }
        if (entry.caret && entry.action === "type") {
          const cx = pad * 2 + p * rect.width;
          const cy = Math.min(rect.height * 0.5, 22) - 5.5;
          entry.caret.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        }
      }

      if (changed) syncRendered(bp);

      // ── Auto tour ───────────────────────────────────────────────────────
      if (tourRef.current && running) {
        const speed = compact ? 180 : 260;
        lastTourAcc += speed * dt;
        if (lastTourAcc >= 1) {
          const dy = Math.floor(lastTourAcc);
          lastTourAcc -= dy;
          const atEnd =
            window.scrollY + vh >= document.documentElement.scrollHeight - 2;
          if (atEnd) {
            onTourEndRef.current();
          } else {
            // Instant: `html` has `scroll-behavior: smooth`, and a smoothed
            // scrollBy re-animates from the previous target every frame, so
            // the tour would crawl at a fraction of `speed`.
            window.scrollBy({ top: dy, behavior: "instant" });
          }
        }
      } else {
        lastTourAcc = 0;
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      try {
        frame(now);
      } catch {
        // A throw would kill the loop and leave the page blank forever, so
        // teardown runs first: stripping every attribute restores the site.
        stop();
      }
    };

    snapAll(window.innerWidth, window.innerHeight);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (rescanTimer !== null) clearTimeout(rescanTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", doRescan);
      window.removeEventListener("wheel", cancelTour);
      window.removeEventListener("touchstart", cancelTour);
      window.removeEventListener("pointerdown", cancelTour);
      window.removeEventListener("keydown", cancelTour);
      document.removeEventListener("focusin", onFocusIn);
      reduceMql.removeEventListener("change", onReduce);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  const unitFor = (agent: AgentId) => {
    const box = rendered.find((entry) => entry.agent === agent);
    if (!box) return null;
    return box;
  };

  return (
    <div className="collab-stage" aria-hidden>
      {/* Selection, highlight and resize frames */}
      <AnimatePresence>
        {rendered.map((box) => (
          <motion.div
            key={box.key}
            data-collab-agent={box.agent}
            data-action={box.action}
            className="collab-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            ref={(el) => {
              if (!el) {
                boxRefs.current.delete(box.key);
                return;
              }
              boxRefs.current.set(box.key, {
                el,
                tint: el.querySelector<HTMLElement>(".collab-box-tint"),
                caret: el.querySelector<HTMLElement>(".collab-box-caret"),
                unitId: box.id,
                action: box.action,
                w: 0,
                h: 0,
              });
            }}
          >
            <span className="collab-box-tint" />
            {box.action === "type" && <span className="collab-box-caret" />}
            {box.action === "resize" && (
              <>
                <span className="collab-box-corner tl" />
                <span className="collab-box-corner tr" />
                <span className="collab-box-corner bl" />
                <span className="collab-box-corner br" />
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Collaborator pointers */}
      {AGENTS.map((agent) => {
        const box = unitFor(agent.id);
        return (
          <div
            key={agent.id}
            data-collab-agent={agent.id}
            className="collab-cursor"
            style={{ opacity: 0 }}
            ref={(el) => {
              cursorRefs.current[agent.id] = el;
            }}
          >
            <svg viewBox="0 0 14 18" fill="none" aria-hidden>
              <path
                d="M1.5 1.5 L1.5 14.5 L5 11.4 L7.4 16.2 L9.6 15.2 L7.3 10.6 L12.6 10.2 Z"
                fill="var(--collab-agent)"
                stroke="var(--color-bg)"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
            {box?.action === "click" && <span key={box.key} className="collab-cursor-ring" />}
          </div>
        );
      })}

      {/* Name + activity chips */}
      {AGENTS.map((agent) => {
        const box = unitFor(agent.id);
        return (
          <div
            key={agent.id}
            data-collab-agent={agent.id}
            className={`collab-chip${box ? " is-working" : ""}`}
            title={agent.role}
            style={{ opacity: 0 }}
            ref={(el) => {
              chipRefs.current[agent.id] = el;
            }}
          >
            <span className="collab-chip-dot" />
            <span className="collab-chip-name">{agent.name}</span>
            {box && (
              <span key={box.key} className="collab-chip-task">
                {box.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
