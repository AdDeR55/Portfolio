"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/config/site";
import { fx, prefersReducedMotion } from "@/lib/fx";
import { SporeParticles } from "@/components/effects/SporeParticles";

const KEY = "hawkins-intro-seen";
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * Welcome to Hawkins. Black → VHS static → neon title → tagline → ENTER HAWKINS.
 * ~4 seconds, skippable at any time (button / Esc / Enter), shown once per session.
 */
export function IntroSequence() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0); // 0 black, 1 static, 2 title, 3 tagline, 4 ready

  const enter = useCallback(() => {
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    fx.vhs();
    setVisible(false);
  }, []);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem(KEY); } catch {}
    if (seen) {
      const t = setTimeout(() => setVisible(false), 0);
      return () => clearTimeout(t);
    }
    const reduced = prefersReducedMotion();
    const steps: [number, number][] = reduced ? [[0, 4]] : [[350, 1], [1100, 2], [2500, 3], [3300, 4]];
    const timers = steps.map(([ms, p]) => setTimeout(() => setPhase(p), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => (e.key === "Escape" || e.key === "Enter") && enter();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, enter]);

  const letters = site.name.toUpperCase().split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          role="dialog"
          aria-label="Welcome"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-black px-5 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(6px)" }}
          transition={{ duration: 0.55 }}
        >
          {/* static */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: NOISE, backgroundSize: "220px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 0 ? 0 : phase === 1 ? 0.55 : 0.1 }}
            transition={{ duration: 0.6 }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_3px,rgba(0,0,0,0.35)_3px_4px)]" />
          {/* red glow */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,36,36,0.32), rgba(107,0,0,0.18) 40%, transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 1.4 }}
          />
          {phase >= 2 && <SporeParticles density={0.9} />}

          <button
            type="button"
            onClick={enter}
            className="retro absolute top-5 right-5 rounded border border-white/20 px-4 py-1.5 text-lg text-mute transition hover:border-accent hover:text-accent"
          >
            Skip intro
          </button>

          <div className="relative flex flex-col items-center">
            <motion.div
              className="mb-4 h-[3px] w-[min(80vw,640px)] bg-accent shadow-[0_0_14px_var(--accent)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.9 }}
            />
            <h1 className="st-outline text-[clamp(2.6rem,10.5vw,7.5rem)] tracking-tight" aria-label={site.name}>
              {letters.map((c, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 2 ? [0, 1, 0.2, 1, 0.5, 1] : 0 }}
                  transition={{ delay: i * 0.07, duration: 0.7 }}
                >
                  {c === " " ? " " : c}
                </motion.span>
              ))}
            </h1>
            <motion.div
              className="mt-4 h-[3px] w-[min(80vw,640px)] bg-accent shadow-[0_0_14px_var(--accent)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.9 }}
            />

            <motion.p
              className="mt-8 max-w-xl font-display text-lg text-cream italic md:text-2xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 8 }}
              transition={{ duration: 0.9 }}
            >
              “{site.tagline}”
            </motion.p>

            <motion.button
              type="button"
              onClick={enter}
              autoFocus
              className="retro group relative mt-10 overflow-hidden border-2 border-accent px-10 py-3 text-3xl tracking-[0.25em] text-accent shadow-[0_0_30px_-4px_rgba(var(--glow),0.8),inset_0_0_20px_-8px_rgba(var(--glow),0.8)] transition hover:bg-accent hover:text-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 4 ? 1 : 0 }}
              style={{ pointerEvents: phase >= 4 ? "auto" : "none" }}
              transition={{ duration: 0.6 }}
            >
              ENTER PORTFOLIO
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
