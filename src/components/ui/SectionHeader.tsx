"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";

type Tone = "dark" | "ivory" | "red" | "gold";
type Props = { index: string; eyebrow: string; title: React.ReactNode; lede?: string; tone?: Tone };

const tag: Record<Tone, string> = {
  dark: "bg-red text-white shadow-[4px_4px_0_0_var(--gold)]",
  ivory: "bg-red text-white shadow-[4px_4px_0_0_var(--ink)]",
  red: "bg-ink text-ivory shadow-[4px_4px_0_0_var(--gold)]",
  gold: "bg-ink text-ivory shadow-[4px_4px_0_0_var(--red)]",
};
const rule: Record<Tone, string> = { dark: "bg-gold", ivory: "bg-ink", red: "bg-ink", gold: "bg-ink" };
const titleColor: Record<Tone, string> = { dark: "text-text", ivory: "text-ink", red: "text-white", gold: "text-ink" };
const ledeColor: Record<Tone, string> = { dark: "text-muted", ivory: "text-ink/75", red: "text-white", gold: "text-ink/80" };

/** Comic caption tab + drawn rule + heavy headline. Emphasis spans use `.text-gradient`, recoloured per tone. */
export function SectionHeader({ index, eyebrow, title, lede, tone = "dark" }: Props) {
  const reduce = useReducedMotion();
  return (
    <div data-tone={tone} className="mb-14 max-w-4xl md:mb-20">
      <Reveal className="flex items-center gap-4">
        <span className={`tag ${tag[tone]}`}>
          <span>{`${index} // ${eyebrow}`}</span>
        </span>
        <motion.span
          aria-hidden="true"
          className={`hidden h-[3px] w-16 origin-left sm:block ${rule[tone]}`}
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={`mt-7 text-balance text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.2rem] ${titleColor[tone]}`}>
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p className={`mt-6 max-w-2xl text-pretty text-base leading-relaxed md:text-lg ${ledeColor[tone]}`}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
