"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { diagrams, type ArchDiagram } from "@/content/site";
import { SectionHeader } from "./ui/SectionHeader";
import { Reveal } from "./ui/Reveal";

const NW = 140; // node width
const NH = 44; // node height

/** Breadth-first order from the first node, used by "Trace data flow". */
function flowOrder(d: ArchDiagram) {
  const seen = new Set<string>([d.nodes[0].id]);
  const order = [d.nodes[0].id];
  for (let i = 0; i < order.length; i++) {
    for (const [a, b] of d.edges) if (a === order[i] && !seen.has(b)) { seen.add(b); order.push(b); }
  }
  return order;
}

function edgePath(d: ArchDiagram, a: string, b: string) {
  const A = d.nodes.find((n) => n.id === a)!;
  const B = d.nodes.find((n) => n.id === b)!;
  const back = B.x < A.x; // loop-back edge (e.g. observe → planner)
  if (back) {
    const y = Math.max(A.y, B.y) + 90;
    return `M ${A.x} ${A.y + NH / 2} C ${A.x} ${y}, ${B.x} ${y}, ${B.x} ${B.y + NH / 2}`;
  }
  const x1 = A.x + NW / 2, x2 = B.x - NW / 2;
  if (Math.abs(A.x - B.x) < NW) {
    // vertical neighbour
    const down = B.y > A.y;
    return `M ${A.x} ${A.y + (down ? NH / 2 : -NH / 2)} L ${B.x} ${B.y + (down ? -NH / 2 : NH / 2)}`;
  }
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${A.y} C ${mx} ${A.y}, ${mx} ${B.y}, ${x2} ${B.y}`;
}

export function Architecture() {
  const [di, setDi] = useState(0);
  const d = diagrams[di];
  const [sel, setSel] = useState<string>(d.nodes[0].id);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const order = useMemo(() => flowOrder(d), [d]);

  useEffect(() => {
    if (!playing) { if (timer.current) clearInterval(timer.current); return; }
    let i = order.indexOf(sel);
    timer.current = setInterval(() => {
      i += 1;
      if (i >= order.length) { setPlaying(false); return; }
      setSel(order[i]);
    }, 1100);
    return () => { if (timer.current) clearInterval(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, order]);

  const node = d.nodes.find((n) => n.id === sel)!;
  const linked = new Set(d.edges.filter(([a, b]) => a === sel || b === sel).flat());
  const step = order.indexOf(sel) + 1;

  const togglePlay = () => {
    if (!playing && order.indexOf(sel) === order.length - 1) setSel(order[0]);
    setPlaying((p) => !p);
  };

  return (
    <section id="architecture" className="relative py-28 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="04"
          eyebrow="Engineering & architecture"
          title={
            <>
              How I design <span className="font-serif font-normal italic text-gradient">AI systems.</span>
            </>
          }
          lede="The patterns behind the projects. Pick a system, click any component, or trace a request through it end to end."
        />

        <Reveal>
          <div role="tablist" aria-label="Architectures" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
            {diagrams.map((x, i) => (
              <button
                key={x.id}
                role="tab"
                type="button"
                aria-selected={i === di}
                onClick={() => { setDi(i); setSel(diagrams[i].nodes[0].id); setPlaying(false); }}
                className={`shrink-0 rounded-lg border px-3.5 py-2 font-mono text-[12px] transition ${
                  i === di ? "border-cyan/40 bg-cyan/[0.08] text-text" : "border-line text-muted hover:border-line-strong hover:text-text"
                }`}
              >
                <span className="mr-2 text-faint">{String(i + 1).padStart(2, "0")}</span>
                {x.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="card overflow-hidden rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
              <p className="text-[14px] text-muted">{d.summary}</p>
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-white/[0.03] px-3 py-1.5 font-mono text-[12px] text-text transition hover:border-cyan/50"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? "Pause" : "Trace data flow"}
              </button>
            </div>

            <div>
              {/* Desktop / tablet: diagram */}
              <div className="relative hidden md:block">
                <svg viewBox="-10 20 1020 420" className="h-auto w-full" role="group" aria-label={`${d.label} diagram`}>
                  <defs>
                    <linearGradient id="edge-hot" x1="0" x2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M0 0 L10 5 L0 10 z" fill="rgba(148,163,184,0.45)" />
                    </marker>
                  </defs>
                  <AnimatePresence mode="wait">
                    <motion.g key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                      {d.edges.map(([a, b]) => {
                        const hot = a === sel || b === sel;
                        const p = edgePath(d, a, b);
                        return (
                          <g key={`${a}-${b}`}>
                            <path d={p} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1.2" markerEnd="url(#arrow)" />
                            {hot && <path d={p} fill="none" stroke="url(#edge-hot)" strokeWidth="1.8" className={reduce ? "" : "edge-flow"} />}
                          </g>
                        );
                      })}
                      {d.nodes.map((n) => {
                        const on = n.id === sel;
                        const near = linked.has(n.id);
                        return (
                          <g
                            key={n.id}
                            role="button"
                            tabIndex={0}
                            aria-pressed={on}
                            aria-label={`${n.label}: ${n.detail}`}
                            onClick={() => { setPlaying(false); setSel(n.id); }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPlaying(false); setSel(n.id); }
                            }}
                            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-cyan"
                            style={{ transition: "opacity .3s" }}
                            opacity={on || near || !sel ? 1 : 0.55}
                          >
                            {on && <rect x={n.x - NW / 2 - 6} y={n.y - NH / 2 - 6} width={NW + 12} height={NH + 12} rx="14" fill="rgba(34,211,238,0.08)" />}
                            <rect
                              x={n.x - NW / 2}
                              y={n.y - NH / 2}
                              width={NW}
                              height={NH}
                              rx="10"
                              fill={on ? "#0f1a2b" : "#0a101b"}
                              stroke={on ? "#22d3ee" : near ? "rgba(139,92,246,0.6)" : "rgba(148,163,184,0.22)"}
                              strokeWidth={on ? 1.5 : 1}
                            />
                            <circle cx={n.x - NW / 2 + 14} cy={n.y} r="3" fill={on ? "#22d3ee" : near ? "#8b5cf6" : "#334155"} />
                            <text x={n.x + 6} y={n.y + 4.5} textAnchor="middle" fontSize="13" fill={on ? "#e7ecf5" : "#aab4c5"} style={{ fontFamily: "var(--font-geist-mono)" }}>
                              {n.label}
                            </text>
                          </g>
                        );
                      })}
                    </motion.g>
                  </AnimatePresence>
                </svg>
              </div>

              {/* Mobile: ordered steps */}
              <ol className="space-y-1.5 p-4 md:hidden">
                {order.map((id, i) => {
                  const n = d.nodes.find((x) => x.id === id)!;
                  const on = id === sel;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => { setPlaying(false); setSel(id); }}
                        aria-pressed={on}
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left font-mono text-[12.5px] transition ${
                          on ? "border-cyan/50 bg-cyan/[0.07] text-text" : "border-line text-muted"
                        }`}
                      >
                        <span className="text-faint">{String(i + 1).padStart(2, "0")}</span>
                        {n.label}
                      </button>
                    </li>
                  );
                })}
              </ol>

              <aside className="grid gap-6 border-t border-line p-6 md:grid-cols-[180px_1fr_260px] md:items-start md:gap-10" aria-live="polite">
                <div>
                  <p className="font-mono text-[11px] text-faint">
                    step {String(step).padStart(2, "0")} / {String(order.length).padStart(2, "0")}
                  </p>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div className="h-full bg-gradient-to-r from-cyan to-violet" animate={{ width: `${(step / order.length) * 100}%` }} transition={{ duration: 0.4 }} />
                  </div>
                </div>
                <motion.div
                  key={d.id + sel}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="text-xl font-semibold tracking-tight text-text">{node.label}</h3>
                  <p className="mt-2 text-pretty leading-relaxed text-muted">{node.detail}</p>
                </motion.div>
                <p className="text-[12.5px] leading-relaxed text-faint">
                  <span className="eyebrow mb-1.5 block">Connected</span>
                  {[...linked].filter((x) => x !== sel).map((x) => d.nodes.find((n) => n.id === x)!.label).join(" · ") || "none"}
                </p>
              </aside>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
