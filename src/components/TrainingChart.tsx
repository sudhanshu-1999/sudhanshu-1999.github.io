"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fallTraining } from "@/content/fallTraining";

const series = [
  { key: "map50", name: "mAP@50", color: "#22d3ee" },
  { key: "p", name: "Precision", color: "#3b82f6" },
  { key: "r", name: "Recall", color: "#a78bfa" },
  { key: "map", name: "mAP@50-95", color: "#64748b" },
] as const;

export default function TrainingChart() {
  return (
    <figure>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={fallTraining as unknown as Record<string, number>[]} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
            <XAxis
              dataKey="e"
              tick={{ fill: "#5b667a", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
              ticks={[1, 20, 40, 60, 80, 100]}
            />
            <YAxis domain={[0, 1]} tick={{ fill: "#5b667a", fontSize: 11 }} tickLine={false} axisLine={false} ticks={[0, 0.25, 0.5, 0.75, 1]} />
            <Tooltip
              contentStyle={{ background: "#0b111d", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: "#8a96ab" }}
              labelFormatter={(e) => `Epoch ${e}`}
              formatter={(v) => (typeof v === "number" ? v.toFixed(3) : String(v))}
            />
            {series.map((s) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={s.key === "map50" ? 2 : 1.4} dot={false} isAnimationActive />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded" style={{ background: s.color }} /> {s.name}
          </span>
        ))}
        <span className="font-mono text-[11px] text-faint">validation, per epoch · from the training log in the repo</span>
      </figcaption>
    </figure>
  );
}
