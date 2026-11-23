"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { site, stats } from "@/content/site";
import { Magnetic } from "./ui/Magnetic";
import { Reactor } from "./ui/Reactor";

const NeuralField = dynamic(() => import("./NeuralField").then((m) => m.NeuralField), {
  ssr: false,
  loading: () => <div className="hud aspect-[5/4] w-full sm:aspect-[16/14]" />,
});

const ease = [0.22, 1, 0.36, 1] as const;

// Floating indicators reuse the verified figures from `stats`; nothing new is claimed.
const chips = [
  { v: `${stats[0].value.toFixed(1)}${stats[0].suffix}`, l: "yrs in production", cls: "-top-10 left-6", color: "bg-gold", delay: "0s" },
  { v: `${stats[2].value.toFixed(3)}`, l: "mAP@50 · YOLOv8", cls: "-right-8 top-[38%]", color: "bg-blue", delay: "1.4s" },
  { v: `${stats[1].value}`, l: "Cloud Run services", cls: "-bottom-10 left-1/2", color: "bg-orange", delay: "2.6s" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [burst, setBurst] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const ySlab = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const yReactor = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  // Cursor-following light: writes two CSS variables, no React re-render.
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--hx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--hy", `${e.clientY - r.top}px`);
  };

  const item = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay: 0.25 + d, ease },
  });

  const line = (d: number) => ({
    initial: reduce ? false : { y: "115%", rotate: 3 },
    animate: { y: "0%", rotate: 0 },
    transition: { duration: 0.95, delay: 0.3 + d, ease },
  });

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-bg pb-24 pt-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grid-mask absolute inset-0 overflow-hidden">
          <div className="grid-drift" />
        </div>

        {/* Stark-red slab with halftone: diagonal on desktop, a band behind the panel on mobile. */}
        <motion.div style={{ y: ySlab }} className="absolute inset-0">
          <motion.div
            initial={reduce ? false : { clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0%)" }}
            transition={{ duration: 1.1, delay: 0.15, ease }}
            className="absolute bottom-0 right-0 hidden h-[130%] w-[46%] bg-red lg:top-[-10%] lg:block [clip-path:polygon(26%_0,100%_0,100%_100%,0_100%)]"
          >
            <div className="halftone absolute inset-0 text-ink/45" />
            <div className="halftone-rev absolute inset-0 text-orange/70" />
          </motion.div>
          <div className="absolute bottom-0 right-0 hidden h-[130%] w-[46%] bg-gold [clip-path:polygon(26%_0,28.2%_0,2.2%_100%,0_100%)] lg:top-[-10%] lg:block" />
        </motion.div>

        <motion.div style={{ y: yReactor }} className="absolute right-[-18%] top-[2%] hidden w-[620px] opacity-60 lg:block xl:right-[-6%]">
          <Reactor className="w-full" />
        </motion.div>

        <div className="scanline" />
        <div
          className="absolute inset-0 hidden md:block"
          style={{ background: "radial-gradient(460px circle at var(--hx, 30%) var(--hy, 40%), rgba(255,194,71,0.1), transparent 62%)" }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
        <motion.div style={{ opacity: fade }} className="min-w-0">
          <motion.p
            {...item(0)}
            className="inline-flex max-w-full items-center gap-2 border-2 border-gold/70 bg-ink/60 px-3 py-1.5 font-mono text-[11px] text-text"
          >
            <span className="pulse-dot h-2 w-2 shrink-0 bg-gold" />
            <span className="truncate">
              Open to AI engineering roles<span className="hidden sm:inline"> · remote &amp; relocation</span>
            </span>
          </motion.p>

          <motion.p
            {...item(0.05)}
            className="mt-8 inline-block -rotate-2 border-2 border-ink bg-ivory px-3 py-1 font-mono text-sm font-semibold text-ink shadow-[4px_4px_0_0_var(--orange)]"
          >
            {site.name}
          </motion.p>

          <h1 className="mt-5 text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.03em] text-text sm:text-6xl lg:text-[5rem]">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span {...line(0)} className="block origin-left">
                Engineering
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.12em] pr-3">
              <motion.span {...line(0.12)} className="type-offset block origin-left text-gold">
                Intelligence.
              </motion.span>
            </span>
          </h1>

          <motion.p {...item(0.2)} className="mt-6 text-balance text-lg font-semibold tracking-tight text-text sm:text-xl">
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
                {i > 0 && <span className="font-bold text-red">/</span>}
                <span className="text-text/80">{r}</span>
              </span>
            ))}
          </motion.p>

          <motion.div {...item(0.36)} className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4">
            <Magnetic>
              <a href="#work" onClick={() => setBurst((b) => b + 1)} className="btn-primary group relative">
                Explore my work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                <AnimatePresence>
                  {burst > 0 && !reduce && (
                    <motion.svg
                      key={burst}
                      aria-hidden="true"
                      viewBox="0 0 120 90"
                      className="pointer-events-none absolute -right-10 -top-14 w-28"
                      initial={{ scale: 0.2, rotate: -20, opacity: 0 }}
                      animate={{ scale: 1, rotate: 6, opacity: 1 }}
                      exit={{ scale: 1.3, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      onAnimationComplete={() => setTimeout(() => setBurst(0), 500)}
                    >
                      <polygon
                        points="60,2 72,26 98,12 90,38 118,44 92,56 104,82 76,70 62,88 50,68 22,80 32,56 4,46 30,36 20,10 46,24"
                        fill="var(--red)"
                        stroke="var(--ink)"
                        strokeWidth="3"
                      />
                      <text x="60" y="52" textAnchor="middle" fontFamily="var(--font-sora)" fontWeight="800" fontSize="20" fill="var(--gold)">
                        POW!
                      </text>
                    </motion.svg>
                  )}
                </AnimatePresence>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn-ghost">
                Let&apos;s connect
              </a>
            </Magnetic>
            <a
              href={site.resume}
              download="Sudhanshu_Singh_Resume.pdf"
              className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-medium text-text underline decoration-red decoration-2 underline-offset-[6px] transition hover:decoration-gold"
            >
              <Download className="h-4 w-4" /> Resume
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: yVisual }}
          initial={reduce ? false : { opacity: 0, x: 40, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: reduce ? 0 : -1.5 }}
          transition={{ duration: 1.1, delay: 0.45, ease }}
          className="relative min-w-0 lg:ml-6"
        >
          <div aria-hidden="true" className="absolute -inset-x-4 -inset-y-8 -z-10 bg-red [clip-path:polygon(0_7%,100%_0,100%_100%,0_100%)] lg:hidden">
            <div className="halftone absolute inset-0 text-ink/45" />
          </div>
          <div className="relative shadow-[12px_12px_0_0_var(--ink)]">
            <NeuralField />
          </div>
          {chips.map((c) => (
            <div key={c.l} className={`absolute z-10 hidden md:block ${c.cls}`}>
              <div className="float-y" style={{ animationDelay: c.delay }}>
                <div className="flex items-center gap-2 border-2 border-ink bg-ivory px-3 py-1.5 shadow-[4px_4px_0_0_var(--ink)]">
                  <span className={`h-2.5 w-2.5 ${c.color}`} />
                  <span className="font-display text-base font-extrabold leading-none text-ink">{c.v}</span>
                  <span className="font-mono text-[10px] font-medium text-ink/70">{c.l}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-6 hidden flex-col items-start gap-2 text-muted transition hover:text-text md:flex"
      >
        <span className="font-mono text-[10px] tracking-[0.25em]">SCROLL</span>
        <span className="relative h-9 w-5 rounded-full border-2 border-line-strong">
          <span className="scroll-cue absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-gold" />
        </span>
      </a>
    </section>
  );
}
