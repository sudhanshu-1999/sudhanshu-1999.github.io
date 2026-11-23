import { nav, site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink">
      <div aria-hidden="true" className="halftone pointer-events-none absolute left-0 top-0 h-48 w-80 text-red/40" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-[-0.03em] text-text">{site.name}</p>
          <p className="mt-2 inline-block bg-gold px-2 py-0.5 font-mono text-[12px] font-semibold text-ink">{site.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-text">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="underline decoration-red decoration-2 underline-offset-[6px] transition hover:text-gold hover:decoration-gold">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center border-2 border-line-strong text-text transition hover:border-gold hover:bg-gold hover:text-ink">
            <GithubIcon />
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center border-2 border-line-strong text-text transition hover:border-gold hover:bg-gold hover:text-ink">
            <LinkedinIcon />
          </a>
        </div>
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t-2 border-line-strong px-4 py-5 font-mono text-[11px] text-muted sm:px-6">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Built with Next.js, TypeScript, Tailwind &amp; Motion</span>
      </div>
    </footer>
  );
}
