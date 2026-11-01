import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Award,
  Atom,
  Crown,
  FlaskConical,
  Newspaper,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import {
  achievementsData,
  achievementCategories,
  type AchievementCategory,
  type AchievementEntry,
} from "../data/portfolio";

const EASE = [0.22, 1, 0.36, 1] as const;

/** One mark per tracked category, matched by name. */
const categoryIcons: Record<string, LucideIcon> = {
  "Academic Honors": Award,
  "Research Activities": FlaskConical,
  "Science Quiz Competitions": Atom,
  "Chess Competitions": Crown,
  "Campus Journalism": Newspaper,
  "Student Government": Users,
  "Other School Activities": Sparkles,
};

const pad = (value: number) => String(value).padStart(2, "0");

const TOTAL = achievementCategories.length;

/** Faint eyebrow label with a hairline running to the edge of the column. */
function ColumnLabel({ children, count }: { children: string; count?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a5768]">
        {children}
      </span>
      <span className="h-px flex-1 bg-white/6" aria-hidden />
      {count && <span className="shrink-0 font-mono text-[10px] text-[#3d4a5c]">{count}</span>}
    </div>
  );
}

/** A tracked category — index, mark, name, and the ground it covers. */
function CategoryRow({
  category,
  index,
  active,
  onSelect,
  reduceMotion,
  buttonRef,
}: {
  category: AchievementCategory;
  index: number;
  active: boolean;
  onSelect: () => void;
  reduceMotion: boolean;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  const Icon = categoryIcons[category.name] ?? Award;

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{
        duration: 0.35,
        delay: reduceMotion ? 0 : index * 0.05,
        ease: EASE,
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={onSelect}
        // Focus selects too, so the arrow keys only have to move focus and the
        // highlight can never drift away from where the keyboard is.
        onFocus={onSelect}
        aria-pressed={active}
        className={`group/row relative -mx-2 flex w-full items-center gap-3.5 border-b border-white/4 px-2 py-3.5 text-left transition-colors duration-300 last:border-b-0 hover:bg-white/2 focus-ring ${
          active ? "bg-white/2.5" : ""
        }`}
      >
        {/* One cursor element that glides between rows. */}
        {active && (
          <motion.span
            layoutId="registry-cursor"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="absolute top-0 left-0 h-full w-px bg-blue"
            aria-hidden
          />
        )}

        <span
          className={`w-5 shrink-0 font-mono text-[10px] transition-colors duration-300 group-hover/row:text-blue ${
            active ? "text-blue" : "text-[#3d4a5c]"
          }`}
        >
          {pad(index + 1)}
        </span>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center border bg-[#0a0f1a] transition-colors duration-300 group-hover/row:border-blue/30 ${
            active ? "border-blue/40" : "border-white/6"
          }`}
        >
          <Icon
            size={14}
            className={`transition-colors duration-300 group-hover/row:text-blue ${
              active ? "text-blue" : "text-text-muted"
            }`}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block text-[13.5px] font-medium transition-colors duration-300 group-hover/row:text-text-primary ${
              active ? "text-text-primary" : "text-[#dbe3ee]"
            }`}
          >
            {category.name}
          </span>
          <span
            className={`mt-0.5 block text-[11.5px] leading-snug transition-colors duration-300 group-hover/row:text-[#8b9ab1] ${
              active ? "text-[#8b9ab1]" : "text-text-muted"
            }`}
          >
            {category.summary}
          </span>
        </span>

        <span
          className={`hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-300 group-hover/row:text-blue sm:block ${
            active ? "text-blue" : "text-[#3d4a5c]"
          }`}
        >
          Tracking
        </span>
      </button>
    </motion.li>
  );
}

