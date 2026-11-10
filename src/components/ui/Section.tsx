"use client";

import { motion } from "framer-motion";
import { sections } from "@/config/site";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-32 ${className}`}>
      {children}
    </section>
  );
}

/** Lab-file heading: "FILE 03 // SKILLS", title with glow, neon rule. */
export function SectionHeading({
  id,
  code,
  title,
  sub,
}: {
  id: string;
  code: string; // e.g. "HAWKINS LAB FILE"
  title: string;
  sub?: string;
}) {
  const i = sections.findIndex((s) => s.id === id);
  const n = String(i + 1).padStart(2, "0");
  return (
    <div className="relative mb-12 md:mb-16">
      <motion.p
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="retro mb-4 flex items-center gap-3 text-xl text-accent"
      >
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
        FILE {n} {"//"} {code}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="st-title text-4xl sm:text-5xl md:text-6xl"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="neon-rule mt-6 w-40 origin-left"
      />
      {sub && <p className="mt-5 max-w-2xl text-base text-mute md:text-lg">{sub}</p>}
    </div>
  );
}
