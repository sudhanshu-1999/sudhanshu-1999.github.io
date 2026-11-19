import { Award, Briefcase, GraduationCap } from "lucide-react";
import { experience } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeader } from "./ui/SectionHeader";

export function Experience() {
  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="05"
          eyebrow="Experience & education"
          title={
            <>
              The <span className="font-serif font-normal italic text-gradient">trajectory.</span>
            </>
          }
        />

        <ol className="relative">
          <span aria-hidden="true" className="absolute bottom-2 left-[15px] top-2 w-px bg-gradient-to-b from-cyan/60 via-line-strong to-transparent md:left-[211px]" />
          {experience.map((e, i) => {
            const Icon = e.kind === "work" ? Briefcase : GraduationCap;
            return (
              <Reveal as="li" key={e.title} delay={i * 0.06} className="relative grid gap-3 pb-12 pl-12 last:pb-0 md:grid-cols-[180px_1fr] md:gap-0 md:pl-0">
                <div className="md:pr-6 md:pt-1.5 md:text-right">
                  <p className="font-mono text-[12px] text-cyan">{e.period}</p>
                  {e.place && <p className="mt-1 font-mono text-[11px] text-faint">{e.place}</p>}
                </div>
                <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full border border-line-strong bg-bg text-muted md:left-[196px]">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="md:pl-16">
                <div className={e.kind === "work" ? "card rounded-2xl p-6" : "pt-0.5"}>
                  <h3 className="text-lg font-semibold tracking-tight text-text">{e.title}</h3>
                  <p className="mt-0.5 text-muted">{e.org}</p>
                  {e.points.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {e.points.map((p) => (
                        <li key={p} className="flex gap-3 text-pretty text-[14.5px] leading-relaxed text-text/75">
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-line-strong" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  {e.honours.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {e.honours.map((h) => (
                        <li key={h} className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1 text-[12px] text-amber-100/90">
                          <Award className="h-3 w-3" /> {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
