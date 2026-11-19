"use client";

import { motion, useReducedMotion } from "motion/react";

const accents = {
  cyan: "from-cyan/70 to-blue/70",
  violet: "from-violet/70 to-blue/70",
  blue: "from-blue/70 to-cyan/70",
} as const;

/** A compact left-to-right pipeline: step pills joined by a line with a travelling signal. */
export function FlowStrip({
  steps,
  accent = "cyan",
  compact = false,
  vertical = false,
}: {
  steps: string[];
  accent?: keyof typeof accents;
  compact?: boolean;
  vertical?: boolean;
}) {
  const reduce = useReducedMotion();
  if (vertical) {
    return (
      <ol className="relative space-y-2.5" aria-label="Pipeline">
        <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-px bg-line-strong" />
        {steps.map((s, i) => (
          <li key={s} className="relative flex items-center gap-3">
            <span className="relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line-strong bg-surface-solid font-mono text-[9.5px] text-muted">
              {i + 1}
            </span>
            <span className="font-mono text-[12px] text-text/80">{s}</span>
            {!reduce && (
              <motion.span
                aria-hidden="true"
                className="ml-auto h-1 w-1 rounded-full bg-cyan"
                animate={{ opacity: [0.15, 1, 0.15] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
              />
            )}
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className="flex flex-wrap items-center gap-y-2" aria-label="Pipeline">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center">
          <span
            className={`whitespace-nowrap rounded-md border border-line bg-white/[0.025] font-mono text-text/80 ${
              compact ? "px-2 py-1 text-[10.5px]" : "px-2.5 py-1.5 text-[11.5px]"
            }`}
          >
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className={`relative mx-1.5 block h-px overflow-hidden bg-line-strong ${compact ? "w-4" : "w-6"}`} aria-hidden="true">
              {!reduce && (
                <motion.span
                  className={`absolute inset-y-0 w-3 bg-gradient-to-r ${accents[accent]}`}
                  initial={{ x: "-100%" }}
                  animate={{ x: "300%" }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                />
              )}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
