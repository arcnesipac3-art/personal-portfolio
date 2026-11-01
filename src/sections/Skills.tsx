import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Monitor, Server, Database, Wrench, Sparkles, type LucideIcon } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { useSwipe } from "../hooks/useSwipe";
import { skillsData } from "../data/portfolio";

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Server,
  Database,
  Wrench,
  Sparkles,
};

export function Skills() {
  const [active, setActive] = useState(0);
  const category = skillsData[active];
  const Icon = iconMap[category.icon] ?? Sparkles;

  const goNext = () => setActive((a) => (a + 1) % skillsData.length);
  const goPrev = () => setActive((a) => (a - 1 + skillsData.length) % skillsData.length);

  const swipe = useSwipe(goNext, goPrev);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  return (
    <section id="skills" className="relative section-padding overflow-x-hidden">
      <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          number="03"
          label="What I Work With"
          title="Skills in motion."
        />

        <div className="mt-10">
          {/* Carousel layout */}
          <div
            className="grid gap-6 lg:grid-cols-12 lg:gap-8"
            style={{ touchAction: "pan-y" }}
            {...swipe}
          >
            {/* Left: category info */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Counter */}
                  <p className="font-mono text-[11px] text-slate-600">
                    {String(active + 1).padStart(2, "0")} / {String(skillsData.length).padStart(2, "0")}
                  </p>

                  {/* Icon */}
                  <div className="mt-4 flex h-12 w-12 items-center justify-center border border-white/[0.08] bg-white/[0.02]">
                    <Icon size={20} className="text-blue-400" />
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-slate-50 sm:text-2xl">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-500">
                    {category.subtitle}
                  </p>

                  {/* Skills list */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {category.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                        className="border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-blue-500/20 hover:text-blue-400"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div
                className="mt-6 flex items-center gap-3"
                onKeyDown={handleKeyDown}
                role="group"
                aria-label="Skill category controls"
              >
                <div className="flex gap-1.5">
                  <button
                    onClick={goPrev}
                    className="flex h-9 w-9 items-center justify-center border border-white/[0.06] text-slate-400 transition-all hover:border-blue-500/20 hover:bg-white/[0.03] hover:text-blue-400 active:scale-90 focus-ring"
                    aria-label="Previous category"
                  >
                    <ArrowLeft size={15} />
                  </button>
                  <button
                    onClick={goNext}
                    className="flex h-9 w-9 items-center justify-center border border-white/[0.06] text-slate-400 transition-all hover:border-blue-500/20 hover:bg-white/[0.03] hover:text-blue-400 active:scale-90 focus-ring"
                    aria-label="Next category"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {skillsData.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active
                          ? "w-6 bg-blue-400"
                          : "w-1.5 bg-slate-700 hover:bg-slate-600"
                      }`}
                      aria-label={`Go to category ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: visual panel */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full min-h-[280px] border border-white/[0.06] bg-[#0d1220]/30 p-6 sm:p-8"
                >
                  {/* Large number watermark */}
                  <span className="absolute right-4 top-2 font-display text-[5rem] font-bold text-white/[0.03] sm:text-[7rem]">
                    {String(active + 1).padStart(2, "0")}
                  </span>

                  {/* Category icon large */}
                  <div className="flex h-16 w-16 items-center justify-center border border-blue-500/15 bg-blue-500/[0.04]">
                    <Icon size={28} className="text-blue-400/60" />
                  </div>

                  {/* Tech list */}
                  <div className="mt-6 space-y-1.5">
                    {category.skills.map((skill, i) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="flex items-center gap-3 border-b border-white/[0.03] py-2"
                      >
                        <span className="font-mono text-[10px] text-slate-700">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[14px] font-medium text-slate-300">
                          {skill}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
