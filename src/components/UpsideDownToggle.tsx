"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { fx } from "@/lib/fx";
import { startAmbient, stopAmbient } from "@/lib/sound";

const KEY = "hawkins-dimension";

/** Upside Down switch + ambient sound switch (sound is OFF by default and starts only on click). */
export function UpsideDownToggle() {
  const [upside, setUpside] = useState(false);
  const [sound, setSound] = useState(false);

  const apply = useCallback((on: boolean, announce: boolean) => {
    const html = document.documentElement;
    if (on) html.dataset.dimension = "upside";
    else delete html.dataset.dimension;
    try { localStorage.setItem(KEY, on ? "upside" : "normal"); } catch {}
    setUpside(on);
    if (announce) { fx.vhs(); fx.vecna(); fx.toast(on ? "Inverted mode on." : "Back to standard mode."); }
  }, []);

  useEffect(() => {
    let saved = false;
    try { saved = localStorage.getItem(KEY) === "upside"; } catch {}
    const t = setTimeout(() => saved && apply(true, false), 0);
    const onEvt = () => apply(document.documentElement.dataset.dimension !== "upside", true);
    window.addEventListener("fx:dimension", onEvt);
    return () => { clearTimeout(t); window.removeEventListener("fx:dimension", onEvt); stopAmbient(); };
  }, [apply]);

  const toggleSound = () => {
    if (sound) stopAmbient(); else startAmbient();
    setSound(!sound);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={upside}
        onClick={() => apply(!upside, true)}
        className="retro glass flex items-center gap-3 rounded-full py-1.5 pr-4 pl-2 text-lg text-fg transition hover:border-accent"
      >
        <span className={`relative h-6 w-11 rounded-full border border-white/20 transition-colors ${upside ? "bg-accent/70" : "bg-black/60"}`}>
          <span className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-fg transition-all ${upside ? "left-[22px]" : "left-0.5"}`} style={{ height: 18, width: 18 }} />
        </span>
        <span className="hidden sm:inline">{upside ? "Inverted mode" : "Standard mode"}</span>
        <span className="sm:hidden">{upside ? "INV" : "STD"}</span>
      </button>
      <button
        type="button"
        aria-pressed={sound}
        aria-label={sound ? "Turn ambient sound off" : "Turn ambient sound on"}
        onClick={toggleSound}
        className="glass grid h-10 w-10 place-items-center rounded-full text-fg transition hover:border-accent hover:text-accent"
      >
        {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
      </button>
    </div>
  );
}
