"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Brain, Cloud, Cpu, Server, Wrench } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { skillGroups } from "@/content/site";
import { SectionHeader } from "./ui/SectionHeader";
import { Reveal } from "./ui/Reveal";

const icons = { ai: Brain, ml: Cpu, backend: Server, cloud: Cloud, tools: Wrench } as const;
const marks = ["bg-gold", "bg-orange", "bg-blue", "bg-red"] as const;

export function Arsenal() {
  const [active, setActive] = useState(skillGroups[0].id);
  const reduce = useReducedMotion();
  const group = skillGroups.find((g) => g.id === active)!;

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = skillGroups[(i + dir + skillGroups.length) % skillGroups.length];
    setActive(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <section id="arsenal" className="relative overflow-hidden bg-bg py-20 md:py-28">
      <div aria-hidden="true" className="halftone-rev pointer-events-none absolute bottom-0 left-0 h-72 w-96 text-red/40" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="02"
          eyebrow="Technical arsenal"
          title={
            <>
              The stack behind the <span className="font-serif font-normal italic text-gradient">systems.</span>
            </>
          }
          lede="No made-up proficiency bars. Where a tool has shipped in a real project, the card says where."
        />

        <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          <Reveal className="min-w-0">
            <div
              role="tablist"
              aria-label="Skill categories"
              aria-orientation="vertical"
              className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-3 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {skillGroups.map((g, i) => {
                const Icon = icons[g.id as keyof typeof icons];
                const on = g.id === active;
                return (
                  <button
                    key={g.id}
                    id={`tab-${g.id}`}
                    role="tab"
                    type="button"
                    aria-selected={on}
                    aria-controls={`panel-${g.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(g.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`group relative flex min-h-14 shrink-0 items-center gap-3 border-2 px-4 py-3 text-left text-sm transition-colors ${
                      on ? "border-ink text-ink" : "border-line-strong text-text hover:border-gold"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="tab-bg"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-gold shadow-[6px_6px_0_0_var(--red)]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className={`font-display text-2xl font-extrabold leading-none ${on ? "text-ink" : "text-faint"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap font-semibold">{g.label}</span>
                    <span className={`ml-auto hidden font-mono text-[11px] lg:block ${on ? "text-ink/70" : "text-faint"}`}>
                      {String(g.skills.length).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div id={`panel-${group.id}`} role="tabpanel" aria-labelledby={`tab-${group.id}`} className="min-h-[420px] min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={group.id}
                initial={reduce ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-6 flex items-center gap-3 text-lg font-semibold text-text">
                  <span aria-hidden="true" className="h-[3px] w-8 bg-red" />
                  {group.blurb}
                </p>
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.skills.map((s, i) => (
                    <motion.li
                      key={s.name}
                      initial={reduce ? false : { opacity: 0, y: 14, rotate: -1 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.035, ease: [0.22, 1, 0.36, 1] }}
                      className="transition-[filter] duration-200 hover:[filter:drop-shadow(5px_5px_0_var(--red))]"
                    >
                      <div className="notch h-full min-h-[84px] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-display text-[15px] font-bold leading-snug tracking-tight text-text">{s.name}</p>
                          <span
                            aria-hidden="true"
                            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rotate-45 ${s.where ? marks[i % marks.length] : "border border-line-strong"}`}
                          />
                        </div>
                        {s.where ? (
                          <p className="mt-2 text-[12.5px] leading-snug text-muted">
                            <span className="font-mono text-[10.5px] uppercase tracking-wider text-gold">used in · </span>
                            {s.where}
                          </p>
                        ) : null}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
