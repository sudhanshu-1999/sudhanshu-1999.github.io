"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small, honest model diagram: tokens → embedding → stacked attention blocks → output.
 * Signals travel layer to layer; the pointer acts as a "query" that lights up the nearest
 * node and its attention connections. Pauses off-screen; static under reduced motion.
 */

const LAYERS = [
  { name: "tokens", n: 6 },
  { name: "embed", n: 7 },
  { name: "attn·1", n: 8 },
  { name: "attn·2", n: 8 },
  { name: "ffn", n: 7 },
  { name: "out", n: 4 },
];
const TOKENS = ["find", "the", "clause", "on", "late", "fees"];
const OUTS = ["retrieve", "rank", "cite", "answer"];

type Node = { x: number; y: number; l: number; i: number; phase: number };
type Pulse = { from: Node; to: Node; t: number; speed: number; hue: number };

export function NeuralField() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [focus, setFocus] = useState<string>("hover a node");

  useEffect(() => {
    const el = canvas.current!;
    const box = wrap.current!;
    const ctx = el.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim() || "ui-monospace, monospace";

    let w = 0, h = 0, dpr = 1;
    let nodes: Node[][] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let visible = true;
    let mouse: { x: number; y: number } | null = null;
    let hot: Node | null = null;
    let lastLabel = "";

    const layout = () => {
      const r = box.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = w * dpr; el.height = h * dpr;
      el.style.width = `${w}px`; el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const padL = w * 0.12, padR = w * 0.16, padY = h * 0.16;
      nodes = LAYERS.map((L, l) => {
        const x = padL + (l * (w - padL - padR)) / (LAYERS.length - 1);
        return Array.from({ length: L.n }, (_, i) => ({
          x,
          y: padY + ((i + 0.5) * (h - padY * 1.6)) / L.n,
          l, i,
          phase: Math.random() * Math.PI * 2,
        }));
      });
    };

    const spawn = () => {
      const l = Math.floor(Math.random() * (LAYERS.length - 1));
      const a = nodes[l][Math.floor(Math.random() * nodes[l].length)];
      const b = nodes[l + 1][Math.floor(Math.random() * nodes[l + 1].length)];
      pulses.push({ from: a, to: b, t: 0, speed: 0.006 + Math.random() * 0.008, hue: Math.random() });
    };

    const color = (k: number, a: number) => {
      // electric blue → reactor orange → gold across the depth of the network
      const stops = [[40, 191, 255], [255, 107, 53], [255, 194, 71]];
      const s = k * 2, i = Math.min(1, Math.floor(s)), f = s - i;
      const c = stops[i].map((v, j) => Math.round(v + (stops[i + 1][j] - v) * f));
      return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    };

    const labelFor = (n: Node) => {
      const L = LAYERS[n.l];
      if (L.name === "tokens") return `token "${TOKENS[n.i]}"`;
      if (L.name === "out") return `head → ${OUTS[n.i]}`;
      return `${L.name} · unit ${n.i + 1}`;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const tsec = time / 1000;

      // hot node = nearest to pointer
      hot = null;
      if (mouse) {
        let best = 46 * 46;
        for (const col of nodes) for (const n of col) {
          const d = (n.x - mouse.x) ** 2 + (n.y - mouse.y) ** 2;
          if (d < best) { best = d; hot = n; }
        }
      }
      const label = hot ? labelFor(hot) : "hover a node";
      if (label !== lastLabel) { lastLabel = label; setFocus(label); }

      // edges
      for (let l = 0; l < nodes.length - 1; l++) {
        for (const a of nodes[l]) for (const b of nodes[l + 1]) {
          const lit = hot && (hot === a || hot === b);
          ctx.strokeStyle = lit ? color(l / (nodes.length - 2), 0.55) : "rgba(245,240,230,0.08)";
          ctx.lineWidth = lit ? 1.1 : 0.6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }

      // self-attention arcs inside the two attention layers
      for (const li of [2, 3]) {
        const col = nodes[li];
        for (let i = 0; i < col.length; i++) {
          const j = (i + 2 + Math.floor((Math.sin(tsec * 0.6 + i + li) + 1) * 1.5)) % col.length;
          if (i === j) continue;
          const a = col[i], b = col[j];
          const strength = 0.06 + 0.08 * (0.5 + 0.5 * Math.sin(tsec * 1.3 + i * 1.7 + li));
          const lit = hot && (hot === a || hot === b);
          ctx.strokeStyle = lit ? "rgba(255,194,71,0.85)" : `rgba(230,57,54,${strength + 0.1})`;
          ctx.lineWidth = lit ? 1.2 : 0.8;
          const bend = 26 + Math.abs(a.y - b.y) * 0.28;
          ctx.beginPath(); ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(a.x + (li === 2 ? -bend : bend), (a.y + b.y) / 2, b.x, b.y);
          ctx.stroke();
        }
      }

      // pulses
      if (!reduce) {
        if (pulses.length < 34 && Math.random() < 0.5) spawn();
        if (hot && hot.l < nodes.length - 1 && Math.random() < 0.35) {
          const b = nodes[hot.l + 1][Math.floor(Math.random() * nodes[hot.l + 1].length)];
          pulses.push({ from: hot, to: b, t: 0, speed: 0.02, hue: hot.l / 5 });
        }
        pulses = pulses.filter((p) => {
          p.t += p.speed;
          if (p.t >= 1) {
            // continue forward through the network sometimes
            const nl = p.to.l + 1;
            if (nl < nodes.length && Math.random() < 0.55) {
              const nb = nodes[nl][Math.floor(Math.random() * nodes[nl].length)];
              pulses.push({ from: p.to, to: nb, t: 0, speed: p.speed, hue: p.hue });
            }
            return false;
          }
          const e = p.t < 0.5 ? 2 * p.t * p.t : 1 - (-2 * p.t + 2) ** 2 / 2;
          const x = p.from.x + (p.to.x - p.from.x) * e;
          const y = p.from.y + (p.to.y - p.from.y) * e;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
          g.addColorStop(0, color(p.from.l / 5, 0.95));
          g.addColorStop(1, color(p.from.l / 5, 0));
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
          return true;
        });
      }

      // nodes
      for (const col of nodes) for (const n of col) {
        const k = n.l / (nodes.length - 1);
        const breathe = reduce ? 0.6 : 0.5 + 0.5 * Math.sin(tsec * 1.4 + n.phase);
        const isHot = hot === n;
        const r = isHot ? 5.5 : 2.6 + breathe * 0.9;
        if (isHot) {
          const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 26);
          halo.addColorStop(0, color(k, 0.35)); halo.addColorStop(1, color(k, 0));
          ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(n.x, n.y, 26, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = "#101114";
        ctx.beginPath(); ctx.arc(n.x, n.y, r + 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = color(k, isHot ? 1 : 0.55 + breathe * 0.4);
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      }

      // layer captions + token text
      ctx.font = `500 11px ${mono}`;
      ctx.textAlign = "center";
      nodes.forEach((col, l) => {
        ctx.fillStyle = "rgba(245,240,230,0.8)";
        ctx.fillText(LAYERS[l].name, col[0].x, h * 0.08);
      });
      ctx.textAlign = "right";
      nodes[0].forEach((n, i) => {
        ctx.fillStyle = hot === n ? "rgba(40,191,255,1)" : "rgba(245,240,230,0.7)";
        ctx.fillText(TOKENS[i], n.x - 12, n.y + 3);
      });
      ctx.textAlign = "left";
      nodes[nodes.length - 1].forEach((n, i) => {
        ctx.fillStyle = hot === n ? "rgba(255,194,71,1)" : "rgba(245,240,230,0.7)";
        ctx.fillText(OUTS[i], n.x + 12, n.y + 3);
      });

      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    layout();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => { layout(); if (reduce) draw(0); });
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    });
    io.observe(box);

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (reduce) draw(0);
    };
    const leave = () => { mouse = null; if (reduce) draw(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="hud hud-scan">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 bg-red" />
          <span className="h-2 w-2 bg-gold" />
          <span className="h-2 w-2 bg-blue" />
        </div>
        <p className="font-mono text-[11px] text-muted">model.forward(query)</p>
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-gold">
          <span className="pulse-dot h-1.5 w-1.5 bg-red" /> live
        </p>
      </div>
      <div ref={wrap} className="relative aspect-[5/4] w-full sm:aspect-[16/12]">
        <canvas
          ref={canvas}
          className="absolute inset-0 cursor-crosshair"
          role="img"
          aria-label="Animated diagram of a transformer: input tokens flow through embedding, two attention layers and a feed-forward layer to retrieve, rank, cite and answer heads."
        />
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[11px]">
        <span className="text-faint">focus</span>
        <span className="truncate pl-4 text-text/80" aria-live="off">{focus}</span>
      </div>
    </div>
  );
}
