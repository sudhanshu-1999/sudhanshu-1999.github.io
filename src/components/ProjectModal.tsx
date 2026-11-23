import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ExternalLink, Lock, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { Project } from "@/content/site";
import { FlowStrip } from "./FlowStrip";
import { MetricRings } from "./MetricRings";
import { GithubIcon } from "./ui/BrandIcons";

const TrainingChart = dynamic(() => import("./TrainingChart"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-white/[0.04]" />,
});

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t-[3px] border-line-strong py-7">
      <h3 className="tag mb-5 bg-gold text-ink">
        <span>{label}</span>
      </h3>
      {children}
    </section>
  );
}

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeBtn.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button type="button" aria-label="Close case study" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "tween", duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full max-w-3xl overflow-y-auto border-l-[6px] border-red bg-graphite"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-[3px] border-ink bg-graphite/95 px-6 py-4 backdrop-blur md:px-10">
              <p className="font-mono text-[11px] text-faint">
                <span className="text-gold">{project.index}</span> · case study · {project.category}
              </p>
              <button
                ref={closeBtn}
                type="button"
                onClick={onClose}
                className="grid h-11 w-11 place-items-center border-2 border-line-strong text-text transition hover:border-gold hover:bg-gold hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 pb-16 pt-8 md:px-10">
              <p className="font-mono text-[12px] text-faint">{project.year}</p>
              <h2 id="case-title" className="mt-2 text-4xl font-extrabold tracking-[-0.03em] text-text md:text-5xl">
                {project.title}
              </h2>
              <p className="mt-2 text-lg text-muted">{project.kicker}</p>
              {project.context && <p className="mt-4 inline-block border-2 border-line-strong px-2.5 py-1 font-mono text-[11px] text-muted">{project.context}</p>}

              <div className="mt-6 flex flex-wrap gap-2">
                {project.github ? (
                  <a href={project.github} target="_blank" rel="noreferrer" className="btn-primary !px-4 !py-2 !text-[13px]">
                    <GithubIcon className="h-3.5 w-3.5" /> View code
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 border-2 border-dashed border-line-strong px-3.5 py-2 font-mono text-[11.5px] text-faint">
                    <Lock className="h-3 w-3" /> {project.codeNote ?? "GitHub link: coming soon"}
                  </span>
                )}
                {project.demo ? (
                  <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 border-2 border-line-strong px-3.5 py-2 text-[13px] font-semibold text-text transition hover:border-gold hover:text-gold">
                    <ExternalLink className="h-3.5 w-3.5" /> Live demo
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 border-2 border-dashed border-line-strong px-3.5 py-2 font-mono text-[11.5px] text-faint">
                    Live demo: not public yet
                  </span>
                )}
              </div>

              <div className="mt-10">
                <Block label="Overview">
                  <p className="text-pretty leading-relaxed text-text/80">{project.summary}</p>
                </Block>
                <Block label="Problem">
                  <p className="text-pretty leading-relaxed text-text/80">{project.problem}</p>
                </Block>
                <Block label="Architecture">
                  <div className="border-2 border-line-strong bg-ink/60 p-5">
                    <FlowStrip steps={project.architecture} accent={project.accent} />
                  </div>
                </Block>
                {project.metrics && (
                  <Block label="Model evaluation">
                    <MetricRings metrics={project.metrics} note={project.metricsNote} />
                    {project.slug === "fall-detection" && (
                      <div className="mt-6 border-2 border-line-strong bg-ink/60 p-4">
                        <TrainingChart />
                      </div>
                    )}
                  </Block>
                )}
                <Block label="Technical implementation">
                  <ul className="space-y-3">
                    {project.implementation.map((x) => (
                      <li key={x} className="flex gap-3 text-pretty leading-relaxed text-text/80">
                        <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-orange" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </Block>
                <Block label="Engineering challenges">
                  <ul className="grid gap-3">
                    {project.challenges.map((x) => (
                      <li key={x} className="border-2 border-line-strong p-4 text-[14.5px] leading-relaxed text-text/80">
                        {x}
                      </li>
                    ))}
                  </ul>
                </Block>
                <Block label="Technology stack">
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <li key={s} className="border-2 border-line-strong px-2.5 py-1 font-mono text-[12px] text-text">
                        {s}
                      </li>
                    ))}
                  </ul>
                </Block>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
