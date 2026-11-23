"use client";

import { AnimatePresence, motion } from "motion/react";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface-solid focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className={`flex w-full max-w-6xl items-center justify-between px-3 py-2 transition-all duration-300 ${
          scrolled ? "border-2 border-ink bg-graphite shadow-[5px_5px_0_0_var(--red)]" : "border-2 border-ink/70 bg-graphite/90 shadow-[3px_3px_0_0_var(--ink)]"
        }`}
      >
        <a href="#top" className="group flex items-center gap-2.5 rounded-lg px-2 py-1" aria-label="Sudhanshu Singh, back to top">
          <span className="relative grid h-8 w-8 place-items-center bg-gold font-mono text-[12px] font-extrabold text-ink [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]">
            SS
            <span className="absolute bottom-1 left-1 h-1 w-1 bg-red" />
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-text lg:block">Sudhanshu Singh</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active === n.id ? "true" : undefined}
                className={`group relative z-0 block px-2.5 py-2 text-[13px] lg:px-3.5 transition-colors ${
                  active === n.id ? "text-ink font-semibold" : "text-muted hover:text-text"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-0 h-[3px] origin-left scale-x-0 bg-red transition-transform duration-300 group-hover:scale-x-100"
                />
                {active === n.id && (
                  <motion.span
                    layoutId="nav-block"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 -skew-x-12 border-2 border-ink bg-gold shadow-[3px_3px_0_0_var(--red)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={site.resume}
            download="Sudhanshu_Singh_Resume.pdf"
            className="hidden min-h-9 items-center gap-1.5 border-2 border-line-strong px-3 font-semibold text-[13px] text-text transition hover:border-gold hover:bg-gold hover:text-ink sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" /> Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center border-2 border-line-strong text-text md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-4 top-[72px] border-2 border-ink bg-graphite p-2 shadow-[6px_6px_0_0_var(--red)] md:hidden"
          >
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-4 py-3 text-[15px] text-text transition-colors hover:bg-gold hover:text-ink"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.resume}
                  download="Sudhanshu_Singh_Resume.pdf"
                  className="mt-1 flex items-center gap-2 px-4 py-3 text-[15px] font-semibold text-gold transition-colors hover:bg-gold hover:text-ink"
                >
                  <Download className="h-4 w-4" /> Download resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
