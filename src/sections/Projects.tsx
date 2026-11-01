import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
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
  ListChecks,
  FileCheck,
  BellRing,
  CalendarCheck,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { trackProject, type ProjectFeature } from "../data/portfolio";

const EASE = [0.22, 1, 0.36, 1] as const;

/** One icon per documented feature — no feature is added or invented here. */
const featureIcons: Record<string, LucideIcon> = {
  "Student Requirements Tracking": ListChecks,
  "Requirement Submission Monitoring": FileCheck,
  "Incomplete Requirement Reminders": BellRing,
  "Attendance Monitoring": CalendarCheck,
  "Teacher Attendance Encoding": ClipboardList,
  "Parent Access to Student Attendance": Users,
};

function CaseStudyModal({ onClose }: { onClose: () => void }) {
  const cs = trackProject.caseStudy;
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    const closeBtn = modalRef.current?.querySelector("[aria-label='Close case study']") as HTMLElement;
    closeBtn?.focus();
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock background scrolling while the dialog is open. The previous values are
  // restored on close so overlapping locks can't clobber one another, and the
  // scrollbar width is padded back in to stop the page shifting sideways.
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

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

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080b14]/85 backdrop-blur-md p-3 sm:p-6 lg:p-10"
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
        transition={{ duration: 0.3, ease: EASE }}
        className="relative flex max-h-full w-full max-w-3xl flex-col border border-white/[0.08] bg-[#0a0f1a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — static, so it stays welded to the card instead of detaching
            from it the way a `sticky top-0` element does inside a padded scroller. */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0a0f1a] px-5 py-3.5">
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

        {/* Body — the only part that scrolls, so the header never moves. */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-7 sm:px-8">
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
    </motion.div>,
    // Portalled to <body> so the fixed overlay isn't trapped by the clipped
    // ancestor (`<main>` uses `overflow-x: clip`), which would otherwise
    // anchor the dialog to the page top instead of the viewport.
    document.body
  );
}

/** Faint eyebrow label with a hairline running to the edge of the column. */
function ColumnLabel({ children, count }: { children: string; count?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a5768]">
        {children}
      </span>
      <span className="h-px flex-1 bg-white/[0.06]" aria-hidden />
      {count && <span className="shrink-0 font-mono text-[10px] text-[#3d4a5c]">{count}</span>}
    </div>
  );
}

function FeatureCard({
  feature,
  index,
  reduceMotion,
}: {
  feature: ProjectFeature;
  index: number;
  reduceMotion: boolean;
}) {
  const Icon = featureIcons[feature.title] ?? CircleDot;

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{
        duration: 0.4,
        delay: reduceMotion ? 0 : Math.floor(index / 2) * 0.06 + (index % 2) * 0.05,
        ease: EASE,
      }}
      className="h-full"
    >
      {/* Lift sits on a plain child so it never fights Motion's transform. */}
      <div className="group flex h-full items-start gap-3.5 border border-white/[0.07] bg-[#0d1220]/30 p-4 transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-[#2878f0]/25 hover:bg-[#0d1220]/50 sm:p-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#2878f0]/15 bg-[#2878f0]/[0.04] transition-colors duration-300 group-hover:border-[#2878f0]/35">
          <Icon size={14} className="text-[#2878f0]" />
        </span>
        <span className="min-w-0">
          <span className="block text-[13.5px] font-medium text-[#dbe3ee] transition-colors duration-300 group-hover:text-[#f4f7fc]">
            {feature.title}
          </span>
          <span className="mt-1 block text-[12px] leading-relaxed text-[#66758b] transition-colors duration-300 group-hover:text-[#8b9ab1]">
            {feature.description}
          </span>
        </span>
      </div>
    </motion.li>
  );
}

