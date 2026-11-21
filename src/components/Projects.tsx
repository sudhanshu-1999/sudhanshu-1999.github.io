"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { projects, type Project } from "@/content/site";
import { FlowStrip } from "./FlowStrip";
import { MetricRings } from "./MetricRings";
import { ProjectModal } from "./ProjectModal";
import { GithubIcon } from "./ui/BrandIcons";
import { SectionHeader } from "./ui/SectionHeader";
import { Reveal } from "./ui/Reveal";
import { onSpotlightMove } from "./ui/useSpotlight";

const filters = ["All", "AI Platform", "Document AI", "Computer Vision", "Full-Stack", "Enterprise"] as const;

const glow = {
  cyan: "bg-[radial-gradient(closest-side,rgba(34,211,238,0.14),transparent)]",
  violet: "bg-[radial-gradient(closest-side,rgba(139,92,246,0.16),transparent)]",
  blue: "bg-[radial-gradient(closest-side,rgba(59,130,246,0.15),transparent)]",
};

export function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [open, setOpen] = useState<Project | null>(null);
  const reduce = useReducedMotion();

  const list = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.category === filter)), [filter]);

  // Deep link: /#work/<slug> opens a case study.
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#work\/([\w-]+)$/);
      const p = m && projects.find((x) => x.slug === m[1]);
      if (p) {
        setOpen(p);
        document.getElementById("work")?.scrollIntoView();
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const openProject = useCallback((p: Project) => {
    setOpen(p);
    history.replaceState(null, "", `#work/${p.slug}`);
  }, []);
  const close = useCallback(() => {
    setOpen(null);
    history.replaceState(null, "", "#work");
  }, []);

  return (
    <section id="work" className="relative py-28 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="03"
          eyebrow="Featured work"
          title={
            <>
              Case studies in <span className="font-serif font-normal italic text-gradient">applied AI.</span>
            </>
          }
          lede="Each one starts with a real constraint (timeouts, tenants, label noise, cost) and shows the engineering that answered it."
        />

        <Reveal>
          <div role="group" aria-label="Filter projects" className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1">
            <LayoutGroup id="filters">
              {filters.map((f) => {
                const on = f === filter;
                const count = f === "All" ? projects.length : projects.filter((p) => p.category === f).length;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(f)}
                    className={`relative shrink-0 rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
                      on ? "border-transparent text-bg" : "border-line text-muted hover:border-line-strong hover:text-text"
                    }`}
                  >
                    {on && <motion.span layoutId="filter-pill" className="absolute inset-0 -z-10 rounded-full bg-text" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                    {f}
                    <span className={`ml-1.5 font-mono text-[10.5px] ${on ? "text-bg/60" : "text-faint"}`}>{count}</span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </Reveal>

        <motion.ul layout className="grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => {
              const feature = filter === "All" && (i === 0 || i === 1);
              return (
                <motion.li
                  layout={!reduce}
                  key={p.slug}
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={feature ? "md:col-span-2" : ""}
                >
                  <article
                    onPointerMove={onSpotlightMove}
                    className="card spotlight group relative h-full overflow-hidden rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1 md:p-8"
                  >
                    <div aria-hidden="true" className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100 ${glow[p.accent]}`} />

                    <div className={`relative grid gap-8 ${feature ? "lg:grid-cols-[1.1fr_1fr] lg:gap-12" : ""}`}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3 font-mono text-[11px] text-faint">
                          <span className="text-cyan">{p.index}</span>
                          <span className="h-px w-6 bg-line-strong" />
                          <span>{p.category}</span>
                          <span className="ml-auto">{p.year}</span>
                        </div>
                        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-text md:text-[1.75rem]">{p.title}</h3>
                        <p className="mt-1.5 text-[15px] text-muted">{p.kicker}</p>
                        <p className="mt-4 text-pretty leading-relaxed text-text/75">{p.summary}</p>

                        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
                          {p.stack.slice(0, feature ? 9 : 6).map((s) => (
                            <li key={s} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                              {s}
                            </li>
                          ))}
                          {p.stack.length > (feature ? 9 : 6) && (
                            <li className="px-1 py-0.5 font-mono text-[11px] text-faint">+{p.stack.length - (feature ? 9 : 6)}</li>
                          )}
                        </ul>

                        <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
                          <button
                            type="button"
                            onClick={() => openProject(p)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3.5 py-2 text-[13px] font-medium text-text transition hover:bg-white/[0.1]"
                            aria-haspopup="dialog"
                          >
                            Read case study <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                          {p.demo && (
                            <a
                              href={p.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-cyan/[0.06] px-3.5 py-2 text-[13px] text-text transition hover:border-cyan/70"
                            >
                              <ExternalLink className="h-3.5 w-3.5" /> Live demo
                            </a>
                          )}
                          {p.github ? (
                            <a
                              href={p.github}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-[13px] text-muted transition hover:border-line-strong hover:text-text"
                            >
                              <GithubIcon className="h-3.5 w-3.5" /> Code
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-2 font-mono text-[11px] text-faint">
                              <Lock className="h-3 w-3" /> {p.codeNote ?? "repo link coming soon"}
                            </span>
                          )}
                        </div>
                      </div>

                      {feature && (
                        <div className="flex flex-col justify-center gap-5 rounded-xl border border-line bg-bg/40 p-5">
                          {p.metrics ? (
                            <>
                              <p className="eyebrow">Model performance</p>
                              <MetricRings metrics={p.metrics} note={p.metricsNote} />
                            </>
                          ) : (
                            <>
                              <p className="eyebrow">Data path</p>
                              <FlowStrip steps={p.architecture} accent={p.accent} vertical />
                            </>
                          )}
                        </div>
                      )}
                      {!feature && (
                        <div className="-mt-2">
                          <FlowStrip steps={p.architecture} accent={p.accent} compact />
                        </div>
                      )}
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>

      <ProjectModal project={open} onClose={close} />
    </section>
  );
}
