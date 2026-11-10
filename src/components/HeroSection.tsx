"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import { links, site } from "@/config/site";
import { Github } from "@/components/ui/BrandIcons";
import { useTyping, usePrefersReducedMotion } from "@/lib/hooks";
import { fx } from "@/lib/fx";
import { UpsideDownScene } from "@/components/scene/UpsideDownScene";
import { SporeParticles } from "@/components/effects/SporeParticles";
import { ChristmasLights } from "@/components/effects/ChristmasLights";

export function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const role = useTyping(site.roles, !reduced);

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden bg-black">
      <UpsideDownScene className="animate-drift absolute inset-0 h-full w-full scale-110 object-cover" />
      <SporeParticles density={1} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.55)_42%,rgba(0,0,0,0.1)_75%),linear-gradient(to_top,#080808_0%,transparent_28%)]" />
      <ChristmasLights className="absolute inset-x-0 top-0 z-[1] opacity-90" count={22} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-32 pb-28 sm:px-8">
        <motion.p
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="retro mb-6 inline-flex items-center gap-3 border border-accent/50 bg-black/60 px-4 py-1.5 text-xl text-accent"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
          DEVELOPER TERMINAL // ONLINE
          <span className="animate-blink inline-block h-4 w-2 bg-accent" aria-hidden="true" />
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.25, duration: 1 }}
          className="st-outline text-[clamp(3.2rem,11vw,8.5rem)]"
        >
          Meet
          <br />
          Jaiswal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-7 max-w-2xl font-display text-xl text-cream italic sm:text-2xl md:text-3xl"
        >
          {site.subtitle}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-4 max-w-xl text-base leading-relaxed text-fg/80 md:text-lg"
        >
          {site.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="retro mt-6 flex h-9 items-center text-3xl text-term"
          aria-label={`Roles: ${site.roles.join(", ")}`}
        >
          <span className="mr-3 text-accent">&gt;</span>
          <span aria-hidden="true" style={{ textShadow: "0 0 10px rgba(124,242,154,.7)" }}>{role}</span>
          <span aria-hidden="true" className="animate-blink ml-1 inline-block h-6 w-3 bg-term" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            onClick={() => fx.vhs()}
            className="retro group inline-flex items-center gap-2 border-2 border-accent bg-accent px-7 py-3 text-2xl tracking-widest text-black shadow-[0_0_34px_-6px_rgba(var(--glow),0.9)] transition hover:bg-transparent hover:text-accent"
          >
            Explore my projects <ArrowDown size={20} className="transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="retro inline-flex items-center gap-2 border-2 border-white/30 bg-black/50 px-7 py-3 text-2xl tracking-widest text-fg transition hover:border-accent hover:text-accent"
          >
            <Github size={20} /> View GitHub
          </a>
          <a
            href={links.resume}
            download="Meet_Jaiswal_Resume.pdf"
            className="retro inline-flex items-center gap-2 px-4 py-3 text-2xl tracking-widest text-mute transition hover:text-fg"
          >
            <Download size={18} /> Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
