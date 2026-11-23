"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;
const FLAT = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";

const SHAPES = {
  rise: [
    "polygon(0% 62%, 100% 8%, 100% 100%, 0% 100%)",
    "polygon(0% 72%, 100% 22%, 100% 100%, 0% 100%)",
    "polygon(0% 82%, 100% 38%, 100% 100%, 0% 100%)",
  ],
  fall: [
    "polygon(0% 8%, 100% 62%, 100% 100%, 0% 100%)",
    "polygon(0% 22%, 100% 72%, 100% 100%, 0% 100%)",
    "polygon(0% 38%, 100% 82%, 100% 100%, 0% 100%)",
  ],
};

/**
 * Bold diagonal section break. Three slabs (gold, red, destination colour) slide up in turn when
 * the divider scrolls into view. `from` is the colour above, `to` the colour of the next section.
 */
export function Divider({
  from,
  to,
  dir = "rise",
  layers,
}: {
  from: string;
  to: string;
  dir?: "rise" | "fall";
  layers?: [string, string];
}) {
  const reduce = useReducedMotion();
  const colors = [layers?.[0] ?? "var(--gold)", layers?.[1] ?? "var(--red)", to];
  return (
    <div aria-hidden="true" className="relative h-16 overflow-hidden sm:h-24 md:h-32" style={{ background: from }}>
      {SHAPES[dir].map((shape, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ background: colors[i] }}
          initial={reduce ? { clipPath: shape } : { clipPath: FLAT }}
          whileInView={{ clipPath: shape }}
          viewport={{ once: true, margin: "0px 0px -5% 0px" }}
          transition={{ duration: 0.8, delay: i * 0.12, ease }}
        >
          {i === 1 && <div className="halftone absolute inset-0 text-ink/40" />}
        </motion.div>
      ))}
    </div>
  );
}
