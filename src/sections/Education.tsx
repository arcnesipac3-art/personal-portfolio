import { motion } from "motion/react";
import { GraduationCap, School, BookOpen, type LucideIcon } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { educationData, type EducationEntry } from "../data/portfolio";

const levelIcons: Record<string, LucideIcon> = {
  "Senior High School": GraduationCap,
  "Junior High School": School,
  "Elementary": BookOpen,
};

function TimelineItem({ entry, index }: { entry: EducationEntry; index: number }) {
  const isLast = index === educationData.length - 1;
  const Icon = levelIcons[entry.level] ?? School;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative flex gap-4 sm:gap-6"
    >
      {/* Left rail */}
      <div className="flex flex-col items-center">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center border border-blue-500/15 bg-[#0a0f1a]">
          <Icon size={15} className="text-blue-400" />
        </div>
        {!isLast && (
          <div className="mt-1 w-px flex-1 bg-gradient-to-b from-blue-500/10 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}>
        {/* Year */}
        <p className="font-mono text-[11px] text-blue-400 mb-1">
          {entry.years}
        </p>
        {/* School */}
        <h3 className="font-display text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
          {entry.school}
        </h3>
        {/* Level */}
        <p className="mt-0.5 text-[13px] text-slate-500">{entry.level}</p>
        {/* Strand */}
        {entry.strand && (
          <span className="mt-2 inline-flex items-center gap-1 border border-blue-500/15 bg-blue-500/[0.03] px-2 py-0.5 font-mono text-[10px] text-blue-400">
            {entry.strand}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function Education() {
  return (
    <section id="journey" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden />

      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          number="05"
          label="Journey"
          title="Keep building."
        />

        <div className="mt-10 max-w-2xl">
          {educationData.map((entry, i) => (
            <TimelineItem key={`${entry.school}-${entry.level}-${i}`} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
