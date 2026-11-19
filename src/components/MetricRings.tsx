"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Metric } from "@/content/site";

/** Lightweight animated gauges for verified model metrics. */
export function MetricRings({ metrics, note }: { metrics: Metric[]; note?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const R = 30;
  const C = 2 * Math.PI * R;

  return (
    <div ref={ref}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m, i) => (
          <div key={m.label} className="flex flex-col items-center rounded-xl border border-line bg-white/[0.015] px-2 py-4">
            <div className="relative h-20 w-20">
            <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90" aria-hidden="true">
              <defs>
                <linearGradient id={`g-${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="5" />
              <motion.circle
                cx="40"
                cy="40"
                r={R}
                fill="none"
                stroke={`url(#g-${i})`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: reduce ? C * (1 - m.value / 100) : C }}
                animate={inView ? { strokeDashoffset: C * (1 - m.value / 100) } : undefined}
                transition={{ duration: 1.4, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <p className="absolute inset-0 grid place-items-center font-mono text-[14px] font-semibold text-text">{m.display}</p>
            </div>
            <p className="mt-2 text-[12px] text-muted">{m.label}</p>
          </div>
        ))}
      </div>
      {note && <p className="mt-3 font-mono text-[11px] leading-relaxed text-faint">{note}</p>}
      <p className="sr-only">
        Metrics: {metrics.map((m) => `${m.label} ${m.display}`).join(", ")}.
      </p>
    </div>
  );
}
