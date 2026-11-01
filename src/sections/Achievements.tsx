import { motion } from "motion/react";
import { Award, Sparkle } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { achievementsData, achievementCategories } from "../data/portfolio";

export function Achievements() {
  const hasContent = achievementsData.length > 0;

  return (
    <section id="achievements" className="relative section-padding overflow-hidden border-y border-white/[0.04] bg-[#0a0f1a]">
      <div className="absolute inset-0 bg-grid-fine opacity-15" aria-hidden />

      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          number="06"
          label="Activities"
          title="Achievements & activities."
        />

        <div className="mt-10">
          {hasContent ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {achievementsData.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group border border-white/[0.07] bg-[#0d1220]/30 p-5 transition-colors hover:border-blue-500/15"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-blue-500/15 bg-blue-500/[0.04]">
                      <Award size={14} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-600">
                        {entry.category}
                      </span>
                      <h3 className="mt-0.5 font-display text-sm font-semibold text-slate-100">
                        {entry.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] text-slate-500">{entry.description}</p>
                      <span className="mt-2 inline-block font-mono text-[11px] text-blue-400">{entry.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="border border-white/[0.06] bg-[#0d1220]/20 p-8"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <Sparkle size={14} className="text-slate-600" />
                <h3 className="font-display text-base font-medium text-slate-300">
                  Still in progress
                </h3>
              </div>
              <p className="text-[14px] text-slate-500 max-w-md leading-relaxed">
                Academic honors, competitions, and extracurricular achievements will be
                added here as they happen. Until then, the focus is on learning and building.
              </p>

              {/* Category tags */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {achievementCategories.map((cat) => (
                  <span
                    key={cat}
                    className="border border-white/[0.05] bg-white/[0.015] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-600"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
