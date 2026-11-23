"use client";

import { ArrowUpRight, Check, Copy, Download, Mail, Send } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { Magnetic } from "./ui/Magnetic";
import { Reactor } from "./ui/Reactor";
import { Reveal } from "./ui/Reveal";

/**
 * GitHub Pages has no server, so the form opens the visitor's mail app with the message
 * pre-filled (mailto). To receive messages directly instead, set NEXT_PUBLIC_FORM_ENDPOINT
 * to a form service URL (e.g. Formspree) at build time; the form will POST there.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export function Contact() {
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
    <section id="contact" data-tone="gold" className="relative overflow-hidden bg-gold py-20 text-ink md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="halftone absolute inset-0 text-orange/60" />
        <Reactor className="absolute -right-40 -top-32 w-[640px] opacity-[0.16] [&_*]:!stroke-ink [&_circle[fill]]:!fill-ink" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="tag bg-ink text-ivory shadow-[4px_4px_0_0_var(--red)]">
              <span>{"07 // Contact"}</span>
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-7 text-balance text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl">
              Have an interesting <span className="font-serif font-normal italic text-gradient">problem to solve?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg font-medium leading-relaxed text-ink/85">
              I&apos;m always interested in building intelligent products, exploring new engineering challenges, and connecting with
              people working on meaningful technology.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <a
                  href={`mailto:${site.email}`}
                  className="group relative inline-flex min-h-12 items-center gap-2 border-2 border-ink bg-ink px-6 py-3.5 text-[15px] font-bold text-ivory shadow-[6px_6px_0_0_var(--red)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--red)] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Mail className="h-4 w-4" />
                  {site.email}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
              <button
                type="button"
                onClick={copy}
                className="inline-flex min-h-12 items-center gap-2 border-2 border-ink px-4 py-3.5 text-[14px] font-bold text-ink transition-colors hover:bg-ink hover:text-gold"
                aria-live="polite"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
                className="group flex items-center gap-4 border-[3px] border-ink bg-ivory p-5 shadow-[6px_6px_0_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_var(--red)]"
              >
                <span className="grid h-11 w-11 place-items-center border-2 border-ink bg-ink text-gold">
                  <l.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-extrabold text-ink">{l.label}</span>
                  <span className="block truncate font-mono text-[12px] font-medium text-ink/70">{l.sub}</span>
                </span>
                <ArrowUpRight className="ml-auto h-5 w-5 text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
            <a
              href={site.resume}
              download="Sudhanshu_Singh_Resume.pdf"
              className="group flex items-center gap-4 border-[3px] border-ink bg-red p-5 text-white shadow-[6px_6px_0_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_var(--ivory)]"
            >
              <span className="grid h-11 w-11 place-items-center border-2 border-ink bg-gold text-ink">
                <Download className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-extrabold">Resume</span>
                <span className="block font-mono text-[12px] font-medium text-white/90">PDF · AI Engineer, LLM &amp; backend</span>
              </span>
              <ArrowUpRight className="ml-auto h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <p className="px-1 pt-2 font-mono text-[11.5px] font-medium text-ink/75">{site.location}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={submit} className="border-[3px] border-ink bg-graphite p-6 text-text shadow-[9px_9px_0_0_var(--ink)] md:p-7" aria-describedby="form-note">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[12px] font-semibold text-gold">Name</span>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className="field"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[12px] font-semibold text-gold">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="field"
                    placeholder="you@company.com"
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block font-mono text-[12px] font-semibold text-gold">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="field resize-y"
                  placeholder="What are you building?"
                />
              </label>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p id="form-note" className="font-mono text-[11px] text-muted" aria-live="polite">
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
                  className="btn-primary !px-5 !py-2.5 !text-[14px] disabled:opacity-60"
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
