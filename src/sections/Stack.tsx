import { useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "../components/SectionHeading";
import { skillsData } from "../data/portfolio";

const EASE = [0.22, 1, 0.36, 1] as const;

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

/**
 * How the stack connects, rather than what is in it.
 *
 * `Skills` already lists every technology with its mark and name, so repeating
 * that inventory here made the two sections read as one. This shows the part
 * `Skills` cannot: the path a request takes through TRACK, the order of the
 * layers and the seams between them.
 *
 * The rail doubles as the control. Stepping a stage fills its node and every
 * node behind it, so the line reads as the pipeline the request has travelled
 * — the same shape a progress indicator would have, without a second widget
 * competing with it. Stages behind the active one keep their highlight after
 * you move on, which is what makes the order legible rather than just the
 * current pick.
 *
 * Marks resolve by name from `skillsData`, so an icon is still declared once.
 */
export function Stack() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;

  const total = STAGES.length;
  const current = STAGES[active];

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((a) => (a + 1) % total);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => (a - 1 + total) % total);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(total - 1);
    }
  };

  return (
    <section
      id="stack"
      className="relative section-padding overflow-x-clip border-y border-white/4 bg-[#0a0f1a]/80"
    >
      <div className="absolute inset-0 bg-grid-fine opacity-15" aria-hidden />

      <div className="shell relative z-10">
        <SectionHeading
          number="04"
          label="Technology Stack"
          title="How the pieces connect."
          description="The path a request takes through TRACK — from typed components in the browser down to rows in PostgreSQL, and what hosts each end."
        />

        <div className="mt-12 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
            {pad(active + 1)} <span className="text-[#3d4a5c]">/</span> {pad(total)} ·{" "}
            <span className="text-blue">{current.label}</span>
          </p>
          {/* Otherwise the rail reads as a diagram and the arrow keys go
              undiscovered, since nothing else on the page steps sideways. */}
          <p
            className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[#3d4a5c] sm:block"
            aria-hidden
          >
            ← → to step
          </p>
        </div>

        <div
          role="group"
          aria-label="Request path — step through the stages with the arrow keys"
          onKeyDown={handleKeyDown}
          className="relative mt-6 border-t border-white/8 pt-8"
        >
          <span
            className="absolute -top-px left-0 h-px w-24 bg-linear-to-r from-blue to-transparent"
            aria-hidden
          />

          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {STAGES.map((stage, index) => {
              const isActive = index === active;

              return (
                <motion.li
                  key={stage.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                  transition={{
                    duration: 0.45,
                    delay: reduceMotion ? 0 : index * 0.07,
                    ease: EASE,
                  }}
                  // Mouse users get the whole column as the target; the node
                  // button stays the real control for keyboard and screen
                  // readers, and a `li` is not focusable so nothing is nested.
                  onClick={() => setActive(index)}
                  className="group/stage relative cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    aria-label={`Stage ${index + 1} of ${total}: ${stage.label} — ${stage.title}`}
                    aria-current={isActive ? "step" : undefined}
                    className="absolute -top-13 -left-5 grid h-10 w-10 place-items-center rounded-full focus-ring"
                  >
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

                  <div
                    className={`transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-55 group-hover/stage:opacity-90"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] transition-colors duration-300 ${
                          isActive ? "text-blue" : "text-[#3d4a5c]"
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

                    <p className="mt-2 max-w-[26ch] text-[12.5px] leading-relaxed text-text-muted lg:max-w-none">
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
                          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#8b9ab1]">
                            {name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* The stage change is otherwise only a shift in weight and colour. */}
        <p className="sr-only" role="status" aria-live="polite">
          Stage {active + 1} of {total} — {current.label}: {current.title}
        </p>
      </div>
    </section>
  );
}
