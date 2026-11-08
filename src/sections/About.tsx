import { motion } from "motion/react";
import { GraduationCap, MapPin, BookOpen, Target } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { aboutContent, personalInfo } from "../data/portfolio";

const infoIcons: Record<string, typeof GraduationCap> = {
  Education: GraduationCap,
  Strand: BookOpen,
  Location: MapPin,
  Focus: Target,
};

export function About() {
  return (
    <section id="about" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-grid-fine opacity-30" aria-hidden />

      <div className="shell relative z-10">
        <SectionHeading
          number="01"
          label="About"
          title={aboutContent.heading}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-7"
          >
            <p
              className="font-display text-lg font-light leading-[1.55] text-text-secondary sm:text-xl"
            >
              {aboutContent.paragraphs[0]}
            </p>
            <div className="mt-5 border-l border-white/10 pl-4">
              <p className="text-[15px] leading-[1.65] text-text-muted">
                {aboutContent.paragraphs[1]}
              </p>
            </div>
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="lg:col-span-5"
          >
            <div
              className="border border-white/7 bg-bg-secondary/40 p-5 transition-colors duration-300 hover:border-white/12"
            >
              <div className="space-y-px">
                {aboutContent.infoLabels.map((info) => {
                  const Icon = infoIcons[info.key] ?? Target;
                  return (
                    <div
                      key={info.key}
                      className="group/row -mx-2 flex items-center gap-3 rounded-sm border-b border-white/4 px-2 py-2.5 transition-colors duration-300 last:border-0 hover:bg-white/2"
                    >
                      <Icon
                        size={13}
                        className="shrink-0 text-text-muted transition-colors duration-300 group-hover/row:text-blue"
                      />
                      <span className="w-20 shrink-0 text-[13px] text-text-muted transition-colors duration-300 group-hover/row:text-text-muted">
                        {info.key}
                      </span>
                      <span className="text-[13px] font-medium text-text-secondary transition-colors duration-300 group-hover/row:text-text-primary">
                        {info.value}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-white/4 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Currently at
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-text-secondary">
                  {personalInfo.school}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
