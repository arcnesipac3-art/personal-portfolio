import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "../components/SectionHeading";
import { stackData, type StackGroup, type StackItem } from "../data/portfolio";

function StackRow({ item }: { item: StackItem }) {
  return (
    <li className="group/item -mx-2 flex items-center gap-3 rounded-sm px-2 py-2.5 transition-colors duration-300 hover:bg-white/[0.02]">
      <img
        src={item.icon}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="h-5 w-5 shrink-0 object-contain opacity-85 transition-opacity duration-300 group-hover/item:opacity-100"
      />
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-slate-200 transition-colors duration-300 group-hover/item:text-slate-50">
          {item.name}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-500 transition-colors duration-300 group-hover/item:text-slate-400">
          {item.description}
        </p>
      </div>
    </li>
  );
}

function StackCard({
  group,
  index,
  reduceMotion,
}: {
  group: StackGroup;
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      // `initial={false}` skips the entrance entirely, so reduced-motion users
      // see the card in place instead of an animation that is instantly cut.
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: reduceMotion ? 0 : index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      {/* The lift lives on a plain child: Motion owns `transform` on the element
          it animates, so a CSS hover transform there would simply be ignored. */}
      <div className="h-full border border-white/[0.07] bg-[#0d1220]/40 p-5 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-500/25">
        <div className="mb-2 flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-3">
          <h3 className="font-display text-base font-semibold tracking-tight text-slate-100">
            {group.label}
          </h3>
          <span className="shrink-0 font-mono text-[10px] text-slate-600">{group.comment}</span>
        </div>

        <ul className="divide-y divide-white/[0.04]">
          {group.items.map((item) => (
            <StackRow key={item.name} item={item} />
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function Stack() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section id="stack" className="relative section-padding overflow-hidden border-y border-white/[0.04] bg-[#0a0f1a]">
      <div className="absolute inset-0 bg-grid-fine opacity-15" aria-hidden />

      <div className="shell relative z-10">
        <SectionHeading
          number="04 /"
          label="Technology Stack"
          title="The tools behind my work."
          description="A collection of technologies I use to design, develop, and build software."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:gap-5">
          {stackData.map((group, i) => (
            <StackCard key={group.label} group={group} index={i} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
