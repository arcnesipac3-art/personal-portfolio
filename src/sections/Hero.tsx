import { useState, useRef, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { GithubIcon } from "../components/SocialIcons";
import { MagneticButton } from "../components/MagneticButton";
import { heroContent, personalInfo } from "../data/portfolio";
import { scrollToSection } from "../utils/scroll";
import { useIsDesktop, usePrefersReducedMotion } from "../hooks/useMediaQuery";

export function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

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
      className="relative min-h-screen overflow-hidden pt-24 pb-12 flex items-center"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div className="absolute inset-0 radial-glow" aria-hidden />
      <div ref={spotlightRef} className="absolute inset-0" aria-hidden />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-[#2878f0]/[0.025] blur-[120px]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080b12]" aria-hidden />

      {/* Floating dots with parallax */}
      <div ref={parallaxRef} className="absolute inset-0" aria-hidden>
        <div className="absolute left-[10%] top-[22%] h-1.5 w-1.5 rounded-full bg-[#2878f0]/10" />
        <div className="absolute right-[14%] top-[35%] h-1 w-1 rounded-full bg-[#38bdf8]/15" />
        <div className="absolute left-[18%] bottom-[28%] h-1 w-1 rounded-full bg-[#2878f0]/15" />
        <div className="absolute right-[10%] bottom-[32%] h-1.5 w-1.5 rounded-full bg-[#38bdf8]/10" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: text */}
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="font-mono text-[11px] tracking-[0.15em] text-[#2878f0]">
                {heroContent.label}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-display text-[2.25rem] font-bold leading-[1.05] tracking-tight text-[#f4f7fc] sm:text-5xl md:text-[3.5rem]"
            >
              Curious by nature.
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Building through code.
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 max-w-md text-[15px] leading-[1.65] text-[#9aa8bd]"
            >
              {heroContent.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <MagneticButton
                href={heroContent.ctaPrimary.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(heroContent.ctaPrimary.href);
                }}
                className="group gap-1.5 border border-[#192437] bg-[#0e1522] px-4 py-2 text-sm font-medium text-[#f4f7fc] hover:border-[#2878f0]/30 hover:bg-[#0e1522]/80 focus-ring rounded"
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
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#9aa8bd] transition-colors hover:text-[#2878f0] focus-ring rounded"
              >
                {heroContent.ctaSecondary.label}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={14} />
                </span>
              </a>
            </motion.div>

            {/* Meta info row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#192437] pt-5"
            >
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[13px] text-[#66758b] transition-colors hover:text-[#2878f0]"
              >
                <GithubIcon size={13} />
                GitHub
              </a>
              <span className="text-[#192437]">·</span>
              <span className="flex items-center gap-1.5 text-[13px] text-[#66758b]">
                <MapPin size={13} />
                {personalInfo.location}
              </span>
              <span className="text-[#192437]">·</span>
              <span className="flex items-center gap-1.5 text-[13px] text-[#66758b]">
                <Sparkles size={13} className="text-[#2878f0]/50" />
                <span className="font-mono text-[11px] text-[#2878f0]">
                  {personalInfo.currentlyLearning}
                </span>
              </span>
            </motion.div>
          </div>

          {/* Right: portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="group relative mx-auto max-w-sm lg:max-w-none">
              {/* Decorative offset border */}
              <div
                className="absolute -top-3 -left-3 right-6 bottom-6 border border-[#192437]"
                aria-hidden
              />
              {/* Dot accent */}
              <div
                className="absolute -top-5 -right-5 h-20 w-20 bg-dots opacity-30"
                aria-hidden
              />

              {/* Photo container */}
              <div
                ref={portraitRef}
                className="relative overflow-hidden border border-[#192437] shadow-2xl shadow-black/40 transition-transform duration-300 ease-out will-change-transform"
              >
                <div className="aspect-[4/5] w-full bg-gradient-to-br from-[#0c111c] to-[#080b12]">
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
                {/* Gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080b12]/25 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-60"
                  aria-hidden
                />
              </div>

              {/* Floating labels */}
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute -left-2 top-8 border border-[#192437] bg-[#080b12]/95 px-2 py-1 font-mono text-[8px] tracking-wider text-[#2878f0] backdrop-blur-sm transition-transform duration-300 group-hover:-translate-x-1 sm:-left-4"
              >
                REACT
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute -right-2 top-1/3 border border-[#192437] bg-[#080b12]/95 px-2 py-1 font-mono text-[8px] tracking-wider text-[#38bdf8] backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1 sm:-right-4"
              >
                TYPESCRIPT
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="absolute -left-2 bottom-12 border border-[#192437] bg-[#080b12]/95 px-2 py-1 font-mono text-[8px] tracking-wider text-[#2878f0] backdrop-blur-sm transition-transform duration-300 group-hover:-translate-x-1 sm:-left-4"
              >
                DJANGO
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -right-2 bottom-8 border border-[#192437] bg-[#080b12]/95 px-2 py-1 font-mono text-[8px] tracking-wider text-[#38bdf8] backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1 sm:-right-4"
              >
                PYTHON
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-6 w-px bg-gradient-to-b from-[#66758b] to-transparent"
        />
      </motion.div>
    </section>
  );
}
