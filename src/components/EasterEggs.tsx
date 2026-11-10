"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fx } from "@/lib/fx";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Original silhouette that stalks across the bottom of the screen. */
function Walker({ id }: { id: number }) {
  return (
    <motion.svg
      key={id}
      aria-hidden="true"
      viewBox="-60 -150 120 160"
      className="pointer-events-none fixed bottom-0 z-[90] h-40 w-32"
      initial={{ x: "-15vw" }}
      animate={{ x: "115vw" }}
      transition={{ duration: 9, ease: "linear" }}
      fill="#050105"
      style={{ filter: "drop-shadow(0 0 8px rgba(255,36,36,.6))" }}
    >
      <path d="M-14 -105 C-22 -90 -20 -70 -16 -58 L-26 -10 L-14 -8 L-6 -50 L0 -8 L12 -10 L10 -58 C16 -72 18 -92 12 -105Z" />
      <path d="M-14 -90 L-48 -52 L-52 -36 L-44 -38 L-24 -64Z" />
      <path d="M14 -90 L46 -54 L50 -38 L42 -40 L22 -66Z" />
      {[-70, -35, 0, 35, 70].map((a) => <ellipse key={a} cx="0" cy="-128" rx="5" ry="20" transform={`rotate(${a} 0 -108)`} />)}
      <circle cx="0" cy="-108" r="9" />
    </motion.svg>
  );
}

/**
 * Hidden touches, for fans who go looking:
 *  • Konami code               → toggles the Upside Down
 *  • type "run"                → screen shake
 *  • type "eggo" / "hopper" / "friendsdontlie" → little messages
 *  • type "righthere"          → the Christmas lights flicker
 *  • type "vecna"              → the clock appears
 *  • type "demogorgon"         → something walks past
 *  • click the footer name     → lights flicker
 */
export function EasterEggs() {
  const [toast, setToast] = useState<string | null>(null);
  const [walker, setWalker] = useState(0);
  const [shake, setShake] = useState(false);
  const keys = useRef<string[]>([]);
  const typed = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const say = (m: string) => {
      setToast(m);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), 3600);
    };
    const onToast = (e: Event) => say((e as CustomEvent<string>).detail);
    const onShake = () => { setShake(true); setTimeout(() => setShake(false), 550); };
    const onWalk = () => setWalker((n) => n + 1);

    const words: Record<string, () => void> = {
      run: () => { fx.shake(); say("RUN."); },
      eggo: () => say("Eggos located. Morale restored."),
      hopper: () => say("Mornings are for coffee and contemplation."),
      friendsdontlie: () => say("Friends don't lie."),
      righthere: () => { fx.flicker(); say("Are you there? Blink once for yes."); },
      vecna: () => { fx.vecna(); },
      demogorgon: () => { fx.demogorgon(); say("Something is moving in the dark…"); },
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys.current = [...keys.current, k].slice(-KONAMI.length);
      if (KONAMI.every((x, i) => keys.current[i] === x)) { keys.current = []; fx.dimension(); }
      if (e.key.length === 1) {
        typed.current = (typed.current + e.key.toLowerCase()).slice(-16);
        for (const w of Object.keys(words)) if (typed.current.endsWith(w)) { typed.current = ""; words[w](); break; }
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("fx:toast", onToast);
    window.addEventListener("fx:shake", onShake);
    window.addEventListener("fx:demogorgon", onWalk);
    console.log(
      "%cHi there.%c\nCurious about the code? github.com/AdDeR55 — try the Konami code, or type “run”.",
      "color:#ff2424;font-size:16px;font-weight:700",
      "color:#ab9d8e",
    );
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("fx:toast", onToast);
      window.removeEventListener("fx:shake", onShake);
      window.removeEventListener("fx:demogorgon", onWalk);
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("animate-shake", shake);
  }, [shake]);

  return (
    <>
      {walker > 0 && <Walker id={walker} />}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[120] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.p
              key={toast}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="retro glass border-accent/50 px-5 py-2 text-2xl text-fg shadow-lg"
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
