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
  { label: "REACT", tone: "text-blue", position: "top-8 -left-2 sm:-left-4", from: -6, drift: "group-hover:-translate-x-1" },
  { label: "TYPESCRIPT", tone: "text-cyan", position: "top-1/3 -right-2 sm:-right-4", from: 6, drift: "group-hover:translate-x-1" },
  { label: "DJANGO", tone: "text-blue", position: "bottom-12 -left-2 sm:-left-4", from: -6, drift: "group-hover:-translate-x-1" },
  { label: "PYTHON", tone: "text-cyan", position: "bottom-8 -right-2 sm:-right-4", from: 6, drift: "group-hover:translate-x-1" },
];

interface HeroProps {
  /** False while the intro overlay is on screen, holding the entrance stagger. */
  introDone?: boolean;
}

/**
 * The name is the first thing a visitor is likely to poke at, so it answers:
 * pointing at a letter lifts it and tints it blue while its two nearest
 * neighbours follow at reduced strength, so the word reacts as a group instead
 * of one character twitching alone. Each letter can also be dragged out of
 * place and springs back to its slot on release.
 *
 * The hover lift and the drag both want `transform`, so they live on separate
 * elements — the outer span is dragged, the inner one lifts.
 */
function InteractiveName({
  text,
  reduceMotion,
  draggable,
}: {
  text: string;
  reduceMotion: boolean;
  draggable: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const words = text.split(" ");

  return (
    <span
      aria-hidden
      className="flex flex-wrap gap-x-[0.24em]"
      onMouseLeave={() => setActive(null)}
    >
      {words.map((word, wordIndex) => {
        // Characters are indexed across the whole name so the falloff carries
        // across the word break rather than restarting at "Capisen".
        const offset = words.slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0);

        return (
          <span key={wordIndex} className="inline-flex whitespace-nowrap">
            {[...word].map((char, charIndex) => {
              const index = offset + charIndex;
              const distance = active === null ? Infinity : Math.abs(index - active);
              const lift = reduceMotion
                ? 0
                : distance === 0
                  ? 9
                  : distance === 1
                    ? 4.5
                    : distance === 2
                      ? 1.5
                      : 0;

              return (
                <motion.span
                  key={charIndex}
                  drag={draggable}
                  dragSnapToOrigin
                  dragMomentum={false}
                  dragTransition={{ bounceStiffness: 420, bounceDamping: 28 }}
                  whileDrag={{ scale: 1.18, zIndex: 30 }}
                  onMouseEnter={() => setActive(index)}
                  className="relative inline-block cursor-grab select-none active:cursor-grabbing"
                >
                  <span
                    className="inline-block transition-[transform,color,text-shadow] duration-300 ease-out"
                    style={{
                      transform: `translateY(-${lift}px)`,
                      color: distance === 0 ? "var(--color-blue)" : distance === 1 ? "var(--color-blue)" : undefined,
                      textShadow:
                        distance === 0 ? "0 0 30px rgba(40,120,240,0.45)" : undefined,
                    }}
                  >
                    {char}
                  </span>
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

export function Hero({ introDone = true }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Both draggable things here are gated the same way as the spotlight and the
  // parallax: Motion sets `touch-action: none` on anything it drags, which would
  // otherwise trap a finger that lands on it mid-scroll.
  const canDrag = isDesktop && !prefersReducedMotion;

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
        className="pointer-events-none absolute inset-0 bg-grid opacity-40 mask-[radial-gradient(ellipse_75%_65%_at_50%_45%,#000,transparent)]"
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
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
      </div>
      <div
        className="pointer-events-none absolute bottom-[16%] left-[4%] hidden h-3 w-3 xl:block"
        aria-hidden
      >
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/8" />
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/8" />
      </div>

      {/* Floating dots with parallax */}
      <div ref={parallaxRef} className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-[10%] top-[22%] h-1.5 w-1.5 rounded-full bg-blue/10" />
        <div className="absolute right-[14%] top-[35%] h-1 w-1 rounded-full bg-cyan/15" />
        <div className="absolute left-[18%] bottom-[28%] h-1 w-1 rounded-full bg-blue/15" />
        <div className="absolute right-[10%] bottom-[32%] h-1.5 w-1.5 rounded-full bg-cyan/10" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-bg" aria-hidden />

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="shell relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 xl:gap-20">
          {/* Left: text */}
          <div>
            {/* Label */}
            <motion.div {...reveal(0.1, { opacity: 0, y: 12 })} className="flex items-center gap-3">
              <span
                className="h-px w-8 bg-linear-to-r from-blue to-transparent"
                aria-hidden
              />
              <span className="font-mono text-[11px] tracking-[0.15em] text-blue">
                {heroContent.label}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              {...reveal(0.15, { opacity: 0, y: 14 }, SETTLED, 0.6)}
              className="mt-5 font-display text-[clamp(2.35rem,5.2vw,4rem)] font-bold leading-[1.02] tracking-tight text-text-primary"
            >
              <span className="sr-only">{heroContent.name}</span>
              <InteractiveName
                text={heroContent.name}
                reduceMotion={prefersReducedMotion}
                draggable={canDrag}
              />
            </motion.h1>

            {/* Headline */}
            <motion.p
              {...reveal(0.28, { opacity: 0, y: 12 }, SETTLED, 0.5)}
              className="mt-4 font-display text-[clamp(1.05rem,1.5vw,1.3rem)] font-medium leading-snug text-text-secondary"
            >
              Curious by nature. Building through <span className="text-blue">code.</span>
            </motion.p>

            {/* Description */}
            <motion.p
              {...reveal(0.4, { opacity: 0, y: 12 })}
              className="mt-6 max-w-136 text-[15px] leading-[1.75] text-text-secondary"
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
                className="group gap-2 rounded border border-blue/40 bg-blue/10 px-5 py-2.5 text-sm font-medium text-text-primary hover:border-blue/70 hover:bg-blue/18 hover:shadow-[0_10px_30px_-16px_rgba(40,120,240,0.9)] focus-ring"
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
                className="group inline-flex items-center gap-2 rounded border border-white/8 px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors duration-300 hover:border-white/18 hover:text-text-primary focus-ring"
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
              className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-6"
            >
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded text-[13px] text-text-muted transition-colors duration-300 hover:text-blue"
              >
                <GithubIcon size={13} className="shrink-0" />
                GitHub
              </a>
              <span className="hidden h-3.5 w-px bg-white/8 sm:block" aria-hidden />
              <span className="flex items-center gap-2 text-[13px] text-text-muted">
                <MapPin size={13} className="shrink-0" />
                {personalInfo.location}
              </span>
              <span className="hidden h-3.5 w-px bg-white/8 sm:block" aria-hidden />
              <span className="flex items-center gap-2 text-[13px] text-text-muted">
                <Sparkles size={13} className="shrink-0 text-blue/60" />
                <span className="font-mono text-[11px] text-blue">
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
            <div className="group relative mx-auto w-full max-w-sm lg:max-w-md">
              {/* Radial lighting behind the portrait */}
              <div
                className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(40,120,240,0.12),transparent_65%)] blur-2xl"
                aria-hidden
              />

              {/* Frame + mark as one draggable unit, so the whole framed print
                  can be picked up and springs back into place on release. */}
              <motion.div
                drag={canDrag}
                dragSnapToOrigin
                dragMomentum={false}
                dragTransition={{ bounceStiffness: 340, bounceDamping: 26 }}
                whileDrag={{ scale: 1.02 }}
                className="relative cursor-grab select-none active:cursor-grabbing"
              >
                <div
                  className="pointer-events-none absolute -bottom-7 -right-7 h-24 w-24 bg-dots opacity-30"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -inset-4 border border-white/5"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -left-4 -top-4 h-8 w-8 border-l border-t border-blue/40"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-4 -right-4 h-8 w-8 border-b border-r border-blue/40"
                  aria-hidden
                />

                {/* The pointer tilt is written straight to this node's transform,
                    so it has to sit on its own layer — the drag would otherwise
                    overwrite it on every frame. */}
                <div
                  ref={portraitRef}
                  className="relative overflow-hidden border border-white/8 bg-bg-secondary shadow-[0_40px_90px_-50px_var(--shadow)] transition-transform duration-300 ease-out will-change-transform"
                >
                  <div className="aspect-7/8 w-full">
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
                        <span className="font-display text-5xl font-bold text-border">
                          {personalInfo.monogram}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Blue rim light */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-tr from-blue/12 via-transparent to-cyan/10"
                    aria-hidden
                  />
                  {/* Base fade */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-bg/70 via-bg/20 to-transparent transition-opacity duration-500 group-hover:opacity-60"
                    aria-hidden
                  />
                  {/* Inner hairline */}
                  <div
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/4"
                    aria-hidden
                  />
                </div>
              </motion.div>

              {/* Floating tech labels */}
              {FLOATING_TAGS.map((tag, i) => (
                <motion.span
                  key={tag.label}
                  {...reveal(0.5 + i * 0.1, { opacity: 0, x: tag.from }, { opacity: 1, x: 0 }, 0.4)}
                  className={`absolute ${tag.position} border border-white/8 bg-bg/90 px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] backdrop-blur-sm transition-[translate] duration-300 ${tag.tone} ${tag.drift}`}
                >
                  {tag.label}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator. A mouse outline with a wheel sliding down it, plus a
          label — the old single gradient faded to transparent over 24px and
          read as nothing at all against the page. Held back until the hero's
          own stagger has settled (~1.3s) so it does not compete with the name
          and the floating tags for attention. */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: introDone || prefersReducedMotion ? 1 : 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.9, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5"
        aria-hidden
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/18">
          <motion.span
            animate={prefersReducedMotion ? undefined : { y: [0, 9, 0], opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="mt-2 h-1.5 w-0.75 rounded-full bg-blue"
          />
        </span>

        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
