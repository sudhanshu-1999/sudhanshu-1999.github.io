"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Brain, Cloud, Cpu, Server, Wrench } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { skillGroups } from "@/content/site";
import { SectionHeader } from "./ui/SectionHeader";
import { Reveal } from "./ui/Reveal";
import { onSpotlightMove } from "./ui/useSpotlight";

const icons = { ai: Brain, ml: Cpu, backend: Server, cloud: Cloud, tools: Wrench } as const;

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
    <section id="arsenal" className="relative py-28 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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

        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
          <Reveal className="min-w-0">
            <div
              role="tablist"
              aria-label="Skill categories"
              aria-orientation="vertical"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
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
                    className={`relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                      on ? "text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="tab-bg"
                        className="card absolute inset-0 -z-10 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
                        on ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-line bg-white/[0.02]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="whitespace-nowrap font-medium">{g.label}</span>
                    <span className="ml-auto hidden font-mono text-[11px] text-faint lg:block">
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
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-5 text-muted">{group.blurb}</p>
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.skills.map((s, i) => (
                    <motion.li
                      key={s.name}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: reduce ? 0 : i * 0.03 }}
                      onPointerMove={onSpotlightMove}
                      className="card spotlight group rounded-xl p-4 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium tracking-tight text-text">{s.name}</p>
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${s.where ? "bg-cyan" : "bg-line-strong"}`}
                          aria-hidden="true"
                        />
                      </div>
                      {s.where ? (
                        <p className="mt-2 text-[12.5px] leading-snug text-muted">
                          <span className="font-mono text-[10.5px] uppercase tracking-wider text-faint">used in · </span>
                          {s.where}
                        </p>
                      ) : null}
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
