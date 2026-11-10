"use client";

import { links, site } from "@/config/site";
import { fx } from "@/lib/fx";
import { ChristmasLights } from "@/components/effects/ChristmasLights";

export function Footer() {
  return (
    <footer className="relative border-t border-line pb-24">
      <ChristmasLights count={26} className="relative opacity-80" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-mute sm:flex-row sm:px-8">
        <button type="button" onClick={() => fx.flicker()} className="retro text-2xl text-fg hover:text-accent" aria-label="Flicker the lights">
          {site.name.toUpperCase()}
        </button>
        <p className="text-center">Designed &amp; built by Meet Jaiswal with Next.js, TypeScript &amp; Tailwind CSS. Retro 1980s sci-fi styling with original artwork.</p>
        <p className="retro flex items-center gap-4 text-lg">
          <a href={links.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">GitHub</a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">LinkedIn</a>
          <a href="#home" className="hover:text-accent">Back to top ↑</a>
        </p>
      </div>
    </footer>
  );
}
