import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Monitor,
  Rocket,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { useSwipe } from "../hooks/useSwipe";
import { skillsData, type SkillCategory, type SkillTech } from "../data/portfolio";

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Server,
  Database,
  Wrench,
  Rocket,
};

const pad = (n: number) => String(n).padStart(2, "0");

const EASE = [0.22, 1, 0.36, 1] as const;

/** Shared swap preset so both panels change in step. */
const swap = (reduceMotion: boolean, delay = 0) => ({
  initial: reduceMotion ? (false as const) : { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 },
  transition: {
    duration: 0.3,
    delay: reduceMotion ? 0 : delay,
    ease: EASE,
  },
});

/** Category summary — description, icon, and the tags derived from its technologies. */
function CategoryIntro({
  category,
  index,
  total,
  reduceMotion,
}: {
  category: SkillCategory;
  index: number;
  total: number;
  reduceMotion: boolean;
}) {
  const Icon = iconMap[category.icon] ?? Monitor;

  return (
    <div className="flex min-h-75 flex-col lg:min-h-82.5">
      <p className="font-mono text-[11px] tracking-[0.14em] text-text-muted">
        {pad(index + 1)} <span className="text-text-muted">/</span> {pad(total)}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/8 bg-white/2">
          <Icon size={18} className="text-blue" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            {category.title}
          </h3>
          <p className="mt-0.5 text-[13px] text-text-muted">{category.subtitle}</p>
        </div>
      </div>

      <span
        className="mt-5 block h-px w-16 bg-linear-to-r from-blue to-transparent"
        aria-hidden
      />

      <p className="mt-5 max-w-md text-[14px] leading-relaxed text-text-secondary">
        {category.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {category.technologies.map((tech, i) => (
          <motion.span
            key={tech.name}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: reduceMotion ? 0 : 0.12 + i * 0.04,
              ease: EASE,
            }}
            className="border border-white/6 bg-white/2 px-2.5 py-1 font-mono text-[11px] text-text-secondary transition-colors duration-300 hover:border-blue/25 hover:text-blue"
          >
            {tech.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function Controls({
  active,
  onPrev,
  onNext,
  onSelect,
}: {
  active: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous skill category"
          className="flex h-10 w-10 items-center justify-center border border-white/8 text-text-secondary transition-[color,background-color,border-color,transform] duration-300 hover:border-blue/35 hover:bg-blue/6 hover:text-blue active:scale-95 focus-ring"
        >
          <ArrowLeft size={15} />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next skill category"
          className="flex h-10 w-10 items-center justify-center border border-white/8 text-text-secondary transition-[color,background-color,border-color,transform] duration-300 hover:border-blue/35 hover:bg-blue/6 hover:text-blue active:scale-95 focus-ring"
        >
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Padded hit areas keep the thin indicators tappable on touch screens. */}
      <div className="flex items-center gap-0.5">
        {skillsData.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Show ${item.title}`}
              aria-current={isActive ? "true" : undefined}
              className="group/ind flex items-center px-1 py-3 focus-ring"
            >
              <span
                className={`block h-0.75 transition-[width,background-color] duration-300 ease-out ${
                  isActive
                    ? "w-9 bg-linear-to-r from-blue to-cyan"
                    : "w-3.5 bg-white/10 group-hover/ind:bg-white/25"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TechRow({
  tech,
  index,
  reduceMotion,
}: {
  tech: SkillTech;
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: reduceMotion ? 0 : 0.06 + index * 0.05,
        ease: EASE,
      }}
      className="group/tech -mx-2 flex items-center gap-3 border-b border-white/4 px-2 py-3 transition-colors duration-300 last:border-b-0 hover:bg-white/2"
    >
      <span className="w-5 shrink-0 font-mono text-[10px] text-text-muted transition-colors duration-300 group-hover/tech:text-blue">
        {pad(index + 1)}
      </span>

      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/6 bg-bg transition-colors duration-300 group-hover/tech:border-blue/30">
        <img
          src={tech.icon}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="h-4 w-4 object-contain opacity-85 transition-opacity duration-300 group-hover/tech:opacity-100"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium text-text-primary transition-colors duration-300 group-hover/tech:text-text-primary">
          {tech.name}
        </span>
        <span className="mt-0.5 block text-[11.5px] leading-snug text-text-muted transition-colors duration-300 group-hover/tech:text-text-secondary">
          {tech.description}
        </span>
      </span>
    </motion.li>
  );
}

function TechPanel({
  category,
  index,
  reduceMotion,
}: {
  category: SkillCategory;
  index: number;
  reduceMotion: boolean;
}) {
  const Icon = iconMap[category.icon] ?? Monitor;

  return (
    <div className="relative flex min-h-82.5 flex-col border border-white/7 bg-bg-secondary/30 p-5 sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-10" aria-hidden />

      {/* Watermark is derived from the selected category. */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-1 select-none font-display text-[4.5rem] font-bold leading-none text-white/3.5 sm:text-[6.5rem]"
      >
        {pad(index + 1)}
      </span>

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center border border-blue/15 bg-blue/5">
          <Icon size={24} className="text-blue/70" />
        </div>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
          {category.title}
        </span>
      </div>

      <ul className="relative mt-6">
        {category.technologies.map((tech, i) => (
          <TechRow key={tech.name} tech={tech} index={i} reduceMotion={reduceMotion} />
        ))}
      </ul>

      <p className="relative mt-auto pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
        {pad(category.technologies.length)}{" "}
        {category.technologies.length === 1 ? "technology" : "technologies"}
      </p>
    </div>
  );
}

export function Skills() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;

  const total = skillsData.length;
  const category = skillsData[active];

  // Looping keeps both arrows meaningful at every index.
  const goNext = () => setActive((a) => (a + 1) % total);
  const goPrev = () => setActive((a) => (a - 1 + total) % total);

  const swipe = useSwipe(goNext, goPrev);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(total - 1);
    }
  };

  return (
    <section id="skills" className="relative section-padding overflow-x-clip">
      <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden />

      <div className="shell relative z-10">
        <SectionHeading
          number="03"
          label="What I Work With"
          title="Skills in motion."
        />

        <div
          className="mt-10 grid gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-12 lg:gap-8"
          style={{ touchAction: "pan-y" }}
          role="group"
          aria-label="Skill categories — use the arrow keys to change category"
          onKeyDown={handleKeyDown}
          {...swipe}
        >
          {/* Left: category intro + controls */}
          <div className="min-w-0 lg:col-span-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} {...swap(reduceMotion)}>
                <CategoryIntro
                  category={category}
                  index={active}
                  total={total}
                  reduceMotion={reduceMotion}
                />
              </motion.div>
            </AnimatePresence>

            <Controls
              active={active}
              onPrev={goPrev}
              onNext={goNext}
              onSelect={setActive}
            />

            {/* Announces the change, which is otherwise visual only. */}
            <p className="sr-only" role="status" aria-live="polite">
              {category.title} — category {active + 1} of {total}
            </p>
          </div>

          {/* Right: outlined technology panel */}
          <div className="min-w-0 lg:col-span-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="h-full"
              >
                <TechPanel category={category} index={active} reduceMotion={reduceMotion} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
