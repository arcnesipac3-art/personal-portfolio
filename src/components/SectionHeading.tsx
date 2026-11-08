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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      <div
        className={`flex items-center gap-2.5 mb-3.5 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="font-mono text-xs text-text-muted">{number}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
          {label}
        </span>
      </div>

      <h2
        className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-[2.75rem]"
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 text-[15px] leading-relaxed text-text-muted sm:text-base ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
