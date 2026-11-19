"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FlaskConical } from "lucide-react";
import { useState } from "react";
import { exploring } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeader } from "./ui/SectionHeader";
import { onSpotlightMove } from "./ui/useSpotlight";

const statusStyle: Record<string, string> = {
  active: "text-cyan border-cyan/30 bg-cyan/[0.06]",
  shipping: "text-emerald-300 border-emerald-300/30 bg-emerald-300/[0.06]",
  reading: "text-violet border-violet/30 bg-violet/[0.08]",
};

export function Exploring() {
  const [open, setOpen] = useState<string | null>(exploring[0].code);
  const reduce = useReducedMotion();

  return (
    <section id="exploring" className="relative py-28 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="06"
          eyebrow="Currently exploring"
          title={
            <>
              Beyond the <span className="font-serif font-normal italic text-gradient">current stack.</span>
            </>
          }
          lede="An open lab notebook: what I'm studying, building toward, or already putting into production."
        />

        <Reveal>
          <div className="card overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] text-faint">
              <span className="flex items-center gap-2">
                <FlaskConical className="h-3.5 w-3.5 text-cyan" /> research.log
              </span>
              <span className="hidden gap-4 sm:flex">
                {Object.keys(statusStyle).map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full border ${statusStyle[s]}`} /> {s}
                  </span>
                ))}
              </span>
            </div>
            <ul>
              {exploring.map((x) => {
                const on = open === x.code;
                return (
                  <li key={x.code} className="border-b border-line last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpen(on ? null : x.code)}
                      onPointerMove={onSpotlightMove}
                      aria-expanded={on}
                      aria-controls={`exp-${x.code}`}
                      className="group grid w-full grid-cols-[52px_1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02] md:grid-cols-[72px_1fr_auto]"
                    >
                      <span className="font-mono text-[11px] text-faint">{x.code}</span>
                      <span className={`text-[15px] font-medium tracking-tight transition-colors md:text-base ${on ? "text-text" : "text-text/80 group-hover:text-text"}`}>
                        {x.title}
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] ${statusStyle[x.status]}`}>{x.status}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div
                          id={`exp-${x.code}`}
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 pl-[calc(52px+2.25rem)] text-pretty leading-relaxed text-muted md:pl-[calc(72px+2.25rem)]">
                            {x.note}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
