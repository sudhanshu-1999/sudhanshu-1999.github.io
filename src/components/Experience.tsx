import { Award, Briefcase, GraduationCap } from "lucide-react";
import { experience } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeader } from "./ui/SectionHeader";

export function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden bg-ivory py-20 text-ink md:py-28">
      <div aria-hidden="true" className="halftone-rev pointer-events-none absolute bottom-0 right-0 h-80 w-[26rem] text-ink/20" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="05"
          eyebrow="Experience & education"
          tone="ivory"
          title={
            <>
              The <span className="font-serif font-normal italic text-gradient">trajectory.</span>
            </>
          }
        />

        <ol className="relative">
          <span aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-[4px] bg-ink md:left-[215px]" />
          {experience.map((e, i) => {
            const Icon = e.kind === "work" ? Briefcase : GraduationCap;
            const work = e.kind === "work";
            return (
              <Reveal as="li" key={e.title} delay={i * 0.06} className="relative grid gap-4 pb-14 pl-14 last:pb-0 md:grid-cols-[190px_1fr] md:gap-0 md:pl-0">
                <div className="md:pr-8 md:pt-2 md:text-right">
                  <p className={`tag ${work ? "bg-red text-white" : "bg-ink text-ivory"}`}>
                    <span>{e.period}</span>
                  </p>
                  {e.place && <p className="mt-2 font-mono text-[11px] font-medium text-ink/70">{e.place}</p>}
                </div>
                <span
                  className={`absolute left-0 top-0 grid h-10 w-10 place-items-center border-[3px] border-ink shadow-[3px_3px_0_0_var(--ink)] md:left-[196px] ${
                    work ? "bg-gold" : "bg-ivory-2"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="md:pl-16">
                  {work ? (
                    <div className="[filter:drop-shadow(9px_9px_0_var(--orange))]">
                      <div className="bg-ink p-6 text-text [clip-path:polygon(0_0,calc(100%-30px)_0,100%_30px,100%_100%,0_100%)] md:p-8">
                        <h3 className="text-2xl font-extrabold tracking-[-0.02em]">{e.title}</h3>
                        <p className="mt-0.5 font-semibold text-gold">{e.org}</p>
                        {e.points.length > 0 && (
                          <ul className="mt-5 space-y-3">
                            {e.points.map((p) => (
                              <li key={p} className="flex gap-3 text-pretty text-[14.5px] leading-relaxed text-text/85">
                                <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-red" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        )}
                        {e.honours.length > 0 && (
                          <ul className="mt-6 flex flex-wrap gap-3">
                            {e.honours.map((h, k) => (
                              <li
                                key={h}
                                className={`inline-flex items-center gap-1.5 border-2 border-ink bg-gold px-3 py-1.5 text-[12px] font-bold text-ink shadow-[3px_3px_0_0_var(--red)] ${k % 2 ? "rotate-1" : "-rotate-1"}`}
                              >
                                <Award className="h-3.5 w-3.5" /> {h}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <h3 className="text-xl font-extrabold tracking-[-0.02em] md:text-2xl">{e.title}</h3>
                      <p className="mt-1 inline-block bg-gold/60 px-1.5 font-semibold">{e.org}</p>
                      {e.points.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {e.points.map((p) => (
                            <li key={p} className="flex gap-3 text-pretty text-[14.5px] leading-relaxed text-ink/80">
                              <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-ink" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
