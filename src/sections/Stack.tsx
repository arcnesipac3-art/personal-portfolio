import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "../components/SectionHeading";
import { skillsData } from "../data/portfolio";

const EASE = [0.22, 1, 0.36, 1] as const;

const pad = (n: number) => String(n).padStart(2, "0");

const totalTechnologies = skillsData.reduce((n, c) => n + c.technologies.length, 0);

/**
 * The whole toolchain as a flat index, one row per layer.
 *
 * An earlier version of this section was cut for being a duplicate of
 * `Skills`: same five categories, same brand marks, same order. Read as a
 * stack it is a companion instead — `Skills` takes one category at a time and
 * explains what it is used for, while this shows all five together so the
 * relationship between the layers is visible without paging through. That is
 * the part `Skills` cannot show, which is why this earns its place back.
 *
 * Rows are drawn from `skillsData`, so a technology added there appears in
 * both and neither list can drift.
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
          title="The stack, layer by layer."
          description="Everything I build with, arranged the way the layers sit on top of each other — from the markup at the top of the stack down to the hosting underneath it."
        />

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
          {pad(skillsData.length)} layers <span className="text-[#3d4a5c]">/</span>{" "}
          {pad(totalTechnologies)} technologies
        </p>

        <ol className="mt-8 border-t border-white/6">
          {skillsData.map((category, index) => (
            <motion.li
              key={category.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{
                duration: 0.45,
                delay: reduceMotion ? 0 : index * 0.06,
                ease: EASE,
              }}
              className="group/layer grid gap-3 border-b border-white/6 py-5 transition-colors duration-300 hover:bg-white/2 lg:grid-cols-12 lg:gap-6 lg:py-6"
            >
              <div className="flex items-baseline gap-3 lg:col-span-4">
                <span className="font-mono text-[10px] text-[#3d4a5c] transition-colors duration-300 group-hover/layer:text-blue">
                  {pad(index + 1)}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold tracking-tight text-text-primary">
                    {category.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
                    {category.subtitle}
                  </p>
                </div>
              </div>

              <ul className="flex flex-wrap gap-1.5 lg:col-span-8">
                {category.technologies.map((tech) => (
                  <li
                    key={tech.name}
                    className="flex items-center gap-2 border border-white/6 bg-white/2 py-1.5 pl-1.5 pr-2.5 transition-colors duration-300 group-hover/layer:border-white/12 hover:border-blue/30"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/6 bg-[#0a0f1a]">
                      <img
                        src={tech.icon}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                        className="h-3.5 w-3.5 object-contain opacity-85"
                      />
                    </span>
                    <span className="text-[12.5px] text-[#8b9ab1] transition-colors duration-300 group-hover/layer:text-[#dbe3ee]">
                      {tech.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
