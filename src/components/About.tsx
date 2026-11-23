"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { certifications, site, stats } from "@/content/site";
import { Counter } from "./ui/Counter";
import { Reveal } from "./ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

const chapters = [
  {
    k: "Foundations",
    t: "Production software first.",
    d: "I joined CloudMetic in November 2022 and shipped enterprise systems across services, healthcare, finance and education: Apex, Lightning Web Components, integrations, and owning releases from design to production. That work taught me the unglamorous parts: platform limits, bulk-safe code, permissions, logging, and what breaks at 2 a.m.",
    node: "bg-orange",
    tag: "bg-orange text-ink",
  },
  {
    k: "Transition",
    t: "Then AI moved into the stack.",
    d: "I joined the company's enterprise + LLM integration R&D and took document extraction and retrieval from prototype to a working internal service: an async submit → poll → retrieve pipeline, a FastAPI inference service, Docling parsing, chunking, embeddings and vector search, with retries, failure isolation and idempotent callbacks.",
    node: "bg-blue",
    tag: "bg-blue text-ink",
  },
  {
    k: "Now",
    t: "Agents that are actually dependable.",
    d: "After IIT Delhi's Advanced AI & Deep Learning Programme, I focus on agentic systems and production RAG: typed state graphs, schema-validated tools, MCP, hybrid retrieval, guardrails and evaluation gates. Engineering fundamentals, applied to intelligence.",
    node: "bg-red",
    tag: "bg-red text-white",
  },
];

const statColors = ["text-gold", "text-orange", "text-blue", "text-ivory"];

export function About() {
  const reduce = useReducedMotion();
  const spine = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: spine, offset: ["start 75%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="about" className="relative overflow-hidden bg-ivory py-20 text-ink md:py-28">
      <div aria-hidden="true" className="halftone pointer-events-none absolute right-0 top-0 h-80 w-[28rem] text-ink/25" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Graphic section label + headline */}
        <div className="mb-14 md:mb-20">
          <Reveal className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="tag bg-red text-white shadow-[4px_4px_0_0_var(--ink)]">
              <span>{"01 // About"}</span>
            </span>
            <span className="h-[3px] w-14 bg-ink" />
            <span className="font-mono text-[11px] font-medium text-ink/70">{site.location}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-7 max-w-4xl text-balance text-[2.5rem] font-extrabold leading-[1] tracking-[-0.03em] sm:text-6xl lg:text-[4.6rem]">
              From enterprise software to{" "}
              <span className="relative isolate inline-block">
                <motion.span
                  aria-hidden="true"
                  className="absolute -inset-x-2 bottom-[0.04em] -z-10 h-[0.52em] origin-left -skew-x-6 bg-gold"
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5, ease }}
                />
                intelligent systems.
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Story column */}
          <div>
            <Reveal>
              <p className="text-pretty text-2xl font-semibold leading-[1.35] tracking-tight md:text-[1.75rem]">
                I care about the part of AI that happens after the demo: making a model&apos;s output{" "}
                <mark className="bg-blue px-1.5 text-ink [box-decoration-break:clone]">grounded</mark>, its tools{" "}
                <mark className="bg-gold px-1.5 text-ink [box-decoration-break:clone]">safe</mark>, and the system around it{" "}
                <mark className="bg-red px-1.5 text-white [box-decoration-break:clone]">recoverable</mark> when something fails.
              </p>
            </Reveal>

            <ol ref={spine} className="relative mt-14 space-y-12 pl-14">
              <span aria-hidden="true" className="absolute bottom-2 left-[15px] top-2 w-[3px] bg-ink/15" />
              <motion.span
                aria-hidden="true"
                className="absolute bottom-2 left-[15px] top-2 w-[3px] origin-top bg-ink"
                style={{ scaleY: reduce ? 1 : fill }}
              />
              {chapters.map((c, i) => (
                <Reveal as="li" key={c.k} delay={i * 0.08} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-14 top-0.5 grid h-8 w-8 rotate-45 place-items-center border-[3px] border-ink ${c.node} shadow-[3px_3px_0_0_var(--ink)]`}
                  />
                  <span className={`tag ${c.tag} border-2 border-ink`}>
                    <span>{c.k}</span>
                  </span>
                  <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-[-0.02em] md:text-[1.7rem]">{c.t}</h3>
                  <p className="mt-3 max-w-[62ch] text-pretty leading-relaxed text-ink/80">{c.d}</p>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Evidence column: scoreboard + credentials ledger */}
          <div className="space-y-12">
            <Reveal delay={0.1}>
              <div className="[filter:drop-shadow(9px_9px_0_var(--red))]">
                <div className="relative bg-ink px-6 pb-8 pt-7 text-ivory [clip-path:polygon(0_0,calc(100%-28px)_0,100%_28px,100%_100%,28px_100%,0_calc(100%-28px))] sm:px-8">
                  <div aria-hidden="true" className="halftone-rev absolute bottom-0 right-0 h-32 w-40 text-orange/60" />
                  <div className="relative grid grid-cols-2">
                    {stats.map((s, i) => (
                      <div
                        key={s.label}
                        className={`px-1 py-6 sm:px-3 ${i % 2 === 0 ? "border-r-2 border-dashed border-ivory/20 pr-4" : "pl-4"} ${i < 2 ? "border-b-2 border-dashed border-ivory/20" : ""}`}
                      >
                        <p className={`font-display text-5xl font-extrabold leading-none tracking-[-0.04em] sm:text-6xl ${statColors[i]}`}>
                          <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                        </p>
                        <p className="mt-3 text-[13px] font-medium leading-snug text-ivory">{s.label}</p>
                        <p className="mt-2 font-mono text-[10.5px] text-ivory/65">{"// "}{s.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <span className="tag bg-ink text-ivory">
                <span>Certifications</span>
              </span>
              <ul className="mt-5 border-t-[3px] border-ink">
                {certifications.map((c) => (
                  <li
                    key={c.name}
                    className="group flex items-center gap-3 border-b-2 border-ink/20 py-3 transition-[background,padding] duration-300 hover:bg-gold/40 hover:pl-3"
                  >
                    <span aria-hidden="true" className={`h-3 w-3 shrink-0 rotate-45 border-2 border-ink ${c.issuer === "Anthropic" ? "bg-orange" : "bg-blue"}`} />
                    <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug">
                      {c.name}
                      <span className="ml-2 font-mono text-[11px] font-medium text-ink/60">{c.issuer}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[12px] font-semibold">{c.year}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
