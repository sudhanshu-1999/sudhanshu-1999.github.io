/** Decorative reactor-style geometry: pure vector rings that rotate at different speeds. */
export function Reactor({ className }: { className?: string }) {
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  return (
    <svg viewBox="0 0 600 600" aria-hidden="true" className={className} fill="none">
      <g className="spin-slow" stroke="var(--gold)" strokeWidth="2">
        <circle cx="300" cy="300" r="286" opacity="0.5" />
        {ticks.map((i) => (
          <line
            key={i}
            x1="300"
            y1="14"
            x2="300"
            y2={i % 5 === 0 ? 38 : 26}
            transform={`rotate(${i * 6} 300 300)`}
            opacity={i % 5 === 0 ? 0.95 : 0.5}
          />
        ))}
      </g>
      <g className="spin-rev" stroke="var(--orange)" strokeWidth="3">
        <circle cx="300" cy="300" r="214" strokeDasharray="90 26" opacity="0.8" />
        <circle cx="300" cy="300" r="196" opacity="0.35" />
      </g>
      <g className="spin-fast" stroke="var(--blue)" strokeWidth="3">
        <polygon points="300,120 456,390 144,390" opacity="0.75" />
        <polygon points="300,480 144,210 456,210" opacity="0.35" />
      </g>
      <circle cx="300" cy="300" r="52" stroke="var(--red)" strokeWidth="4" />
      <circle cx="300" cy="300" r="20" fill="var(--red)" opacity="0.85" />
    </svg>
  );
}
