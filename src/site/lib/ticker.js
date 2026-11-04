// One shared requestAnimationFrame loop for every scroll/animation driven component.
const callbacks = new Set();
let rafId = 0;

function loop(now) {
  callbacks.forEach((fn) => fn(now));
  rafId = requestAnimationFrame(loop);
}

export function addTick(fn) {
  callbacks.add(fn);
  if (!rafId) rafId = requestAnimationFrame(loop);
  return () => {
    callbacks.delete(fn);
    if (!callbacks.size && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const smoothstep = (t) => t * t * (3 - 2 * t);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isMobile = () => typeof window !== "undefined" && window.innerWidth <= 820;

// Small mutable store shared between the DOM sections and the WebGL scene (no re-renders needed).
export const sceneStore = {
  highlightRing: -1,
  pointer: { x: 0, y: 0 },
};
