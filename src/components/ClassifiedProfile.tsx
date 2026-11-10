"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { profile } from "@/config/site";
import { fx } from "@/lib/fx";

/** "ACCESS CLASSIFIED PROFILE": unfolds an extra sheet of document-style details. */
export function ClassifiedProfile() {
  const [open, setOpen] = useState(false);
  const extra = profile.rows.filter(([k]) => ["Specialization", "Currently", "Principle"].includes(k));

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="classified-sheet"
        onClick={() => { fx.vhs(); setOpen((o) => !o); }}
        className="retro inline-flex items-center gap-3 border-2 border-[#6b0000] bg-[#2a1d14] px-6 py-3 text-2xl tracking-widest text-cream shadow-[4px_4px_0_#6b0000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#6b0000]"
      >
        {open ? <Unlock size={20} /> : <Lock size={20} />}
        {open ? "Close classified profile" : "Access classified profile"}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="classified-sheet"
            initial={{ height: 0, opacity: 0, rotateX: -75 }}
            animate={{ height: "auto", opacity: 1, rotateX: 0 }}
            exit={{ height: 0, opacity: 0, rotateX: -75 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top", perspective: 900, overflow: "hidden" }}
          >
            <div className="mt-6 border-2 border-dashed border-[#6b0000]/60 bg-[#efe3cb]/70 p-5">
              <p className="retro mb-3 flex items-center justify-between text-xl text-[#6b0000]">
                <span>MORE ABOUT ME</span>
                <span className="border border-[#6b0000] px-2 text-base">DECLASSIFIED FOR RECRUITER REVIEW</span>
              </p>
              <dl className="divide-y divide-[#2a1d14]/20">
                {extra.map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
                    <dt className="retro text-lg text-[#6b0000]">{k}</dt>
                    <dd className="font-medium text-[#2a1d14]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
