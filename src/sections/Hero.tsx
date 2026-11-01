import { useState, useRef, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { GithubIcon } from "../components/SocialIcons";
import { heroContent, personalInfo } from "../data/portfolio";
import { useIsDesktop, usePrefersReducedMotion } from "../hooks/useMediaQuery";

export function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!isDesktop || prefersReducedMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.05), transparent 70%)`;
    }

    if (parallaxRef.current) {
      const cx = (x / rect.width - 0.5) * 2;
      const cy = (y / rect.height - 0.5) * 2;
      parallaxRef.current.style.transform = `translate(${cx * 6}px, ${cy * 6}px)`;
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden pt-24 pb-12 flex items-center"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div className="absolute inset-0 radial-glow" aria-hidden />
      <div ref={spotlightRef} className="absolute inset-0" aria-hidden />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-blue-500/[0.03] blur-[120px]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080b14]" aria-hidden />

      {/* Floating dots with parallax */}
      <div ref={parallaxRef} className="absolute inset-0" aria-hidden>
        <div className="absolute left-[10%] top-[22%] h-1.5 w-1.5 rounded-full bg-blue-400/15" />
        <div className="absolute right-[14%] top-[35%] h-1 w-1 rounded-full bg-cyan-400/20" />
        <div className="absolute left-[18%] bottom-[28%] h-1 w-1 rounded-full bg-blue-400/20" />
        <div className="absolute right-[10%] bottom-[32%] h-1.5 w-1.5 rounded-full bg-cyan-400/10" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: text */}
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2.5"
            >
              <span className="font-mono text-[11px] tracking-[0.15em] text-blue-400">
                {heroContent.label}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-display text-[2.25rem] font-bold leading-[1.05] tracking-tight text-slate-50 sm:text-5xl md:text-6xl"
            >
              {"Curious by nature."}{" "}
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Building through code.
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 max-w-md text-[15px] leading-[1.65] text-slate-400"
            >
              {heroContent.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href={heroContent.ctaPrimary.href}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-200 transition-colors hover:text-blue-400 focus-ring rounded"
              >
                {heroContent.ctaPrimary.label}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={15} />
                </span>
              </a>
              <span className="text-slate-700">·</span>
              <a
                href={heroContent.ctaSecondary.href}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-200 transition-colors hover:text-blue-400 focus-ring rounded"
              >
                {heroContent.ctaSecondary.label}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={15} />
                </span>
              </a>
            </motion.div>

            {/* Meta info row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-5"
            >
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[13px] text-slate-500 transition-colors hover:text-blue-400"
              >
                <GithubIcon size={13} />
                GitHub
              </a>
              <span className="text-slate-700">·</span>
              <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                <MapPin size={13} />
                {personalInfo.location}
              </span>
              <span className="text-slate-700">·</span>
              <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                <Sparkles size={13} className="text-blue-400/60" />
                <span className="font-mono text-[11px] text-blue-400">
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
                className="absolute -top-3 -left-3 right-6 bottom-6 border border-white/[0.06]"
                aria-hidden
              />
              {/* Dot accent */}
              <div
                className="absolute -top-5 -right-5 h-20 w-20 bg-dots opacity-30"
                aria-hidden
              />

              {/* Photo container */}
              <div className="relative overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40 transition-transform duration-500 group-hover:scale-[1.005]">
                <div className="aspect-[4/5] w-full bg-gradient-to-br from-[#0d1220] to-[#080b14]">
                  {!imageFailed && (
                    <img
                      src="/images/profile.jpg"
                      alt="Portrait of Arc Aaron R. Capisen, student developer"
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                        imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                      }`}
                      loading="eager"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageFailed(true)}
                    />
                  )}
                  {!imageLoaded && (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-5xl font-bold text-slate-700">
                        {personalInfo.monogram}
                      </span>
                    </div>
                  )}
                </div>
                {/* Gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080b14]/30 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-60"
                  aria-hidden
                />
              </div>

              {/* Floating labels */}
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute -left-2 top-8 border border-white/[0.08] bg-[#080b14]/95 px-2 py-1 font-mono text-[8px] tracking-wider text-blue-400 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-x-1 sm:-left-4"
              >
                REACT
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute -right-2 top-1/3 border border-white/[0.08] bg-[#080b14]/95 px-2 py-1 font-mono text-[8px] tracking-wider text-cyan-400 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1 sm:-right-4"
              >
                TYPESCRIPT
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="absolute -left-2 bottom-12 border border-white/[0.08] bg-[#080b14]/95 px-2 py-1 font-mono text-[8px] tracking-wider text-blue-400 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-x-1 sm:-left-4"
              >
                DJANGO
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -right-2 bottom-8 border border-white/[0.08] bg-[#080b14]/95 px-2 py-1 font-mono text-[8px] tracking-wider text-cyan-400 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1 sm:-right-4"
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
          className="block h-6 w-px bg-gradient-to-b from-slate-600 to-transparent"
        />
      </motion.div>
    </section>
  );
}
