import { ArrowUp } from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import { personalInfo } from "../data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#080b14] px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Left: name + tagline */}
          <div className="text-center sm:text-left">
            <p className="font-display text-sm font-semibold text-slate-200">
              {personalInfo.name}
            </p>
            <p className="mt-0.5 text-xs text-slate-600">{personalInfo.footerTagline}</p>
          </div>

          {/* Right: social + back to top */}
          <div className="flex items-center gap-4">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="text-slate-500 transition-colors hover:text-blue-400"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              aria-label="Send email"
              className="font-mono text-xs text-slate-500 transition-colors hover:text-blue-400"
            >
              Email
            </a>
            <span className="h-3.5 w-px bg-white/10" />
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-blue-400 focus-ring rounded"
              aria-label="Scroll back to top"
            >
              Top
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 transition-all group-hover:border-blue-500/40 group-hover:bg-blue-500/5">
                <ArrowUp size={11} className="transition-transform group-hover:-translate-y-0.5" />
              </span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-white/[0.04] pt-4 text-center sm:text-left">
          <p className="text-[11px] text-slate-600">
            © {year} {personalInfo.name}. Built with curiosity.
          </p>
        </div>
      </div>
    </footer>
  );
}
