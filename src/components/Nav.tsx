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
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-3 py-2 transition-all duration-500 ${
          scrolled ? "glass shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]" : "border border-transparent"
        }`}
      >
        <a href="#top" className="group flex items-center gap-2.5 rounded-lg px-2 py-1" aria-label="Sudhanshu Singh, back to top">
          <span className="relative grid h-7 w-7 place-items-center rounded-lg border border-line-strong bg-bg-2 font-mono text-[11px] font-semibold text-text">
            SS
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-cyan" />
          </span>
          <span className="hidden text-sm font-medium tracking-tight text-text sm:block">Sudhanshu Singh</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active === n.id ? "true" : undefined}
                className={`relative rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                  active === n.id ? "text-text" : "text-muted hover:text-text"
                }`}
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/[0.06]"
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
            className="hidden items-center gap-1.5 rounded-lg border border-line-strong bg-white/[0.03] px-3 py-1.5 text-[13px] text-text transition hover:border-cyan/50 hover:bg-cyan/[0.06] sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" /> Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-text md:hidden"
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
            className="glass absolute inset-x-4 top-[72px] rounded-2xl p-2 md:hidden"
          >
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-[15px] text-text hover:bg-white/5"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.resume}
                  download="Sudhanshu_Singh_Resume.pdf"
                  className="mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-[15px] text-cyan hover:bg-white/5"
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
