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
 * `Skills` cannot: the path a request takes through TRACK, from typed
 * components in the browser down to rows in PostgreSQL — the order and the
 * seams between the layers, which is architecture rather than a catalogue.
 *
 * Marks are resolved by name from `skillsData`, so an icon is still declared
 * in exactly one place.
 */
export function Stack() {
  const reduceMotion = useReducedMotion() ?? false;

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

        {/* The rail: a single hairline the stages hang from, diamond nodes
            climbing it, in the same vocabulary as the Journey timeline. */}
        <div className="relative mt-12 border-t border-white/8 pt-8">
          <span
            className="absolute -top-px left-0 h-px w-24 bg-linear-to-r from-blue to-transparent"
            aria-hidden
          />

          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {STAGES.map((stage, index) => (
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
                className="relative"
              >
                <span
                  className="absolute -top-8.75 left-0 h-1.5 w-1.5 rotate-45 bg-blue"
                  aria-hidden
                />

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#3d4a5c]">
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
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
