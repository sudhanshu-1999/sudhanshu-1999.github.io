"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/** Thin scroll-progress bar at the very top. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-red via-orange to-gold" style={{ scaleX: x }} />;
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 1.2);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center border-2 border-ink bg-gold text-ink shadow-[4px_4px_0_0_var(--red)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--red)]"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/**
 * Short boot sequence on page load (under a second). Rendered in the static HTML so there is
 * no flash of content first; a CSS failsafe hides it even if JavaScript never runs.
 */
export function Loader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [line, setLine] = useState(0);
  const lines = ["loading weights", "indexing projects", "ready"];

  useEffect(() => {
    const ms = reduce ? 0 : 1;
    const t1 = setTimeout(() => setLine(1), 300 * ms);
    const t2 = setTimeout(() => setLine(2), 600 * ms);
    const t3 = setTimeout(() => setDone(true), 900 * ms);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden="true"
          className="loader-failsafe fixed inset-0 z-[100] grid place-items-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-56">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center border-2 border-ink bg-gold font-mono text-[12px] font-bold text-ink">SS</span>
              <span className="text-sm text-text">Sudhanshu Singh</span>
            </div>
            <div className="h-px w-full overflow-hidden bg-line">
              <div className="loader-bar h-full bg-gradient-to-r from-red to-gold" />
            </div>
            <p className="mt-3 font-mono text-[11px] text-faint">
              <span className="text-gold">›</span> {lines[line]}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
