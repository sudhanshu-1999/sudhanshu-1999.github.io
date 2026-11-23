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
import { tiltHandlers } from "./ui/useTilt";

const filters = ["All", "AI Platform", "Document AI", "Computer Vision", "Full-Stack", "Enterprise"] as const;

const tilt = tiltHandlers(4);

const accentBg = { cyan: "bg-blue", violet: "bg-orange", blue: "bg-gold" } as const;

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
    <section id="work" className="relative overflow-hidden bg-red py-20 md:py-28">
      <div aria-hidden="true" className="halftone pointer-events-none absolute inset-0 text-ink/30" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-0 hidden h-full w-40 -skew-x-12 bg-orange/70 lg:block" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="03"
          tone="red"
          eyebrow="Featured work"
          title={
            <>
              Case studies in <span className="font-serif font-normal italic text-gradient">applied AI.</span>
            </>
          }
          lede="Each one starts with a real constraint (timeouts, tenants, label noise, cost) and shows the engineering that answered it."
        />

        <Reveal>
          <div role="group" aria-label="Filter projects" className="-mx-4 mb-12 flex gap-3 overflow-x-auto px-4 pb-2">
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
                    className={`relative shrink-0 border-2 px-4 py-2 text-[13px] font-semibold transition-colors ${
                      on ? "border-ink text-ivory" : "border-white/60 text-white hover:border-ink hover:bg-ink/15"
                    }`}
                  >
                    {on && <motion.span layoutId="filter-pill" aria-hidden="true" className="absolute inset-0 -z-10 bg-ink shadow-[4px_4px_0_0_var(--gold)]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                    {f}
                    <span className={`ml-1.5 font-mono text-[10.5px] ${on ? "text-gold" : "text-white/80"}`}>{count}</span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </Reveal>

        <motion.ul layout className="grid gap-9 md:grid-cols-2">
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
                  <div {...tilt} className="tilt frame group relative h-full [filter:drop-shadow(9px_9px_0_var(--ink))]">
                    <article
                      className={`relative h-full overflow-hidden p-6 [clip-path:polygon(0_0,calc(100%-34px)_0,100%_34px,100%_100%,0_100%)] md:p-8 ${
                        feature ? "bg-ivory text-ink" : "bg-graphite text-text"
                      }`}
                    >
                      <span aria-hidden="true" className={`absolute right-0 top-0 h-[34px] w-[34px] ${accentBg[p.accent]} [clip-path:polygon(0_0,100%_100%,0_100%)]`} />
                      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-2 ${accentBg[p.accent]}`} />
                      <div className="shine" aria-hidden="true" />

                      <div className={`relative grid gap-8 ${feature ? "lg:grid-cols-[1.1fr_1fr] lg:gap-12" : ""}`}>
                        <div className="flex flex-col">
                          <div className={`flex items-center gap-3 font-mono text-[11px] ${feature ? "text-ink/70" : "text-faint"}`}>
                            <span className={`tag ${accentBg[p.accent]} text-ink`}>
                              <span>{p.index}</span>
                            </span>
                            <span>{p.category}</span>
                            <span className="ml-auto">{p.year}</span>
                          </div>
                          <h3 className="mt-5 text-[1.7rem] font-extrabold leading-tight tracking-[-0.02em] md:text-[2.1rem]">{p.title}</h3>
                          <p className={`mt-1.5 text-[15px] font-medium ${feature ? "text-ink/75" : "text-muted"}`}>{p.kicker}</p>
                          <p className={`mt-4 text-pretty leading-relaxed ${feature ? "text-ink/85" : "text-text/80"}`}>{p.summary}</p>

                          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
                            {p.stack.slice(0, feature ? 9 : 6).map((s) => (
                              <li
                                key={s}
                                className={`border-2 px-2 py-0.5 font-mono text-[11px] font-medium ${feature ? "border-ink text-ink" : "border-line-strong text-muted"}`}
                              >
                                {s}
                              </li>
                            ))}
                            {p.stack.length > (feature ? 9 : 6) && (
                              <li className={`px-1 py-0.5 font-mono text-[11px] ${feature ? "text-ink/60" : "text-faint"}`}>+{p.stack.length - (feature ? 9 : 6)}</li>
                            )}
                          </ul>

                          <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                            <button
                              type="button"
                              onClick={() => openProject(p)}
                              className={`inline-flex min-h-11 items-center gap-1.5 border-2 border-ink px-4 py-2 text-[13px] font-bold shadow-[4px_4px_0_0_var(--red)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 ${
                                feature ? "bg-ink text-ivory" : "bg-gold text-ink"
                              }`}
                              aria-haspopup="dialog"
                            >
                              Read case study <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                            {p.demo && (
                              <a
                                href={p.demo}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex min-h-11 items-center gap-1.5 border-2 px-4 py-2 text-[13px] font-semibold transition-colors ${
                                  feature ? "border-ink text-ink hover:bg-gold" : "border-gold text-gold hover:bg-gold hover:text-ink"
                                }`}
                              >
                                <ExternalLink className="h-3.5 w-3.5" /> Live demo
                              </a>
                            )}
                            {p.github ? (
                              <a
                                href={p.github}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex min-h-11 items-center gap-1.5 border-2 px-4 py-2 text-[13px] font-semibold transition-colors ${
                                  feature ? "border-ink/40 text-ink hover:border-ink" : "border-line-strong text-muted hover:border-ivory hover:text-text"
                                }`}
                              >
                                <GithubIcon className="h-3.5 w-3.5" /> Code
                              </a>
                            ) : (
                              <span className={`inline-flex items-center gap-1.5 px-1 py-2 font-mono text-[11px] ${feature ? "text-ink/65" : "text-faint"}`}>
                                <Lock className="h-3 w-3" /> {p.codeNote ?? "repo link coming soon"}
                              </span>
                            )}
                          </div>
                        </div>

                        {feature && (
                          <div className="flex flex-col justify-center gap-5 bg-ink p-5 text-text">
                            {p.metrics ? (
                              <>
                                <p className="eyebrow text-gold">Model performance</p>
                                <MetricRings metrics={p.metrics} note={p.metricsNote} />
                              </>
                            ) : (
                              <>
                                <p className="eyebrow text-gold">Data path</p>
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
                  </div>
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
