import { skillGroups } from "@/content/site";

/**
 * Infinite tech strip, inspired by React Bits "Logo Loop" (reactbits.dev, MIT + Commons Clause,
 * (c) David Haz). Original CSS implementation, no new dependency. Names come from `skillGroups`
 * (deduplicated), so nothing new is claimed. The second copy is aria-hidden; pauses on hover and
 * keyboard focus; under reduced motion it stops and wraps into a static list (see globals.css).
 */

const names = [...new Set(skillGroups.flatMap((g) => g.skills.map((s) => s.name)))];
const marks = ["bg-gold", "bg-orange", "bg-blue", "bg-red"] as const;

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {names.map((n, i) => (
        <li key={n} className="flex shrink-0 items-center gap-3 border-2 border-line-strong bg-ink/60 px-4 py-2 font-mono text-[12px] text-text">
          <span aria-hidden="true" className={`h-2 w-2 shrink-0 rotate-45 ${marks[i % marks.length]}`} />
          {n}
        </li>
      ))}
    </ul>
  );
}

export function TechMarquee() {
  return (
    <div className="marquee" role="group" aria-label="Technologies used across projects">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
