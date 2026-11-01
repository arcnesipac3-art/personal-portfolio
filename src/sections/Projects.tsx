import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  X,
  Layers,
  Target,
  Lightbulb,
  Users,
  Code2,
  Cog,
  AlertTriangle,
  CircleDot,
  ChevronRight,
} from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { ProjectMockup, type MockupVariant } from "../components/ProjectMockup";
import { trackProject } from "../data/portfolio";

const mockupVariants: MockupVariant[] = [
  "dashboard",
  "requirements",
  "attendance",
  "notifications",
];

const mockupLabels: Record<MockupVariant, string> = {
  dashboard: "Dashboard",
  requirements: "Requirements",
  attendance: "Attendance",
  notifications: "Notifications",
};

function CaseStudyModal({ onClose }: { onClose: () => void }) {
  const cs = trackProject.caseStudy;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    const closeBtn = modalRef.current?.querySelector("[aria-label='Close case study']") as HTMLElement;
    closeBtn?.focus();
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const sections = [
    { icon: Layers, title: "Overview", content: cs.overview },
    { icon: Target, title: "Problem", content: cs.problem },
    { icon: Lightbulb, title: "Solution", content: cs.solution },
    {
      icon: Code2,
      title: "Technology",
      content: cs.technology.join(" · "),
      extra: (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cs.technology.map((tech) => (
            <span key={tech} className="rounded border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-slate-400">
              {tech}
            </span>
          ))}
        </div>
      ),
    },
    { icon: Cog, title: "Development Process", content: cs.devProcess },
    { icon: AlertTriangle, title: "Challenges & Lessons", content: cs.challenges },
    { icon: CircleDot, title: "Project Status", content: cs.status },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#080b14]/85 backdrop-blur-md p-3 sm:p-6 lg:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="TRACK case study"
    >
      <motion.div
        ref={modalRef}
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 16, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative my-auto w-full max-w-3xl border border-white/[0.08] bg-[#0a0f1a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#0a0f1a]/95 px-5 py-3.5 backdrop-blur-xl">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">
              Case Study
            </p>
            <h3 className="mt-0.5 font-display text-base font-bold text-slate-50 sm:text-lg">
              {trackProject.name} — {trackProject.expandedName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border border-white/10 text-slate-400 transition-all hover:text-white hover:border-white/20 focus-ring"
            aria-label="Close case study"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-7 sm:px-8">
          <p className="mb-8 text-[15px] leading-[1.65] text-slate-300">
            {trackProject.description}
          </p>

          {/* Features */}
          <div className="mb-8">
            <h4 className="mb-4 font-display text-base font-semibold text-slate-100">
              Core Features
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {cs.features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-2.5 border border-white/[0.04] bg-white/[0.015] p-3 transition-colors hover:border-blue-500/10"
                >
                  <ChevronRight size={13} className="mt-0.5 shrink-0 text-blue-400" />
                  <div>
                    <p className="text-[13px] font-medium text-slate-200">{feature.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Users */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Users size={16} className="text-blue-400" />
              <h4 className="font-display text-base font-semibold text-slate-100">Intended Users</h4>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {cs.users.map((user) => (
                <div key={user.role} className="border border-white/[0.04] bg-white/[0.015] p-3">
                  <p className="font-mono text-[11px] font-medium text-blue-400">{user.role}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{user.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detail sections */}
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title}>
                  <div className="mb-2.5 flex items-center gap-2">
                    <Icon size={14} className="text-blue-400" />
                    <h4 className="font-display text-sm font-semibold text-slate-200">{section.title}</h4>
                  </div>
                  <p className="ml-6 text-[13px] leading-[1.65] text-slate-500">{section.content}</p>
                  {section.extra && <div className="ml-6 mt-3">{section.extra}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [activeMockup, setActiveMockup] = useState<MockupVariant>("dashboard");

  useEffect(() => {
    document.body.style.overflow = caseStudyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [caseStudyOpen]);

  const goNext = () => {
    setActiveMockup((prev) => {
      const idx = mockupVariants.indexOf(prev);
      return mockupVariants[(idx + 1) % mockupVariants.length];
    });
  };

  const goPrev = () => {
    setActiveMockup((prev) => {
      const idx = mockupVariants.indexOf(prev);
      return mockupVariants[(idx - 1 + mockupVariants.length) % mockupVariants.length];
    });
  };

  return (
    <section id="projects" className="relative section-padding overflow-x-hidden border-y border-white/[0.04] bg-[#0a0f1a]">
      <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden />
      <div className="absolute top-1/3 left-1/2 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/[0.02] blur-[120px]" aria-hidden />

      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          number="02"
          label="Selected Work"
          title="One project. Built with purpose."
        />

        {/* Project header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-blue-400">
              {trackProject.category}
            </span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
            {trackProject.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-slate-500">
            {trackProject.expandedName}
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.65] text-slate-400">
            {trackProject.description}
          </p>
        </motion.div>

        {/* Carousel controls + counter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center justify-between gap-3"
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {mockupVariants.map((variant) => (
              <button
                key={variant}
                onClick={() => setActiveMockup(variant)}
                className={`relative border px-2.5 py-1 font-mono text-[10px] tracking-wide transition-all duration-200 focus-ring ${
                  activeMockup === variant
                    ? "border-blue-500/25 bg-blue-500/10 text-blue-400"
                    : "border-white/[0.06] text-slate-500 hover:border-white/10 hover:text-slate-400"
                }`}
              >
                {mockupLabels[variant]}
              </button>
            ))}
          </div>

          {/* Arrow controls + counter */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-600">
              {String(mockupVariants.indexOf(activeMockup) + 1).padStart(2, "0")} / {String(mockupVariants.length).padStart(2, "0")}
            </span>
            <div className="flex gap-1">
              <button
                onClick={goPrev}
                className="flex h-8 w-8 items-center justify-center border border-white/[0.06] text-slate-400 transition-colors hover:border-blue-500/20 hover:text-blue-400 focus-ring"
                aria-label="Previous preview"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                onClick={goNext}
                className="flex h-8 w-8 items-center justify-center border border-white/[0.06] text-slate-400 transition-colors hover:border-blue-500/20 hover:text-blue-400 focus-ring"
                aria-label="Next preview"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4"
        >
          <ProjectMockup variant={activeMockup} />
        </motion.div>

        {/* Features + tech + case study */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-7"
          >
            <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              Key Features
            </h3>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {trackProject.caseStudy.features.slice(0, 6).map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 border border-white/[0.04] bg-white/[0.015] px-3 py-2.5 transition-colors hover:border-blue-500/10"
                >
                  <ChevronRight size={13} className="mt-0.5 shrink-0 text-blue-400" />
                  <div>
                    <p className="text-[13px] font-medium text-slate-200">{feature.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            {/* Tech */}
            <div className="border border-white/[0.07] bg-[#0d1220]/40 p-4">
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[...trackProject.techStack, trackProject.databaseTech].map((tech) => (
                  <span key={tech} className="border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="mt-3 border border-white/[0.07] bg-[#0d1220]/40 p-4">
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                Details
              </h3>
              <div className="space-y-px">
                {[
                  { label: "Status", value: trackProject.caseStudy.status },
                  { label: "Institution", value: trackProject.institution },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between gap-3 py-2 border-b border-white/[0.03] last:border-0">
                    <span className="text-[13px] text-slate-500">{d.label}</span>
                    <span className="text-[13px] font-medium text-slate-200 text-right">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Case study button */}
            <button
              onClick={() => setCaseStudyOpen(true)}
              className="group mt-3 flex w-full items-center justify-center gap-2 border border-blue-500/25 bg-blue-500/[0.06] px-5 py-3 text-[13px] font-medium text-blue-400 transition-all duration-300 hover:bg-blue-500/10 hover:border-blue-500/30 active:scale-[0.98] focus-ring"
            >
              View Case Study
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={14} />
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {caseStudyOpen && <CaseStudyModal onClose={() => setCaseStudyOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
