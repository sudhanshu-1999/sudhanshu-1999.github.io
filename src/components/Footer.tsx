import { nav, site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight text-text">{site.name}</p>
          <p className="mt-1 font-serif text-lg italic text-muted">{site.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="transition hover:text-text">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition hover:text-text">
            <GithubIcon />
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition hover:text-text">
            <LinkedinIcon />
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-line px-4 py-5 font-mono text-[11px] text-faint sm:px-6">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Built with Next.js, TypeScript, Tailwind &amp; Motion</span>
      </div>
    </footer>
  );
}