/** Status card for the open log — a position readout plus what lands here. */
function LogPanel({
  active,
  onSelect,
  reduceMotion,
}: {
  active: number;
  onSelect: (index: number) => void;
  reduceMotion: boolean;
}) {
  const stats = [
    { label: "Entries logged", value: pad(achievementsData.length) },
    { label: "Categories tracked", value: pad(achievementCategories.length) },
    { label: "Log status", value: "Open" },
  ];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.12, ease: EASE }}
    >
      <div className="relative overflow-hidden border border-white/7 bg-[#0d1220]/40 p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-10" aria-hidden />
        <span
          className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-blue/30"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-blue/30"
          aria-hidden
        />

        <div className="relative flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a5768]">
            Achievement log
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 border border-blue/25 bg-blue/6 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-blue">
            <span className="h-1 w-1 rounded-full bg-blue" aria-hidden />
            In progress
          </span>
        </div>

        <p className="relative mt-4 text-[13.5px] leading-relaxed text-[#8b9ab1]">
          Academic honors, competitions, and extracurricular milestones are logged here as they
          happen. These are the areas currently being tracked.
        </p>

        {/* Position readout, and a second way into the same selection — the
            ledger shows which categories exist, this shows where you are. */}
        <div className="relative mt-6 flex items-center gap-3">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a5768]">
            Selected
          </span>

          <div
            className="flex flex-1 items-center gap-1"
            role="group"
            aria-label="Jump to a tracked category"
          >
            {achievementCategories.map((category, i) => (
              <button
                key={category.name}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Select ${category.name}`}
                aria-current={i === active ? "true" : undefined}
                className="group/seg flex h-6 flex-1 items-center focus-ring"
              >
                <span
                  className={`w-full transition-[height,background-color] duration-300 ${
                    i === active
                      ? "h-3.5 bg-blue"
                      : i < active
                        ? "h-2 bg-blue/25 group-hover/seg:bg-blue/45"
                        : "h-2 bg-white/10 group-hover/seg:bg-white/20"
                  }`}
                />
              </button>
            ))}
          </div>

          <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#dbe3ee]">
            {pad(active + 1)}
            <span className="text-[#3d4a5c]">/{pad(TOTAL)}</span>
          </span>
        </div>

        <dl className="relative mt-6 divide-y divide-white/4 border-t border-white/6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between gap-4 py-3">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#4a5768]">
                {stat.label}
              </dt>
              <dd className="font-mono text-[13px] tabular-nums text-[#dbe3ee]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}

/** The open log: what is being tracked, alongside its current status. */
function TrackedRegistry() {
  const reduceMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = achievementCategories[active];

  /** Arrow keys move focus rather than state; the row's focus selects it. */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const move = (next: number) => {
      e.preventDefault();
      rowRefs.current[(next + TOTAL) % TOTAL]?.focus();
    };

    if (e.key === "ArrowDown" || e.key === "ArrowRight") move(active + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") move(active - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(TOTAL - 1);
  };

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div
        className="min-w-0 lg:col-span-7"
        role="group"
        aria-label="Tracked category registry"
        onKeyDown={handleKeyDown}
      >
        <ColumnLabel count={pad(achievementCategories.length)}>Tracked categories</ColumnLabel>

        <ul className="mt-4">
          {achievementCategories.map((category, i) => (
            <CategoryRow
              key={category.name}
              category={category}
              index={i}
              active={i === active}
              onSelect={() => setActive(i)}
              buttonRef={(el) => {
                rowRefs.current[i] = el;
              }}
              reduceMotion={reduceMotion}
            />
          ))}
        </ul>
      </div>

      <div className="min-w-0 lg:col-span-5">
        <LogPanel active={active} onSelect={setActive} reduceMotion={reduceMotion} />
      </div>

      {/* Selecting is otherwise only a shift in weight and colour. */}
      <p className="sr-only" role="status" aria-live="polite">
        Tracked category {active + 1} of {TOTAL} — {current.name}: {current.summary}
      </p>
    </div>
  );
}

/** A logged entry, shown once the log has something in it. */
function EntryCard({
  entry,
  index,
  reduceMotion,
}: {
  entry: AchievementEntry;
  index: number;
  reduceMotion: boolean;
}) {
  const Icon = categoryIcons[entry.category] ?? Award;

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{
        duration: 0.4,
        delay: reduceMotion ? 0 : index * 0.06,
        ease: EASE,
      }}
      className="h-full"
    >
      {/* Lift sits on a plain child so it never fights Motion's transform. */}
      <div className="group h-full border border-white/7 bg-[#0d1220]/30 p-5 transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-blue/25 hover:bg-[#0d1220]/50">
        <div className="flex items-start gap-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-blue/15 bg-blue/4 transition-colors duration-300 group-hover:border-blue/35">
            <Icon size={14} className="text-blue" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                {entry.category}
              </span>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-blue">
                {entry.year}
              </span>
            </div>

            <h3 className="mt-1.5 font-display text-[15px] font-semibold leading-snug tracking-tight text-text-primary">
              {entry.title}
            </h3>

            <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted transition-colors duration-300 group-hover:text-[#8b9ab1]">
              {entry.description}
            </p>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function Achievements() {
  const reduceMotion = useReducedMotion() ?? false;
  const hasContent = achievementsData.length > 0;

  return (
    <section
      id="achievements"
      className="relative section-padding overflow-x-clip border-y border-white/4 bg-[#0a0f1a]/80"
    >
      <div className="absolute inset-0 bg-grid-fine opacity-15" aria-hidden />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/2 blur-[120px]"
        aria-hidden
      />

      <div className="shell relative z-10">
        <SectionHeading
          number="06"
          label="Activities"
          title="Achievements & activities."
          description="Honors, competitions, and school involvement — recorded here as they happen."
        />

        {hasContent ? (
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievementsData.map((entry, i) => (
              <EntryCard
                key={`${entry.title}-${entry.year}-${i}`}
                entry={entry}
                index={i}
                reduceMotion={reduceMotion}
              />
            ))}
          </ul>
        ) : (
          <TrackedRegistry />
        )}
      </div>
    </section>
  );
}
