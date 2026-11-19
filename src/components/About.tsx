import { certifications, stats } from "@/content/site";
import { Counter } from "./ui/Counter";
import { Reveal } from "./ui/Reveal";
import { SectionHeader } from "./ui/SectionHeader";

const chapters = [
  {
    k: "Foundations",
    t: "Production software first.",
    d: "I joined CloudMetic in November 2022 and shipped enterprise systems across services, healthcare, finance and education: Apex, Lightning Web Components, integrations, and owning releases from design to production. That work taught me the unglamorous parts: platform limits, bulk-safe code, permissions, logging, and what breaks at 2 a.m.",
  },
  {
    k: "Transition",
    t: "Then AI moved into the stack.",
    d: "I joined the company's enterprise + LLM integration R&D and took document extraction and retrieval from prototype to a working internal service: an async submit → poll → retrieve pipeline, a FastAPI inference service, Docling parsing, chunking, embeddings and vector search, with retries, failure isolation and idempotent callbacks.",
  },
  {
    k: "Now",
    t: "Agents that are actually dependable.",
    d: "After IIT Delhi's Advanced AI & Deep Learning Programme, I focus on agentic systems and production RAG: typed state graphs, schema-validated tools, MCP, hybrid retrieval, guardrails and evaluation gates. Engineering fundamentals, applied to intelligence.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="01"
          eyebrow="About"
          title={
            <>
              From enterprise software to <span className="font-serif font-normal italic text-gradient">intelligent systems.</span>
            </>
          }
        />

        <div className="grid gap-16 lg:grid-cols-[1.25fr_1fr]">
          <div className="space-y-12">
            <Reveal>
              <p className="text-pretty text-2xl font-medium leading-snug tracking-tight text-text/90 md:text-[1.7rem]">
                I care about the part of AI that happens after the demo: making a model&apos;s output{" "}
                <span className="text-cyan">grounded</span>, its tools <span className="text-blue">safe</span>, and the system
                around it <span className="text-violet">recoverable</span> when something fails.
              </p>
            </Reveal>
            <ol className="relative space-y-10 border-l border-line pl-8">
              {chapters.map((c, i) => (
                <Reveal as="li" key={c.k} delay={i * 0.08} className="relative">
                  <span className="absolute -left-[39px] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border border-line-strong bg-bg">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  </span>
                  <p className="eyebrow">{c.k}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-text">{c.t}</h3>
                  <p className="mt-2 text-pretty leading-relaxed text-muted">{c.d}</p>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="space-y-4 lg:pt-2">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.06} className="card rounded-2xl p-5">
                  <p className="text-3xl font-semibold tracking-tight text-text md:text-4xl">
                    <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-muted">{s.label}</p>
                  <p className="mt-3 font-mono text-[10.5px] text-faint">{s.note}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.15} className="card rounded-2xl p-5">
              <p className="eyebrow mb-4">Certifications</p>
              <ul className="space-y-2.5">
                {certifications.map((c) => (
                  <li key={c.name} className="flex items-baseline justify-between gap-4 text-[13px]">
                    <span className="text-text/85">
                      {c.name}
                      <span className="ml-2 text-faint">· {c.issuer}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-faint">{c.year}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
