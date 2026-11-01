import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { GithubIcon, InstagramIcon, FacebookIcon } from "../components/SocialIcons";
import { contactContent, personalInfo } from "../data/portfolio";

const socials = [
  { label: "GitHub", href: personalInfo.github, Icon: GithubIcon },
  { label: "Instagram", href: personalInfo.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: personalInfo.facebook, Icon: FacebookIcon },
];

/** Drops the protocol, `www.`, and any trailing slash so links read as handles. */
const prettyUrl = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const mailto = `mailto:${personalInfo.email}`;

/** Faint label with a hairline that runs to the edge of the panel. */
function Rule({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        {children}
      </span>
      <span className="h-px flex-1 bg-white/6" aria-hidden />
    </div>
  );
}

function EmailCard({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <div className="group relative border border-blue/30 bg-blue/6 transition-colors duration-300 hover:border-blue/55 hover:bg-blue/9">
      <span className="absolute left-0 top-0 h-full w-px bg-blue" aria-hidden />

      <div className="flex items-center gap-3 p-4 sm:gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-blue/25 bg-[#0a0f1a]">
          <Mail size={15} className="text-blue" />
        </span>

        <div className="min-w-0 flex-1">
          {/* Doubles as the copy confirmation, so nothing shifts on click. */}
          <p
            role="status"
            aria-live="polite"
            className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
              copied ? "text-emerald-400" : "text-text-muted"
            }`}
          >
            {copied ? "Copied to clipboard" : "Email — primary"}
          </p>
          <a
            href={mailto}
            title={`Email ${personalInfo.email}`}
            className="mt-1 block truncate text-[15px] font-medium text-text-primary transition-colors duration-300 hover:text-blue focus-ring"
          >
            {personalInfo.email}
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy email address"
            className={`flex h-8 w-8 items-center justify-center border transition-colors duration-300 focus-ring ${
              copied
                ? "border-emerald-500/30 text-emerald-400"
                : "border-white/8 text-[#8b9ab1] hover:border-blue/35 hover:text-blue"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>

          <a
            href={mailto}
            aria-label={`Compose an email to ${personalInfo.name}`}
            className="flex h-8 w-8 items-center justify-center border border-white/8 text-[#8b9ab1] transition-colors duration-300 hover:border-blue/35 hover:text-blue focus-ring"
          >
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

function SocialRow({ label, href, Icon }: (typeof socials)[number]) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        title={prettyUrl(href)}
        className="group flex items-center gap-3 px-4 py-3.5 transition-colors duration-300 hover:bg-white/2 focus-ring"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/6 bg-[#0a0f1a] transition-colors duration-300 group-hover:border-blue/30">
          <Icon size={15} className="text-[#8b9ab1] transition-colors duration-300 group-hover:text-blue" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a5768]">
            {label}
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-[#8b9ab1] transition-colors duration-300 group-hover:text-text-primary">
            {prettyUrl(href)}
          </span>
        </span>

        <ArrowUpRight
          size={14}
          className="shrink-0 text-[#3d4a5c] transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue"
        />
      </a>
    </li>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = personalInfo.email;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* clipboard unavailable — the address is still visible and mailto works */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rise = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -15% 0px" as const },
    transition: { duration: 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="contact" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden />
      <div
        className="absolute bottom-0 left-1/2 h-64 w-125 -translate-x-1/2 rounded-full bg-blue-500/3 blur-[100px]"
        aria-hidden
      />

      <div className="shell relative z-10">
        <div className="grid gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-12 lg:gap-12">
          {/* ── Introduction ─────────────────────────────────────── */}
          <motion.div {...rise(0)} className="min-w-0 lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-text-muted">06</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
                Contact
              </span>
            </div>

            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl lg:text-[2.6rem]">
              {contactContent.heading}
            </h2>

            <span
              className="mt-6 block h-px w-24 bg-linear-to-r from-blue via-blue/50 to-transparent"
              aria-hidden
            />

            <p className="mt-6 inline-flex items-center gap-2 border border-cyan/20 bg-cyan/4 px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">
                {contactContent.availability}
              </span>
            </p>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-text-muted">
              {contactContent.description}
            </p>

            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[#8b9ab1]">
              {contactContent.supporting}
            </p>

            <div className="mt-8">
              <a
                href={mailto}
                className="group inline-flex w-full items-center justify-center gap-2.5 border border-blue/40 bg-blue/7 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-primary transition-colors duration-300 hover:border-blue/70 hover:bg-blue/13 focus-ring sm:w-auto"
              >
                {contactContent.ctaLabel}
                <ArrowUpRight
                  size={13}
                  className="text-blue transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-[#4a5768]">
                {contactContent.ctaSupporting}
              </p>
            </div>
          </motion.div>

          {/* ── Contact panel ────────────────────────────────────── */}
          <motion.div {...rise(0.08)} className="relative min-w-0 lg:col-span-7">
            <div
              className="pointer-events-none absolute -inset-x-6 -bottom-12 -top-10 bg-[radial-gradient(ellipse_60%_55%_at_70%_15%,rgba(40,120,240,0.10),transparent_70%)]"
              aria-hidden
            />

            <div className="relative">
              <Rule>Direct channels</Rule>

              <div className="mt-5">
                <EmailCard copied={copied} onCopy={handleCopyEmail} />
              </div>

              <div className="mt-6">
                <Rule>Elsewhere</Rule>
              </div>

              <ul className="mt-2.5 divide-y divide-white/5 border border-white/7">
                {socials.map((social) => (
                  <SocialRow key={social.label} {...social} />
                ))}
              </ul>

              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#3d4a5c]">
                {socials.length + 1} channels · no forms
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
