/** Tiny event bus for cinematic effects, so components never import each other. */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fire<T>(name: string, detail?: T) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export const fx = {
  /** Brief analog glitch (section jumps, entering the site). */
  vhs: () => { if (!prefersReducedMotion()) fire("fx:vhs"); },
  /** Decorative clock overlay. Purely visual. */
  vecna: () => { if (!prefersReducedMotion()) fire("fx:vecna"); },
  /** Red portal wipe starting at a point; `open` runs mid-animation. */
  portal: (x: number, y: number, open: () => void) => {
    if (prefersReducedMotion()) return open();
    fire("fx:portal", { x, y });
    setTimeout(open, 520);
  },
  /** Christmas lights flicker. */
  flicker: () => fire("fx:flicker"),
  toast: (m: string) => fire("fx:toast", m),
  shake: () => fire("fx:shake"),
  demogorgon: () => { if (!prefersReducedMotion()) fire("fx:demogorgon"); },
  dimension: () => fire("fx:dimension"),
};
