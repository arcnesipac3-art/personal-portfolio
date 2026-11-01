import { useRef, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { GithubIcon } from "../components/SocialIcons";
import { MagneticButton } from "../components/MagneticButton";
import { heroContent, personalInfo } from "../data/portfolio";
import { scrollToSection } from "../utils/scroll";
import { useIsDesktop, usePrefersReducedMotion } from "../hooks/useMediaQuery";

type MotionTarget = Record<string, number | string>;

interface RevealProps {
  initial: MotionTarget | false;
  animate: MotionTarget;
  transition?: { duration: number; delay?: number; ease: [number, number, number, number] };
}

const SETTLED: MotionTarget = { opacity: 1, y: 0 };
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Tech tags that float around the portrait — the only chrome on the photo. */
const FLOATING_TAGS = [
  { label: "REACT", tone: "text-[#2878f0]", position: "top-8 -left-2 sm:-left-4", from: -6, drift: "group-hover:-translate-x-1" },
  { label: "TYPESCRIPT", tone: "text-[#38bdf8]", position: "top-1/3 -right-2 sm:-right-4", from: 6, drift: "group-hover:translate-x-1" },
  { label: "DJANGO", tone: "text-[#2878f0]", position: "bottom-12 -left-2 sm:-left-4", from: -6, drift: "group-hover:-translate-x-1" },
  { label: "PYTHON", tone: "text-[#38bdf8]", position: "bottom-8 -right-2 sm:-right-4", from: 6, drift: "group-hover:translate-x-1" },
];

interface HeroProps {
  /** False while the intro overlay is on screen, holding the entrance stagger. */
  introDone?: boolean;
}

export function Hero({ introDone = true }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  /**
   * Entrance props for a single staggered item. Targets stay pinned to their
   * start values until the intro curtain clears, so the stagger begins the
   * moment the reveal happens instead of playing hidden behind the overlay.
   * Reduced-motion visitors skip straight to the settled state — Motion does
   * not honour `prefers-reduced-motion` on its own.
   */
  const reveal = (
    delay: number,
    from: MotionTarget,
    to: MotionTarget = SETTLED,
    duration = 0.5
  ): RevealProps => {
    if (prefersReducedMotion) return { initial: false, animate: to };
    return {
      initial: from,
      animate: introDone ? to : from,
      transition: { duration, delay, ease: EASE },
    };
  };

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!isDesktop || prefersReducedMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(320px circle at ${x}px ${y}px, rgba(40, 120, 240, 0.04), transparent 70%)`;
    }

    const cx = (x / rect.width - 0.5) * 2;
    const cy = (y / rect.height - 0.5) * 2;

    if (parallaxRef.current) {
      parallaxRef.current.style.transform = `translate(${cx * 5}px, ${cy * 5}px)`;
    }

    if (portraitRef.current) {
      portraitRef.current.style.transform = `perspective(900px) rotateX(${-cy * 4}deg) rotateY(${cx * 5}deg)`;
    }
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) spotlightRef.current.style.background = "";
    if (parallaxRef.current) parallaxRef.current.style.transform = "";
    if (portraitRef.current) portraitRef.current.style.transform = "";
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20 sm:pt-32"
    >
      {/* ── Background layers ─────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000,transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 radial-glow" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_65%_50%_at_50%_0%,rgba(40,120,240,0.07),transparent_70%)]"
        aria-hidden
      />
      <div ref={spotlightRef} className="absolute inset-0" aria-hidden />

      {/* Thin technical markers */}
      <div
        className="pointer-events-none absolute right-[6%] top-[18%] hidden h-3 w-3 lg:block"
        aria-hidden
      >
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/[0.1]" />
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/[0.1]" />
      </div>
      <div
        className="pointer-events-none absolute bottom-[16%] left-[4%] hidden h-3 w-3 xl:block"
        aria-hidden
      >
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/[0.08]" />
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/[0.08]" />
      </div>

      {/* Floating dots with parallax */}
      <div ref={parallaxRef} className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-[10%] top-[22%] h-1.5 w-1.5 rounded-full bg-[#2878f0]/10" />
        <div className="absolute right-[14%] top-[35%] h-1 w-1 rounded-full bg-[#38bdf8]/15" />
        <div className="absolute left-[18%] bottom-[28%] h-1 w-1 rounded-full bg-[#2878f0]/15" />
        <div className="absolute right-[10%] bottom-[32%] h-1.5 w-1.5 rounded-full bg-[#38bdf8]/10" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080b12]" aria-hidden />

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 xl:gap-20">
          {/* Left: text */}
          <div>
            {/* Label */}
            <motion.div {...reveal(0.1, { opacity: 0, y: 12 })} className="flex items-center gap-3">
              <span
                className="h-px w-8 bg-gradient-to-r from-[#2878f0] to-transparent"
                aria-hidden
              />
              <span className="font-mono text-[11px] tracking-[0.15em] text-[#2878f0]">
                {heroContent.label}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...reveal(0.15, { opacity: 0, y: 14 }, SETTLED, 0.6)}
              className="mt-5 font-display text-[clamp(2rem,3.6vw,3.4rem)] font-bold leading-[1.05] tracking-tight text-[#f4f7fc]"
            >
              Curious by nature.
              <motion.span
                {...reveal(0.3, { opacity: 0, y: 14 }, SETTLED, 0.6)}
                className="block"
              >
                Building through <span className="text-[#2878f0]">code.</span>
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              {...reveal(0.4, { opacity: 0, y: 12 })}
              className="mt-6 max-w-[34rem] text-[15px] leading-[1.75] text-[#9aa8bd]"
            >
              {heroContent.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...reveal(0.5, { opacity: 0, y: 12 })}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <MagneticButton
                href={heroContent.ctaPrimary.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(heroContent.ctaPrimary.href);
                }}
                className="group gap-2 rounded border border-[#2878f0]/40 bg-[#2878f0]/10 px-5 py-2.5 text-sm font-medium text-[#f4f7fc] hover:border-[#2878f0]/70 hover:bg-[#2878f0]/[0.18] hover:shadow-[0_10px_30px_-16px_rgba(40,120,240,0.9)] focus-ring"
              >
                {heroContent.ctaPrimary.label}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={14} />
                </span>
              </MagneticButton>
              <a
                href={heroContent.ctaSecondary.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(heroContent.ctaSecondary.href);
                }}
                className="group inline-flex items-center gap-2 rounded border border-white/[0.08] px-5 py-2.5 text-sm font-medium text-[#9aa8bd] transition-colors duration-300 hover:border-white/[0.18] hover:text-[#f4f7fc] focus-ring"
              >
                {heroContent.ctaSecondary.label}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={14} />
                </span>
              </a>
            </motion.div>

            {/* Meta info row */}
            <motion.div
              {...reveal(0.6, { opacity: 0, y: 12 })}
              className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#192437] pt-6"
            >
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded text-[13px] text-[#66758b] transition-colors duration-300 hover:text-[#2878f0]"
              >
                <GithubIcon size={13} className="shrink-0" />
                GitHub
              </a>
              <span className="hidden h-3.5 w-px bg-white/[0.08] sm:block" aria-hidden />
              <span className="flex items-center gap-2 text-[13px] text-[#66758b]">
                <MapPin size={13} className="shrink-0" />
                {personalInfo.location}
              </span>
              <span className="hidden h-3.5 w-px bg-white/[0.08] sm:block" aria-hidden />
              <span className="flex items-center gap-2 text-[13px] text-[#66758b]">
                <Sparkles size={13} className="shrink-0 text-[#2878f0]/60" />
                <span className="font-mono text-[11px] text-[#2878f0]">
                  {personalInfo.currentlyLearning}
                </span>
              </span>
            </motion.div>
          </div>

          {/* Right: portrait */}
          <motion.div
            {...reveal(0.2, { opacity: 0, scale: 0.96, x: 16 }, { opacity: 1, scale: 1, x: 0 }, 0.8)}
            className="relative"
          >
            <div className="group relative mx-auto w-full max-w-sm lg:max-w-[28rem]">
              {/* Radial lighting behind the portrait */}
              <div
                className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(40,120,240,0.12),transparent_65%)] blur-2xl"
                aria-hidden
              />

              {/* Offset frame + corner brackets */}
              <div
                className="pointer-events-none absolute -bottom-7 -right-7 h-24 w-24 bg-dots opacity-30"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -inset-4 border border-white/[0.05]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -left-4 -top-4 h-8 w-8 border-l border-t border-[#2878f0]/40"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-4 -right-4 h-8 w-8 border-b border-r border-[#2878f0]/40"
                aria-hidden
              />

              {/* Photo */}
              <div
                ref={portraitRef}
                className="relative overflow-hidden border border-white/[0.08] bg-[#0c111c] shadow-[0_40px_90px_-50px_rgba(0,0,0,0.95)] transition-transform duration-300 ease-out will-change-transform"
              >
                <div className="aspect-[7/8] w-full">
                  {!imageFailed && (
                    <img
                      src="/images/profile.jpg"
                      alt="Portrait of Arc Aaron R. Capisen, student developer"
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                        imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                      }`}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageFailed(true)}
                    />
                  )}
                  {!imageLoaded && (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-5xl font-bold text-[#192437]">
                        {personalInfo.monogram}
                      </span>
                    </div>
                  )}
                </div>

                {/* Blue rim light */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#2878f0]/[0.12] via-transparent to-[#38bdf8]/10"
                  aria-hidden
                />
                {/* Base fade */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#080b12]/70 via-[#080b12]/20 to-transparent transition-opacity duration-500 group-hover:opacity-60"
                  aria-hidden
                />
                {/* Inner hairline */}
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.04]"
                  aria-hidden
                />
              </div>

              {/* Floating tech labels */}
              {FLOATING_TAGS.map((tag, i) => (
                <motion.span
                  key={tag.label}
                  {...reveal(0.5 + i * 0.1, { opacity: 0, x: tag.from }, { opacity: 1, x: 0 }, 0.4)}
                  className={`absolute ${tag.position} border border-white/[0.08] bg-[#080b12]/90 px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] backdrop-blur-sm transition-[translate] duration-300 ${tag.tone} ${tag.drift}`}
                >
                  {tag.label}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: introDone || prefersReducedMotion ? 1 : 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1, duration: 0.5 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-6 w-px bg-gradient-to-b from-[#66758b] to-transparent"
        />
      </motion.div>
    </section>
  );
}
