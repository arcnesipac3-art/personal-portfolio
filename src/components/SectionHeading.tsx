import { motion } from "motion/react";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  number: string;
  label: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  number,
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      {/* Section number / label row */}
      <div
        className={`flex items-center gap-3 mb-4 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="font-mono text-xs text-slate-600">{number}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>
      </div>

      <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 text-base leading-relaxed text-slate-500 sm:text-lg ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
