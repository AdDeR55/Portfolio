"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Decorative grandfather-clock face that fades in during selected transitions.
 * It is not a countdown and shows no real time. Hands just sweep and settle.
 */
export function VecnaClock() {
  const [on, setOn] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const show = () => {
      setOn((n) => n + 1);
      clearTimeout(t);
      t = setTimeout(() => setOn(0), 1900);
    };
    window.addEventListener("fx:vecna", show);
    return () => { window.removeEventListener("fx:vecna", show); clearTimeout(t); };
  }, []);

  return (
    <AnimatePresence>
      {on > 0 && (
        <motion.div
          key={on}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[175] grid place-items-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.svg
            viewBox="0 0 200 200"
            className="h-[min(60vw,60vh)] w-[min(60vw,60vh)]"
            initial={{ scale: 0.85, rotate: -4 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 18px rgba(255,36,36,.8))" }}
          >
            <circle cx="100" cy="100" r="92" fill="none" stroke="#ff2424" strokeWidth="3" />
            <circle cx="100" cy="100" r="84" fill="#0a0000" stroke="#6b0000" strokeWidth="2" />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="100" y1="22" x2="100" y2={i % 3 === 0 ? 36 : 30} stroke="#ffb3a7" strokeWidth={i % 3 === 0 ? 3 : 1.5} transform={`rotate(${i * 30} 100 100)`} />
            ))}
            <motion.line x1="100" y1="100" x2="100" y2="44" stroke="#ff2424" strokeWidth="3" strokeLinecap="round"
              style={{ transformOrigin: "100px 100px" }} initial={{ rotate: -360 }} animate={{ rotate: 0 }} transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }} />
            <motion.line x1="100" y1="100" x2="100" y2="60" stroke="#ffb3a7" strokeWidth="5" strokeLinecap="round"
              style={{ transformOrigin: "100px 100px" }} initial={{ rotate: 0 }} animate={{ rotate: 90 }} transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }} />
            <circle cx="100" cy="100" r="5" fill="#ff2424" />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
