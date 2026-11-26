"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { nodeDetail } from "@/content/architecture-detail";

type Tab = "code" | "data" | "config" | "log";
const TABS: { id: Tab; label: string }[] = [
  { id: "code", label: "Code" },
  { id: "data", label: "Data" },
  { id: "config", label: "Config" },
  { id: "log", label: "Failure log" },
];

const TOKEN =
  /(#[^\n]*)|("""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(\d[\d,]*(?:\.\d+)?)\b|\b(import|from|def|async|await|class|return|if|else|elif|raise|with|as|not|and|or|in|for|while|lambda|None|True|False|true|false|null)\b/g;

/** Tiny highlighter for the Python and JSON shown here. Plain React nodes, no HTML injection. */
function highlight(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of src.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(src.slice(last, at));
    const cls = m[1] ? "text-faint italic" : m[2] ? "text-[#7bd88f]" : m[3] ? "text-orange" : "text-blue";
    out.push(<span key={k++} className={cls}>{m[0]}</span>);
    last = at + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

const LEVEL: Record<string, string> = { ERROR: "text-red", ALERT: "text-red", WARN: "text-gold", INFO: "text-blue" };

function Log({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const [lvl, ...rest] = line.split(/\s+/);
        return (
          <span key={i} className="block">
            <span className={`font-bold ${LEVEL[lvl] ?? "text-muted"}`}>{lvl}</span> {rest.join(" ")}
          </span>
        );
      })}
    </>
  );
}

type Props = { nodeKey: string; label: string; isBroken: boolean; playing: boolean };

/** Code, example data, typical settings and failure log for the selected component. */
export function ProductionDetail({ nodeKey, label, isBroken, playing }: Props) {
  const detail = nodeDetail[nodeKey];
  const [pick, setPick] = useState<{ key: string; tab: Tab } | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  if (!detail) return null;

  // While tracing the data tab follows the request; on the broken node the failure log opens.
  const fallback: Tab = isBroken ? "log" : playing ? "data" : "code";
  const tab = pick && pick.key === nodeKey ? pick.tab : fallback;

  /** Arrow keys, Home and End move between tabs, as in the standard tabs pattern. */
  const onKeyDown = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const next =
      e.key === "ArrowRight" ? (i + 1) % TABS.length
      : e.key === "ArrowLeft" ? (i - 1 + TABS.length) % TABS.length
      : e.key === "Home" ? 0
      : e.key === "End" ? TABS.length - 1
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setPick({ key: nodeKey, tab: TABS[next].id });
    tabRefs.current[TABS[next].id]?.focus();
  };

  return (
    <section className="border-t-2 border-line-strong p-6" aria-label={`${label}: production detail`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Production detail" onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              ref={(el) => { tabRefs.current[t.id] = el; }}
              id={`${nodeKey}-tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              aria-controls={`${nodeKey}-panel`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setPick({ key: nodeKey, tab: t.id })}
              className={`min-h-9 border-2 px-3 font-mono text-[12px] font-semibold transition ${
                tab === t.id
                  ? t.id === "log"
                    ? "border-ink bg-red text-white shadow-[3px_3px_0_0_var(--gold)]"
                    : "border-ink bg-blue text-ink shadow-[3px_3px_0_0_var(--gold)]"
                  : "border-line-strong text-text hover:border-blue hover:text-blue"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[11px] text-faint">
          {tab === "config" ? "typical values, tune per system" : tab === "log" ? "what the logs print" : "reference pattern, not a specific system"}
        </p>
      </div>

      <div role="tabpanel" id={`${nodeKey}-panel`} aria-labelledby={`${nodeKey}-tab-${tab}`} className="mt-4">
        {tab === "config" ? (
          <dl className="grid gap-px border border-line-strong bg-line-strong sm:grid-cols-2">
            {detail.config.map(([k, v]) => (
              <div key={k} className="bg-ink px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-faint">{k}</dt>
                <dd className="mt-1 font-mono text-[13px] text-text">{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <pre className="overflow-x-auto border border-line-strong bg-ink p-4 font-mono text-[12.5px] leading-relaxed text-text" tabIndex={0}>
            <code>
              {tab === "code" && highlight(detail.code)}
              {tab === "data" && highlight(detail.payload)}
              {tab === "log" && <Log text={detail.failLog} />}
            </code>
          </pre>
        )}
      </div>
    </section>
  );
}
