"use client";

import { useState } from "react";
import { Download, Loader2, Mail, Radio } from "lucide-react";
import { links } from "@/config/site";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { Section, Reveal } from "@/components/ui/Section";
import { SporeParticles } from "@/components/effects/SporeParticles";

type Status = "idle" | "sending" | "sent" | "error";

/** Concentric rotating gate with crackling arcs. Pure SVG + CSS. */
function Portal() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]" aria-hidden="true">
      <div className="absolute inset-[8%] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(var(--glow),0.65),rgba(var(--glow),0.1)_60%,transparent_72%)] blur-xl" />
      <svg viewBox="0 0 400 400" className="relative h-full w-full" style={{ filter: "drop-shadow(0 0 14px rgba(var(--glow),.8))" }}>
        <defs>
          <radialGradient id="gate" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.55" stopColor="#12000a" />
            <stop offset="0.85" stopColor="var(--accent-deep)" />
            <stop offset="1" stopColor="var(--accent)" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="150" fill="url(#gate)" />
        <g className="animate-portal" style={{ transformOrigin: "200px 200px" }} fill="none" stroke="var(--accent)" strokeLinecap="round">
          <circle cx="200" cy="200" r="178" strokeWidth="2" strokeDasharray="4 12" />
          <circle cx="200" cy="200" r="160" strokeWidth="3" strokeDasharray="90 40 20 40" />
        </g>
        <g className="animate-portal" style={{ transformOrigin: "200px 200px", animationDirection: "reverse", animationDuration: "26s" }} fill="none" stroke="var(--accent-soft)" strokeLinecap="round" strokeOpacity=".8">
          <circle cx="200" cy="200" r="120" strokeWidth="1.5" strokeDasharray="30 18" />
          <circle cx="200" cy="200" r="90" strokeWidth="1" strokeDasharray="6 10" />
        </g>
        <g fill="none" stroke="#fff4f4" strokeWidth="2" strokeLinejoin="round">
          <polyline className="animate-bolt" points="200,40 182,100 210,108 190,160" style={{ animationDelay: "0.8s" }} />
          <polyline className="animate-bolt" points="330,120 280,150 300,175 255,210" style={{ animationDelay: "3.1s" }} />
          <polyline className="animate-bolt" points="90,260 130,250 120,280 165,275" style={{ animationDelay: "5s" }} />
        </g>
        <circle cx="200" cy="200" r="22" fill="#000" stroke="var(--accent)" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get("name")), email = String(f.get("email")), message = String(f.get("message"));

    if (links.formEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(links.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: f });
        if (!res.ok) throw new Error();
        setStatus("sent");
        form.reset();
      } catch {
        setStatus("error");
      }
      return;
    }
    // No endpoint configured: open the visitor's mail client with everything pre-filled.
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  const field = "w-full border-2 border-line bg-black/60 px-4 py-3 font-mono text-fg placeholder:text-mute/60 focus:border-accent focus:outline-none";

  return (
    <Section id="contact" className="pb-20">
      <div className="relative overflow-hidden border-2 border-accent/40 bg-black p-6 sm:p-10 lg:p-14">
        <SporeParticles density={0.8} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(var(--glow),0.22),transparent_60%)]" aria-hidden="true" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="retro mb-4 flex items-center gap-3 text-xl text-accent">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" /> FILE 08 // CONTACT
            </p>
            <h2 className="st-outline text-4xl sm:text-5xl md:text-6xl">Ready to open a new dimension?</h2>
            <p className="mt-6 max-w-md text-lg text-fg/80">
              Have an exciting opportunity, a challenging idea, or something extraordinary to build? Let&apos;s connect.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                { icon: Mail, label: links.email, href: `mailto:${links.email}` },
                { icon: Github, label: "github.com/AdDeR55", href: links.github, ext: true },
                { icon: Linkedin, label: "linkedin.com/in/meet-jaiswal", href: links.linkedin, ext: true },
              ].map(({ icon: Icon, label, href, ext }) => (
                <li key={label}>
                  <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-3 text-fg transition hover:text-accent">
                    <span className="grid h-11 w-11 place-items-center border-2 border-line bg-black/60 transition group-hover:border-accent"><Icon size={18} /></span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={links.resume} download="Meet_Jaiswal_Resume.pdf" className="retro mt-8 inline-flex items-center gap-2 border-2 border-accent px-6 py-2.5 text-2xl tracking-widest text-accent transition hover:bg-accent hover:text-black">
              <Download size={18} /> Download resume
            </a>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="hidden lg:block"><Portal /></div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="relative mx-auto mt-14 max-w-2xl space-y-4 border-2 border-line bg-black/70 p-6 sm:p-8">
            <p className="retro flex items-center gap-2 text-2xl text-accent"><Radio size={18} /> SEND A MESSAGE</p>
            <div>
              <label htmlFor="name" className="retro mb-1 block text-lg text-mute">NAME</label>
              <input id="name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="retro mb-1 block text-lg text-mute">EMAIL</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" />
            </div>
            <div>
              <label htmlFor="message" className="retro mb-1 block text-lg text-mute">MESSAGE</label>
              <textarea id="message" name="message" required rows={5} className={field} placeholder="Tell me about your idea or opportunity…" />
            </div>
            <button type="submit" disabled={status === "sending"} className="retro inline-flex w-full items-center justify-center gap-3 border-2 border-accent bg-accent px-6 py-3 text-3xl tracking-[0.2em] text-black shadow-[0_0_30px_-6px_rgba(var(--glow),0.9)] transition hover:bg-transparent hover:text-accent disabled:opacity-60">
              {status === "sending" && <Loader2 size={20} className="animate-spin" />}
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <p role="status" className="retro min-h-6 text-xl text-term">
              {status === "sent" && (links.formEndpoint ? "MESSAGE SENT. I'LL REPLY SOON." : "OPENING YOUR MAIL APP WITH THE MESSAGE READY TO SEND.")}
              {status === "error" && <span className="text-accent">MESSAGE FAILED. PLEASE EMAIL ME DIRECTLY.</span>}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