export function Projects() {
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const features = trackProject.caseStudy.features.slice(0, 6);
  const stack = [...trackProject.techStack, trackProject.databaseTech];

  const rise = (delay: number) => ({
    initial: reduceMotion ? (false as const) : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -15% 0px" as const },
    transition: { duration: 0.5, delay: reduceMotion ? 0 : delay, ease: EASE },
  });

  return (
    <section id="projects" className="relative section-padding overflow-x-clip border-y border-white/[0.04] bg-[#0a0f1a]/80">
      <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/[0.02] blur-[120px]" aria-hidden />

      <div className="shell relative z-10">
        <SectionHeading
          number="02"
          label="Selected Work"
          title="One project. Built with purpose."
        />

        {/* Project information + mark */}
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-12 lg:gap-12">
          <motion.div {...rise(0)} className="min-w-0 lg:col-span-7">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 bg-[#2878f0]" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#2878f0]">
                {trackProject.category}
              </span>
            </div>

            <h3 className="mt-5 font-display text-2xl font-bold leading-[1.1] tracking-tight text-[#f4f7fc] sm:text-3xl">
              {trackProject.name}
            </h3>
            <p className="mt-2.5 max-w-lg font-mono text-[11.5px] leading-relaxed text-[#66758b]">
              {trackProject.expandedName}
            </p>

            <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-[#8b9ab1]">
              {trackProject.description}
            </p>

            <div className="mt-9 max-w-xl">
              <ColumnLabel count={String(stack.length)}>Built with</ColumnLabel>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {stack.map((tech) => (
                  <li
                    key={tech}
                    className="border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-[#8b9ab1] transition-colors duration-300 hover:border-[#2878f0]/30 hover:text-[#2878f0]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9">
              <button
                onClick={() => setCaseStudyOpen(true)}
                className="group inline-flex w-full items-center justify-center gap-2.5 border border-[#2878f0]/35 bg-[#2878f0]/[0.07] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f4f7fc] transition-[background-color,border-color,transform] duration-300 hover:border-[#2878f0]/70 hover:bg-[#2878f0]/[0.14] active:scale-[0.98] focus-ring sm:w-auto"
              >
                View Case Study
                <ArrowUpRight
                  size={13}
                  className="text-[#2878f0] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </motion.div>

          <motion.div {...rise(0.08)} className="min-w-0 lg:col-span-5">
            {/* The mark itself is untouched — only its frame is tightened. */}
            <div className="relative border border-white/[0.08] bg-[#0d1220]/40 p-6 sm:p-7">
              <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-10" aria-hidden />
              <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[#2878f0]/30" aria-hidden />
              <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#2878f0]/30" aria-hidden />

              <img
                src="/images/track-logo.png"
                width={772}
                height={259}
                alt={`${trackProject.name} — ${trackProject.category}`}
                decoding="async"
                className="relative z-10 block w-full object-contain"
              />
            </div>

            {/* Project details */}
            <div className="mt-3 border border-white/[0.07] bg-[#0d1220]/40 p-5">
              <ColumnLabel>Details</ColumnLabel>
              <dl className="mt-4 divide-y divide-white/[0.04] border-t border-white/[0.05]">
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#4a5768]">
                    Status
                  </dt>
                  <dd className="inline-flex items-center gap-2 text-[13px] font-medium text-[#dbe3ee]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#38bdf8]" aria-hidden />
                    {trackProject.caseStudy.status}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[#4a5768]">
                    Institution
                  </dt>
                  <dd className="max-w-[70%] text-right text-[13px] leading-snug text-[#dbe3ee]">
                    {trackProject.institution}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>

        {/* Key features */}
        <motion.div {...rise(0.05)} className="mt-14">
          <ColumnLabel count={String(features.length).padStart(2, "0")}>
            Key Features
          </ColumnLabel>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={i}
                reduceMotion={reduceMotion}
              />
            ))}
          </ul>
        </motion.div>
      </div>

      <AnimatePresence>
        {caseStudyOpen && <CaseStudyModal onClose={() => setCaseStudyOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
