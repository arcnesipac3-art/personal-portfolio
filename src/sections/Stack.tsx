import { motion } from "motion/react";
import { SectionHeading } from "../components/SectionHeading";
import { stackData, type StackGroup } from "../data/portfolio";

function StackColumn({ group, index }: { group: StackGroup; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      {/* Comment label */}
      <p className="font-mono text-[11px] text-slate-700 mb-3">
        {group.comment}
      </p>

      {/* Group heading */}
      <h3 className="font-display text-lg font-bold tracking-tight text-slate-100 mb-4">
        {group.label}
      </h3>

      {/* Items */}
      <div className="space-y-1">
        {group.items.map((item) => (
          <div
            key={item.name}
            className="group/item flex items-baseline gap-2 py-1.5 border-b border-white/[0.03] transition-colors hover:border-blue-500/10"
          >
            <span className="text-[14px] font-medium text-slate-300 transition-colors group-hover/item:text-blue-400">
              {item.name}
            </span>
            <span className="text-[11px] text-slate-600 opacity-0 transition-opacity group-hover/item:opacity-100">
              — {item.description}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function Stack() {
  return (
    <section id="stack" className="relative section-padding overflow-hidden border-y border-white/[0.04] bg-[#0a0f1a]">
      <div className="absolute inset-0 bg-grid-fine opacity-15" aria-hidden />

      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          number="04"
          label="Stack"
          title="Tools I build with."
        />

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {stackData.map((group, i) => (
            <StackColumn key={group.label} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
