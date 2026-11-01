import { ArrowUp } from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import { personalInfo, navLinks } from "../data/portfolio";
import { scrollToSection } from "../utils/scroll";

export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-[#192437] bg-[#080b12] px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Left: name + tagline */}
          <div className="text-center sm:text-left">
            <p className="font-display text-sm font-semibold text-[#f4f7fc]">
              {personalInfo.name}
            </p>
            <p className="mt-0.5 text-xs text-[#66758b]">{personalInfo.footerTagline}</p>
          </div>

          {/* Center: nav shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-xs text-[#66758b] transition-colors hover:text-[#2878f0]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: social + back to top */}
          <div className="flex items-center gap-4">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="text-[#66758b] transition-colors hover:text-[#2878f0]"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              aria-label="Send email"
              className="font-mono text-xs text-[#66758b] transition-colors hover:text-[#2878f0]"
            >
              Email
            </a>
            <span className="h-3.5 w-px bg-[#192437]" />
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 text-xs text-[#66758b] transition-colors hover:text-[#2878f0] focus-ring rounded"
              aria-label="Scroll back to top"
            >
              Top
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#192437] transition-all group-hover:border-[#2878f0]/40 group-hover:bg-[#2878f0]/5">
                <ArrowUp size={11} className="transition-transform group-hover:-translate-y-0.5" />
              </span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-[#192437] pt-4 text-center sm:text-left">
          <p className="text-[11px] text-[#66758b]">
            © {year} {personalInfo.name}. Built with curiosity.
          </p>
        </div>
      </div>
    </footer>
  );
}
