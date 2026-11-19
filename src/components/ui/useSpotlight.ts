import type { PointerEvent } from "react";

/** Sets --mx / --my on the element so the .spotlight border glow follows the pointer. */
export function onSpotlightMove(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}
