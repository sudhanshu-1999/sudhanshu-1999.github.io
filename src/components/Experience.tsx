"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Award, Briefcase, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { experience } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeader } from "./ui/SectionHeader";

type Stage = (typeof experience)[number];

const WALK_MS = 1100;

function Detail({ e }: { e: Stage }) {
  return (
    <div className="[filter:drop-shadow(9px_9px_0_var(--orange))]">
      <div className="bg-ink p-6 text-text [clip-path:polygon(0_0,calc(100%-30px)_0,100%_30px,100%_100%,0_100%)] md:p-8">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gold">
          {e.kind === "work" ? "Work" : "Education"} · {e.period}
          {e.place ? ` · ${e.place}` : ""}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em]">{e.title}</h3>
        <p className="mt-0.5 font-semibold text-gold">{e.org}</p>
        {e.points.length > 0 && (
          <ul className="mt-5 space-y-3">
            {e.points.map((p) => (
              <li key={p} className="flex gap-3 text-pretty text-[14.5px] leading-relaxed text-text/85">
                <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-red" />
                {p}
              </li>
            ))}
          </ul>
        )}
        {e.honours.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-3">
            {e.honours.map((h, k) => (
              <li
                key={h}
                className={`inline-flex items-center gap-1.5 border-2 border-ink bg-gold px-3 py-1.5 text-[12px] font-bold text-ink shadow-[3px_3px_0_0_var(--red)] ${k % 2 ? "rotate-1" : "-rotate-1"}`}
              >
                <Award className="h-3.5 w-3.5" /> {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Experience() {
  const stages = useMemo(() => [...experience].sort((a, b) => a.step - b.step), []);
  const last = stages.length - 1;
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const seen = useInView(trackRef, { once: true, margin: "0px 0px -25% 0px" });
  const [cur, setCur] = useState(0);
  const [touched, setTouched] = useState(false);
  // With reduced motion there is no walk: show the latest stop as soon as the map is seen.
  const i = reduce && seen && !touched ? last : cur;

  // First time the map scrolls into view, walk it from the first stage to the latest. A click stops the walk.
  useEffect(() => {
    if (!seen || touched || reduce) return;
    const t = setInterval(() => setCur((v) => (v < last ? v + 1 : v)), WALK_MS);
    return () => clearInterval(t);
  }, [seen, touched, reduce, last]);

  const go = (n: number) => { setTouched(true); setCur(Math.max(0, Math.min(last, n))); };
  const skills = stages.slice(0, i + 1).flatMap((s, k) => s.skills.map((name) => ({ name, k })));
  const fill = last ? (i / last) * 100 : 0;
  const t = reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section id="experience" className="relative overflow-hidden bg-ivory py-20 text-ink md:py-28">
      <div aria-hidden="true" className="halftone-rev pointer-events-none absolute bottom-0 right-0 h-80 w-[26rem] text-ink/20" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="05"
          eyebrow="Experience & education"
          tone="ivory"
          title={
            <>
              The <span className="font-serif font-normal italic text-gradient">trajectory.</span>
            </>
          }
          lede="From electrical engineering to production AI systems. Walk the route, or click any stop to see what it added."
        />

        <Reveal>
          <div ref={trackRef}>
            {/* Route: horizontal on md+, vertical list on mobile */}
            <ol className="relative grid gap-0 md:grid-cols-4">
              <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-[4px] bg-ink md:bottom-auto md:left-[12.5%] md:right-[12.5%] md:top-[19px] md:h-[4px] md:w-auto" />
              <motion.span
                aria-hidden="true"
                className="absolute left-[12.5%] top-[19px] hidden h-[4px] bg-red md:block"
                initial={false}
                animate={{ width: `${fill * 0.75}%` }}
                transition={t}
              />
              {stages.map((e, k) => {
                const on = k === i;
                const done = k < i;
                const Icon = e.kind === "work" ? Briefcase : GraduationCap;
                return (
                  <li key={e.title} className="relative pb-8 md:pb-0">
                    <button
                      type="button"
                      onClick={() => go(k)}
                      aria-current={on ? "step" : undefined}
                      aria-expanded={on}
                      className="group flex w-full items-start gap-4 text-left md:flex-col md:items-center md:gap-3 md:text-center"
                    >
                      <span
                        className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center border-[3px] border-ink transition-all duration-300 ${
                          on
                            ? "-translate-x-0.5 -translate-y-0.5 bg-red text-white shadow-[5px_5px_0_0_var(--ink)]"
                            : done
                              ? "bg-gold shadow-[3px_3px_0_0_var(--ink)]"
                              : "bg-ivory-2 shadow-[3px_3px_0_0_var(--ink)] group-hover:bg-gold"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className={`tag ${e.kind === "work" ? "bg-red text-white" : "bg-ink text-ivory"}`}>
                          <span>{e.period}</span>
                        </span>
                        <span className={`mt-2 block text-[17px] font-extrabold leading-tight tracking-[-0.01em] ${on ? "text-ink" : "text-ink/75"}`}>
                          {e.short}
                        </span>
                        <span className="mt-0.5 block font-mono text-[11px] font-medium text-ink/60">{e.org}</span>
                      </span>
                    </button>

                    {/* Mobile: detail opens under its stop */}
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div
                          key="m"
                          className="mt-5 pl-14 md:hidden"
                          initial={reduce ? false : { opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={t}
                        >
                          <Detail e={e} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>

            {/* md+: one detail panel under the route */}
            <div className="mt-12 hidden md:block" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stages[i].title}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                >
                  <Detail e={stages[i]} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Skills picked up along the route so far */}
            <div className="mt-12 border-t-[3px] border-ink pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[12px] font-bold uppercase tracking-wider text-ink">
                  Skills picked up so far <span className="font-mono text-ink/60">· {skills.length}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(i - 1)}
                    disabled={i === 0}
                    aria-label="Previous stop"
                    className="grid h-10 w-10 place-items-center border-2 border-ink bg-ivory-2 shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(i + 1)}
                    disabled={i === last}
                    aria-label="Next stop"
                    className="grid h-10 w-10 place-items-center border-2 border-ink bg-gold shadow-[3px_3px_0_0_var(--red)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                <AnimatePresence initial={false}>
                  {skills.map(({ name, k }) => (
                    <motion.li
                      key={name}
                      layout={!reduce}
                      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduce ? undefined : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: reduce ? 0 : 0.25 }}
                      className={`border-2 border-ink px-3 py-1.5 font-mono text-[12px] font-semibold ${
                        k === i ? "bg-gold shadow-[3px_3px_0_0_var(--red)]" : "bg-ivory-2 text-ink/80"
                      }`}
                    >
                      {name}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
