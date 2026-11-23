import type { PointerEvent } from "react";

/**
 * Pointer handlers for the .tilt class: writes --rx/--ry (perspective tilt) and --mx/--my (light
 * position) straight to the element, so there is no React re-render. Mouse only; touch and
 * reduced-motion visitors get a static panel (the CSS also drops the transform when reduced).
 */
export function tiltHandlers(max = 5) {
  return {
    onPointerMove(e: PointerEvent<HTMLElement>) {
      if (e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
      el.style.setProperty("--rx", `${-(py - 0.5) * max * 2}deg`);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    },
    onPointerLeave(e: PointerEvent<HTMLElement>) {
      const el = e.currentTarget;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    },
  };
}
