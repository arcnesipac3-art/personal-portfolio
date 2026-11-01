import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Send, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";
import { GithubIcon } from "../components/SocialIcons";
import { SectionHeading } from "../components/SectionHeading";
import { contactContent, personalInfo } from "../data/portfolio";

type FormStatus = "idle" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [copied, setCopied] = useState(false);

  const validate = (data: FormData) => {
    const errs: typeof errors = {};
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();

    if (!name) errs.name = "Please enter your name";
    if (!email) errs.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email";
    if (!message) errs.message = "Please enter a message";

    return errs;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs = validate(data);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setStatus("error");
      return;
    }

    const name = (data.get("name") as string).trim();
    const email = (data.get("email") as string).trim();
    const message = (data.get("message") as string).trim();

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;

    setErrors({});
    setStatus("success");
    form.reset();
    setTimeout(() => setStatus("idle"), 5000);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = personalInfo.email;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* ignore */ }
      document.body.removeChild(ta);
    }
  };

  return (
    <section id="contact" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden />
      <div className="absolute bottom-0 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-blue-500/[0.03] blur-[100px]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          number="07"
          label="Contact"
          title={contactContent.heading}
          description={contactContent.description}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: direct contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Email — primary CTA */}
            <a
              href={`mailto:${personalInfo.email}`}
              className="group flex items-center justify-between border border-white/[0.07] bg-[#0d1220]/30 p-4 transition-colors hover:border-blue-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Email me</span>
                <span className="text-[14px] font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                  {personalInfo.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.preventDefault(); handleCopyEmail(); }}
                  className="flex h-7 w-7 items-center justify-center border border-white/[0.06] text-slate-400 transition-all hover:border-blue-500/20 hover:text-blue-400 active:scale-90 focus-ring"
                  aria-label="Copy email address"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
                <ArrowUpRight size={14} className="text-slate-600 transition-colors group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>

            {/* GitHub */}
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="group mt-2 flex items-center justify-between border border-white/[0.07] bg-[#0d1220]/30 p-4 transition-colors hover:border-blue-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">GitHub</span>
                <span className="text-[14px] font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                  {personalInfo.github.replace("https://", "")}
                </span>
              </div>
              <GithubIcon size={14} className="text-slate-600 transition-colors group-hover:text-blue-400" />
            </a>

            {/* Copy feedback */}
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                aria-live="polite"
                className="mt-2 flex items-center gap-1.5 border border-emerald-500/15 bg-emerald-500/[0.04] px-3 py-1.5 text-[12px] text-emerald-400"
              >
                <Check size={11} /> Email copied to clipboard
              </motion.div>
            )}
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="border border-white/[0.07] bg-[#0d1220]/30 p-5 sm:p-6"
              noValidate
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-slate-600">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    className="w-full border border-white/[0.07] bg-[#080b14] px-3.5 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-600 transition-colors focus:border-blue-500/40 focus:outline-none"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                      <AlertCircle size={10} /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-slate-600">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="w-full border border-white/[0.07] bg-[#080b14] px-3.5 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-600 transition-colors focus:border-blue-500/40 focus:outline-none"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                      <AlertCircle size={10} /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-slate-600">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell me about your idea or project..."
                    className="w-full resize-none border border-white/[0.07] bg-[#080b14] px-3.5 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-600 transition-colors focus:border-blue-500/40 focus:outline-none"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                      <AlertCircle size={10} /> {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-1.5 bg-blue-600 px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.97] focus-ring"
                  >
                    <span className="transition-transform group-hover:translate-x-0.5">
                      <Send size={13} />
                    </span>
                    Send Message
                  </button>

                  {status === "success" && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      role="status"
                      aria-live="polite"
                      className="flex items-center gap-1.5 text-[12px] text-emerald-400"
                    >
                      <CheckCircle2 size={13} /> Opening your email app
                    </motion.span>
                  )}
                  {status === "error" && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      role="alert"
                      className="flex items-center gap-1.5 text-[12px] text-rose-400"
                    >
                      <AlertCircle size={13} /> Fix errors above
                    </motion.span>
                  )}
                </div>

                <p className="border-t border-white/[0.04] pt-3 text-[11px] text-slate-600">
                  Send Message opens your email app with your message pre-filled. Prefer to write
                  directly? Use the address above.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
