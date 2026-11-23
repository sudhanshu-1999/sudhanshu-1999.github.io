"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronRight, FlaskConical } from "lucide-react";
import { useState } from "react";
import { exploring } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeader } from "./ui/SectionHeader";

const statusStyle: Record<string, string> = {
  active: "bg-blue text-ink",
  shipping: "bg-gold text-ink",
  reading: "bg-orange text-ink",
};

export function Exploring() {
  const [open, setOpen] = useState<string | null>(exploring[0].code);
  const reduce = useReducedMotion();

  return (
    <section id="exploring" className="relative overflow-hidden bg-bg py-20 md:py-28">
      <div aria-hidden="true" className="halftone pointer-events-none absolute right-0 top-0 h-80 w-[26rem] text-gold/30" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
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
          <div className="hud bg-graphite shadow-[10px_10px_0_0_var(--red)]">
            <div className="flex items-center justify-between border-b-2 border-line-strong px-5 py-3 font-mono text-[11px] text-muted">
              <span className="flex items-center gap-2 font-semibold text-gold">
                <FlaskConical className="h-4 w-4" /> research.log
              </span>
              <span className="hidden gap-3 sm:flex">
                {Object.keys(statusStyle).map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 ${statusStyle[s]}`} /> {s}
                  </span>
                ))}
              </span>
            </div>
            <ul>
              {exploring.map((x) => {
                const on = open === x.code;
                return (
                  <li key={x.code} className="border-b-2 border-line last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpen(on ? null : x.code)}
                      aria-expanded={on}
                      aria-controls={`exp-${x.code}`}
                      className="group relative grid min-h-14 w-full grid-cols-[22px_52px_1fr_auto] items-center gap-3 overflow-hidden px-5 py-4 text-left md:grid-cols-[22px_72px_1fr_auto]"
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 -z-0 origin-left bg-red/20 transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                      />
                      <ChevronRight className={`relative h-4 w-4 text-gold transition-transform duration-300 ${on ? "rotate-90" : ""}`} />
                      <span className="relative font-mono text-[12px] font-semibold text-gold">{x.code}</span>
                      <span className="relative text-[15px] font-bold tracking-tight text-text md:text-lg">{x.title}</span>
                      <span className={`tag relative !px-2.5 !py-0.5 !text-[10.5px] ${statusStyle[x.status]}`}>
                        <span>{x.status}</span>
                      </span>
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
                          <p className="px-5 pb-6 pl-[calc(22px+52px+2.25rem)] text-pretty leading-relaxed text-muted md:pl-[calc(22px+72px+2.25rem)]">
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
