"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { site } from "@/content/site";
import { Magnetic } from "./ui/Magnetic";

const NeuralField = dynamic(() => import("./NeuralField").then((m) => m.NeuralField), {
  ssr: false,
  loading: () => <div className="glass aspect-[5/4] w-full rounded-2xl sm:aspect-[16/14]" />,
});

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  const item = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay: 0.25 + d, ease },
  });

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.16),transparent)]" />
        <div className="absolute right-[-10%] top-1/3 h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.12),transparent)]" />
        <div className="absolute bottom-0 left-[-10%] h-[360px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.08),transparent)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <motion.div style={{ opacity: fade }} className="min-w-0">
          <motion.p
            {...item(0)}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-muted"
          >
            <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="truncate">
              Open to AI engineering roles<span className="hidden sm:inline"> · remote &amp; relocation</span>
            </span>
          </motion.p>

          <motion.p {...item(0.05)} className="mt-8 font-mono text-sm text-cyan">
            {site.name}
          </motion.p>

          <motion.h1
            {...item(0.1)}
            className="mt-3 text-[3.1rem] font-semibold leading-[0.98] tracking-[-0.045em] text-text sm:text-7xl lg:text-[5.4rem]"
          >
            Engineering
            <br />
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-gradient">Intelligence.</span>
          </motion.h1>

          <motion.p {...item(0.2)} className="mt-6 text-lg font-medium tracking-tight text-text/90 sm:text-xl">
            Building AI systems that think, retrieve &amp; act.
          </motion.p>

          <motion.p {...item(0.26)} className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">
            AI engineer with 3.5+ years shipping production enterprise software, now building agentic systems, RAG
            platforms and the reliable backends underneath them: async pipelines, typed tool contracts and evaluation
            that catches regressions before users do.
          </motion.p>

          <motion.p {...item(0.3)} className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px]">
            {site.roles.map((r, i) => (
              <span key={r} className="flex items-center gap-3">
                {i > 0 && <span className="text-faint">/</span>}
                <span className="text-muted">{r}</span>
              </span>
            ))}
          </motion.p>

          <motion.div {...item(0.36)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-xl bg-text px-5 py-3 text-sm font-medium text-bg transition hover:bg-white"
              >
                Explore my work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-white/[0.03] px-5 py-3 text-sm font-medium text-text transition hover:border-cyan/50 hover:bg-cyan/[0.06]"
              >
                Let&apos;s connect
              </a>
            </Magnetic>
            <a
              href={site.resume}
              download="Sudhanshu_Singh_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-sm text-muted transition hover:text-text"
            >
              <Download className="h-4 w-4" /> Resume
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: yVisual }}
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease }}
          className="relative min-w-0"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(34,211,238,0.10),transparent)]"
          />
          <NeuralField />
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint transition hover:text-muted md:flex"
      >
        <span className="font-mono text-[10px] tracking-[0.25em]">SCROLL</span>
        <span className="relative h-9 w-5 rounded-full border border-line-strong">
          <span className="scroll-cue absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-cyan" />
        </span>
      </a>
    </section>
  );
}
