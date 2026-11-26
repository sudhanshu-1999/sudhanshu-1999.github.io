"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play, X, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { diagrams, type ArchDiagram, type Pillar } from "@/content/architecture";
import { SectionHeader } from "./ui/SectionHeader";
import { Reveal } from "./ui/Reveal";
import { ProductionDetail } from "./ProductionDetail";

const PILLAR_COLOR: Record<Pillar, string> = {
  Reliability: "#28bfff",
  Scalability: "#ffc247",
  Cost: "#ff6b35",
  Observability: "#7bd88f",
  Security: "#e63936",
};

const NW = 140; // node width
const NH = 44; // node height

/** Breadth-first order from the first node. `primary` follows normal edges only and is what
 *  "Trace data flow" plays; `order` also lists nodes reachable only through fallback edges (last). */
function flowOrder(d: ArchDiagram) {
  const seen = new Set<string>([d.nodes[0].id]);
  const order = [d.nodes[0].id];
  const walk = (edges: [string, string][]) => {
    for (let i = 0; i < order.length; i++) {
      for (const [a, b] of edges) if (a === order[i] && !seen.has(b)) { seen.add(b); order.push(b); }
    }
  };
  walk(d.edges);
  const primary = [...order];
  walk([...d.edges, ...(d.fallbackEdges ?? [])]);
  return { order, primary };
}

type Route = { route: string[]; used: Set<string>; outcome: "rerouted" | "stops" | "offpath" };

/** The trace when `broken` fails: the primary path up to it, then the nearest fallback upstream
 *  (if the design has one), then onwards from where the fallback rejoins. */
