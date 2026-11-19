"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, Download, Mail, Send } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { Magnetic } from "./ui/Magnetic";
import { Reveal } from "./ui/Reveal";

/**
 * GitHub Pages has no server, so the form opens the visitor's mail app with the message
 * pre-filled (mailto). To receive messages directly instead, set NEXT_PUBLIC_FORM_ENDPOINT
 * to a form service URL (e.g. Formspree) at build time; the form will POST there.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export function Contact() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get("name") || "").trim();
    const from = String(f.get("email") || "").trim();
    const msg = String(f.get("message") || "").trim();

    if (FORM_ENDPOINT) {
      setState("sending");
      try {
        const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: f });
        setState(r.ok ? "sent" : "error");
        if (r.ok) form.reset();
      } catch {
        setState("error");
      }
      return;
    }
    const subject = encodeURIComponent(`Hello from ${name || "your portfolio"}`);
    const body = encodeURIComponent(`${msg}\n\n${name}${from ? ` <${from}>` : ""}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setState("sent");
  };

  const links = [
    { label: "LinkedIn", href: site.linkedin, icon: LinkedinIcon, sub: "in/sudhanshu-singh-1b3174179" },
    { label: "GitHub", href: site.github, icon: GithubIcon, sub: "sudhanshu-1999" },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgba(34,211,238,0.10),rgba(59,130,246,0.06),rgba(139,92,246,0.12),rgba(34,211,238,0.10))] blur-3xl"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow">
              <span className="text-cyan">07</span> · Contact
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.035em] text-text sm:text-5xl md:text-6xl">
              Have an interesting <span className="font-serif font-normal italic text-gradient">problem to solve?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              I&apos;m always interested in building intelligent products, exploring new engineering challenges, and connecting with
              people working on meaningful technology.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <a
                  href={`mailto:${site.email}`}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-text px-6 py-3.5 text-[15px] font-medium text-bg transition hover:bg-white"
                >
                  <Mail className="h-4 w-4" />
                  {site.email}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-white/[0.03] px-4 py-3.5 text-[14px] text-text transition hover:border-cyan/50"
                aria-live="polite"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy email"}
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-5 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="grid gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="card group flex items-center gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-line-strong"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white/[0.03] text-text">
                  <l.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-text">{l.label}</span>
                  <span className="block truncate font-mono text-[12px] text-faint">{l.sub}</span>
                </span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-faint transition group-hover:text-text" />
              </a>
            ))}
            <a
              href={site.resume}
              download="Sudhanshu_Singh_Resume.pdf"
              className="card group flex items-center gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-line-strong"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan/30 bg-cyan/[0.08] text-cyan">
                <Download className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-medium text-text">Resume</span>
                <span className="block font-mono text-[12px] text-faint">PDF · AI Engineer, LLM &amp; backend</span>
              </span>
              <ArrowUpRight className="ml-auto h-4 w-4 text-faint transition group-hover:text-text" />
            </a>
            <p className="px-1 pt-2 font-mono text-[11.5px] text-faint">{site.location}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={submit} className="card rounded-2xl p-6 md:p-7" aria-describedby="form-note">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] text-muted">Name</span>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full rounded-lg border border-line bg-bg/60 px-3.5 py-2.5 text-[15px] text-text outline-none transition placeholder:text-faint focus:border-cyan/50"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] text-muted">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-lg border border-line bg-bg/60 px-3.5 py-2.5 text-[15px] text-text outline-none transition placeholder:text-faint focus:border-cyan/50"
                    placeholder="you@company.com"
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[13px] text-muted">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-y rounded-lg border border-line bg-bg/60 px-3.5 py-2.5 text-[15px] text-text outline-none transition placeholder:text-faint focus:border-cyan/50"
                  placeholder="What are you building?"
                />
              </label>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p id="form-note" className="font-mono text-[11px] text-faint" aria-live="polite">
                  {state === "sent"
                    ? FORM_ENDPOINT
                      ? "Thanks, message sent."
                      : "Your mail app should open with the message ready."
                    : state === "error"
                      ? "Couldn't send. Please email me directly."
                      : FORM_ENDPOINT
                        ? "Goes straight to my inbox."
                        : "Opens your mail app, nothing is stored."}
                </p>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan to-blue px-4 py-2.5 text-[14px] font-medium text-bg transition hover:brightness-110 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" /> {state === "sending" ? "Sending…" : "Send message"}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
