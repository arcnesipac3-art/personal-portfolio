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

/** Faint eyebrow label with a hairline running to the edge of the column. */
function ColumnLabel({ children, count }: { children: string; count?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a5768]">
        {children}
      </span>
      <span className="h-px flex-1 bg-white/[0.06]" aria-hidden />
      {count && <span className="shrink-0 font-mono text-[10px] text-[#3d4a5c]">{count}</span>}
    </div>
  );
}

/** A tracked category — index, mark, name, and the ground it covers. */
function CategoryRow({
  category,
  index,
  reduceMotion,
}: {
  category: AchievementCategory;
  index: number;
  reduceMotion: boolean;
}) {
  const Icon = categoryIcons[category.name] ?? Award;

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.35,
        delay: reduceMotion ? 0 : index * 0.05,
        ease: EASE,
      }}
    >
      <div className="group/row -mx-2 flex items-center gap-3.5 border-b border-white/[0.04] px-2 py-3.5 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.02]">
        <span className="w-5 shrink-0 font-mono text-[10px] text-[#3d4a5c] transition-colors duration-300 group-hover/row:text-[#2878f0]">
          {pad(index + 1)}
        </span>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.06] bg-[#0a0f1a] transition-colors duration-300 group-hover/row:border-[#2878f0]/30">
          <Icon
            size={14}
            className="text-[#66758b] transition-colors duration-300 group-hover/row:text-[#2878f0]"
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-medium text-[#dbe3ee] transition-colors duration-300 group-hover/row:text-[#f4f7fc]">
            {category.name}
          </span>
          <span className="mt-0.5 block text-[11.5px] leading-snug text-[#66758b] transition-colors duration-300 group-hover/row:text-[#8b9ab1]">
            {category.summary}
          </span>
        </span>

        <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-[#3d4a5c] transition-colors duration-300 group-hover/row:text-[#2878f0] sm:block">
          Tracking
        </span>
      </div>
    </motion.li>
  );
}

/** Status card for the open log — counters plus a line on what lands here. */
function LogPanel({ reduceMotion }: { reduceMotion: boolean }) {
  const stats = [
    { label: "Entries logged", value: pad(achievementsData.length) },
    { label: "Categories tracked", value: pad(achievementCategories.length) },
    { label: "Log status", value: "Open" },
  ];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.12, ease: EASE }}
    >
      <div className="relative overflow-hidden border border-white/[0.07] bg-[#0d1220]/40 p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-10" aria-hidden />
        <span
          className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[#2878f0]/30"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#2878f0]/30"
          aria-hidden
        />

        <div className="relative flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a5768]">
            Achievement log
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 border border-[#2878f0]/25 bg-[#2878f0]/[0.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#2878f0]">
            <span className="h-1 w-1 rounded-full bg-[#2878f0]" aria-hidden />
            In progress
          </span>
        </div>

        <p className="relative mt-4 text-[13.5px] leading-relaxed text-[#8b9ab1]">
          Academic honors, competitions, and extracurricular milestones are logged here as they
          happen. These are the areas currently being tracked.
        </p>

        <dl className="relative mt-6 divide-y divide-white/[0.04] border-t border-white/[0.06]">
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

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="min-w-0 lg:col-span-7">
        <ColumnLabel count={pad(achievementCategories.length)}>Tracked categories</ColumnLabel>

        <ul className="mt-4">
          {achievementCategories.map((category, i) => (
            <CategoryRow
              key={category.name}
              category={category}
              index={i}
              reduceMotion={reduceMotion}
            />
          ))}
        </ul>
      </div>

      <div className="min-w-0 lg:col-span-5">
        <LogPanel reduceMotion={reduceMotion} />
      </div>
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
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: reduceMotion ? 0 : index * 0.06,
        ease: EASE,
      }}
      className="h-full"
    >
      {/* Lift sits on a plain child so it never fights Motion's transform. */}
      <div className="group h-full border border-white/[0.07] bg-[#0d1220]/30 p-5 transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-[#2878f0]/25 hover:bg-[#0d1220]/50">
        <div className="flex items-start gap-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#2878f0]/15 bg-[#2878f0]/[0.04] transition-colors duration-300 group-hover:border-[#2878f0]/35">
            <Icon size={14} className="text-[#2878f0]" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[#66758b]">
                {entry.category}
              </span>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#2878f0]">
                {entry.year}
              </span>
            </div>

            <h3 className="mt-1.5 font-display text-[15px] font-semibold leading-snug tracking-tight text-[#f4f7fc]">
              {entry.title}
            </h3>

            <p className="mt-1.5 text-[13px] leading-relaxed text-[#66758b] transition-colors duration-300 group-hover:text-[#8b9ab1]">
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
      className="relative section-padding overflow-x-clip border-y border-white/[0.04] bg-[#0a0f1a]"
    >
      <div className="absolute inset-0 bg-grid-fine opacity-15" aria-hidden />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[320px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2878f0]/[0.02] blur-[120px]"
        aria-hidden
      />

      <div className="shell relative z-10">
        <SectionHeading
          number="05"
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