function failureRoute(d: ArchDiagram, primary: string[], broken: string): Route {
  const at = primary.indexOf(broken);
  if (at < 0) return { route: primary, used: new Set(), outcome: "offpath" };
  const fb = d.fallbackEdges ?? [];
  const route = primary.slice(0, at + 1);
  let src: string | null = null;
  for (let i = at; i >= 0 && !src; i--) if (fb.some(([a]) => a === route[i])) src = route[i];
  if (!src) return { route, used: new Set(), outcome: "stops" };
  const used = new Set<string>();
  const seen = new Set(route);
  const queue = [src];
  while (queue.length) {
    const cur = queue.shift()!;
    const out = cur === src ? fb : [...fb, ...d.edges];
    for (const [a, b] of out) {
      if (a !== cur || seen.has(b) || b === broken) continue;
      seen.add(b);
      route.push(b);
      used.add(`${a}>${b}`);
      queue.push(b);
    }
  }
  return { route, used, outcome: "rerouted" };
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
  const [broken, setBroken] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const { order, primary } = useMemo(() => flowOrder(d), [d]);
  const failure = useMemo(() => (broken ? failureRoute(d, primary, broken) : null), [d, primary, broken]);
  const trace = failure ? failure.route : primary;

  useEffect(() => {
    if (!playing) { if (timer.current) clearInterval(timer.current); return; }
    let i = trace.indexOf(sel);
    timer.current = setInterval(() => {
      i += 1;
      if (i >= trace.length) { setPlaying(false); return; }
      setSel(trace[i]);
    }, 1100);
    return () => { if (timer.current) clearInterval(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, trace]);

  const node = d.nodes.find((n) => n.id === sel)!;
  const fallbackEdges = d.fallbackEdges ?? [];
  const linked = new Set([...d.edges, ...fallbackEdges].filter(([a, b]) => a === sel || b === sel).flat());
  const at = trace.indexOf(sel);
  const step = at + 1;
  const label = (id: string) => d.nodes.find((n) => n.id === id)!.label;

  const togglePlay = () => {
    if (!playing && at === trace.length - 1) setSel(trace[0]);
    setPlaying((p) => !p);
  };

  /** Click on a component: break it while picking, otherwise just select it. */
  const choose = (id: string) => {
    if (picking) {
      setPicking(false);
      setBroken(id);
      setSel(d.nodes[0].id);
      setPlaying(true);
      return;
    }
    setPlaying(false);
    setSel(id);
  };

  const toggleFailure = () => {
    setPlaying(false);
    if (broken) { setBroken(null); setSel(d.nodes[0].id); return; }
    setPicking((p) => !p);
  };

  const outcomeText = !failure || !broken
    ? ""
    : failure.outcome === "rerouted"
      ? `${label(broken)} fails. The run is rerouted through ${failure.route.slice(failure.route.indexOf(broken) + 1).filter((id) => d.fallbackEdges?.some(([, b]) => b === id)).map(label).join(" → ")} and carries on.`
      : failure.outcome === "stops"
        ? `${label(broken)} fails. No fallback path is drawn for it, so the trace stops here.`
        : `${label(broken)} sits on the degraded path only, so a normal run is not affected.`;

  return (
    <section id="architecture" className="relative overflow-hidden bg-ink py-20 md:py-28">
      <div aria-hidden="true" className="blueprint-blue pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/3 hidden h-40 w-[130%] -rotate-6 bg-graphite/80 lg:block" />
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
          <div role="tablist" aria-label="Architectures" className="-mx-4 mb-8 flex gap-3 overflow-x-auto px-4 pb-2">
            {diagrams.map((x, i) => (
              <button
                key={x.id}
                role="tab"
                type="button"
                aria-selected={i === di}
                onClick={() => { setDi(i); setSel(diagrams[i].nodes[0].id); setPlaying(false); setBroken(null); setPicking(false); }}
                className={`shrink-0 border-2 px-4 py-2.5 font-mono text-[12px] font-semibold transition ${
                  i === di ? "border-ink bg-blue text-ink shadow-[4px_4px_0_0_var(--gold)]" : "border-line-strong text-text hover:border-blue hover:text-blue"
                }`}
              >
                <span className={`mr-2 ${i === di ? "text-ink/70" : "text-faint"}`}>{String(i + 1).padStart(2, "0")}</span>
                {x.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="hud bg-graphite shadow-[10px_10px_0_0_var(--blue)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line-strong px-5 py-3">
              <p className="text-[14px] font-medium text-text">{d.summary}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={toggleFailure}
                  aria-pressed={picking || !!broken}
                  className={`inline-flex min-h-10 items-center gap-2 border-2 px-3.5 font-mono text-[12px] font-bold shadow-[3px_3px_0_0_var(--gold)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 ${
                    picking || broken ? "border-ink bg-red text-white" : "border-ink bg-blue text-ink"
                  }`}
                >
                  {picking || broken ? <X className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
                  {broken ? "Clear failure" : picking ? "Cancel" : "Inject failure"}
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex min-h-10 items-center gap-2 border-2 border-ink bg-gold px-3.5 font-mono text-[12px] font-bold text-ink shadow-[3px_3px_0_0_var(--red)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
                >
                  {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {playing ? "Pause" : broken ? "Replay failure" : "Trace data flow"}
                </button>
              </div>
            </div>

            <p
              aria-live="polite"
              className={`border-b-2 border-line-strong px-5 py-2.5 font-mono text-[12px] ${picking || broken ? "bg-red/15 text-text" : "hidden"}`}
            >
              {picking ? "Failure mode: click any component to break it." : outcomeText}
            </p>

            <div>
              {d.nodes.some((n) => n.pillar) && (
                <ul className="flex flex-wrap gap-x-5 gap-y-1.5 border-b border-line-strong px-5 py-2.5 font-mono text-[11px] text-muted" aria-label="Production concerns">
                  {(Object.keys(PILLAR_COLOR) as Pillar[]).map((k) => (
                    <li key={k} className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="h-2.5 w-2.5" style={{ background: PILLAR_COLOR[k] }} />
                      {k}
                    </li>
                  ))}
                </ul>
              )}
              {/* Desktop / tablet: diagram */}
              <div className="relative hidden md:block">
                <svg viewBox="-10 20 1020 420" className="h-auto w-full" role="group" aria-label={`${d.label} diagram`}>
                  <defs>
                    <linearGradient id="edge-hot" x1="0" x2="1">
                      <stop offset="0%" stopColor="#ff6b35" />
                      <stop offset="100%" stopColor="#ffc247" />
                    </linearGradient>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M0 0 L10 5 L0 10 z" fill="rgba(245,240,230,0.5)" />
                    </marker>
                  </defs>
                  <AnimatePresence mode="wait">
                    <motion.g key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                      {d.edges.map(([a, b]) => {
                        const hot = a === sel || b === sel;
                        const p = edgePath(d, a, b);
                        return (
                          <g key={`${a}-${b}`}>
                            <path d={p} fill="none" stroke="rgba(245,240,230,0.28)" strokeWidth="1.4" markerEnd="url(#arrow)" />
                            {hot && <path d={p} fill="none" stroke="url(#edge-hot)" strokeWidth="2.6" className={reduce ? "" : "edge-flow"} />}
                          </g>
                        );
                      })}
                      {fallbackEdges.map(([a, b]) => {
                        const hot = a === sel || b === sel;
                        const p = edgePath(d, a, b);
                        return (
                          <path
                            key={`fb-${a}-${b}`}
                            d={p}
                            fill="none"
                            stroke={failure?.used.has(`${a}>${b}`) ? "#ff6b35" : hot ? "#e63936" : "rgba(230,57,54,0.5)"}
                            strokeWidth={failure?.used.has(`${a}>${b}`) ? 3.2 : hot ? 2.4 : 1.4}
                            strokeDasharray="6 5"
                            markerEnd="url(#arrow)"
                          />
                        );
                      })}
                      {d.nodes.map((n) => {
                        const on = n.id === sel;
                        const near = linked.has(n.id);
                        const bad = n.id === broken;
                        return (
                          <g
                            key={n.id}
                            role="button"
                            tabIndex={0}
                            aria-pressed={on}
                            aria-label={`${n.label}: ${n.detail}${bad ? " (failure injected)" : ""}`}
                            onClick={() => choose(n.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(n.id); }
                            }}
                            className="cursor-pointer outline-none [&:focus-visible>rect:last-of-type]:stroke-gold"
                            style={{ transition: "opacity .3s" }}
                            opacity={on || near || !sel ? 1 : 0.72}
                          >
                            {on && <rect x={n.x - NW / 2 + 6} y={n.y - NH / 2 + 6} width={NW} height={NH} fill="#e63936" />}
                            <rect
                              x={n.x - NW / 2}
                              y={n.y - NH / 2}
                              width={NW}
                              height={NH}
                              rx="0"
                              fill={bad ? "#e63936" : on ? "#ffc247" : "#101114"}
                              stroke={bad ? "#ffc247" : on ? "#101114" : near ? "#28bfff" : "rgba(245,240,230,0.4)"}
                              strokeWidth={on ? 2.5 : 1.6}
                            />
                            <circle cx={n.x - NW / 2 + 14} cy={n.y} r={n.pillar ? 4 : 3} fill={n.pillar ? PILLAR_COLOR[n.pillar] : on ? "#e63936" : near ? "#28bfff" : "#8e8a80"} />
                            <text x={n.x + 6} y={n.y + 4.5} textAnchor="middle" fontSize="13" fill={bad ? "#ffffff" : on ? "#101114" : "#f5f0e6"} fontWeight={on || bad ? 700 : 500} style={{ fontFamily: "var(--font-plex-mono)" }}>
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
                        onClick={() => choose(id)}
                        aria-pressed={on}
                        className={`flex min-h-11 w-full items-center gap-3 border-2 px-3 py-2.5 text-left font-mono text-[12.5px] font-medium transition ${
                          on ? "border-ink bg-gold text-ink shadow-[3px_3px_0_0_var(--red)]" : "border-line-strong text-text"
                        }`}
                      >
                        <span className={on ? "text-ink/70" : "text-faint"}>{String(i + 1).padStart(2, "0")}</span>
                        {n.label}
                        {id === broken && <span className="ml-auto text-red">failed</span>}
                      </button>
                    </li>
                  );
                })}
              </ol>

              <aside className="grid gap-6 border-t-2 border-line-strong p-6 md:grid-cols-[180px_1fr_260px] md:items-start md:gap-10" aria-live="polite">
                <div>
                  <p className="font-mono text-[11px] text-faint">
                    {step > 0 ? `step ${String(step).padStart(2, "0")} / ${String(trace.length).padStart(2, "0")}` : "off the main path"}
                  </p>
                  <div className="mt-3 h-2 overflow-hidden border border-line-strong bg-ink">
                    <motion.div className="h-full bg-gradient-to-r from-red to-gold" animate={{ width: `${(step / trace.length) * 100}%` }} transition={{ duration: 0.4 }} />
                  </div>
                </div>
                <motion.div
                  key={d.id + sel}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="text-2xl font-extrabold tracking-tight text-gold">{node.label}</h3>
                  {node.pillar && (
                    <p className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted">
                      <span aria-hidden="true" className="h-2.5 w-2.5" style={{ background: PILLAR_COLOR[node.pillar] }} />
                      {node.pillar}
                    </p>
                  )}
                  <p className="mt-2 text-pretty leading-relaxed text-muted">{node.detail}</p>
                  {node.fail && (
                    <p className="mt-3 border-l-4 border-red pl-3 text-[13px] leading-relaxed text-muted">
                      <span className="eyebrow mb-1 block text-red">{sel === broken ? "Failure injected: what happens" : "If it fails"}</span>
                      {node.fail}
                    </p>
                  )}
                </motion.div>
                <p className="text-[12.5px] leading-relaxed text-muted">
                  <span className="eyebrow mb-1.5 block text-blue">Connected</span>
                  {[...linked].filter((x) => x !== sel).map((x) => d.nodes.find((n) => n.id === x)!.label).join(" · ") || "none"}
                </p>
              </aside>
              <ProductionDetail nodeKey={`${d.id}.${sel}`} label={node.label} isBroken={sel === broken} playing={playing} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
