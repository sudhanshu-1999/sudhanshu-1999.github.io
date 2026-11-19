import { Reveal } from "./Reveal";

type Props = { index: string; eyebrow: string; title: React.ReactNode; lede?: string };

export function SectionHeader({ index, eyebrow, title, lede }: Props) {
  return (
    <div className="mb-14 max-w-3xl md:mb-20">
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-cyan">{index}</span>
          <span className="h-px w-8 bg-line-strong" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.03em] text-text md:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
