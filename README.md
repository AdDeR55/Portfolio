# Meet Jaiswal — Stranger Things–inspired Developer Portfolio

An immersive, Hawkins-themed portfolio built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion** and **Lucide**. All artwork (title treatment, Upside Down scene, creature silhouettes, badge, portal) is original SVG/CSS. This is an unofficial fan tribute, not affiliated with Netflix.

## Run

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint
```

## Sections
Intro (welcome screen) · Hero · About Me · Technical Skills · Featured Projects · Work Experience · GitHub Activity (live API) · Education · Contact. The Stranger Things look is styling only; every label is plain English.

## Special features
- **Alphabet-wall navigation**: bulbs above every letter light on hover / active section. On mobile it becomes a handheld **radio** menu (channel = section).
- **Inverted mode** (an "Upside Down" re-theme): switch bottom-left (remembered between visits). Re-themes to pink/violet, spores drift downward, headings warp.
- **Portal transition** into project files, **VHS glitch** on section jumps, **Vecna clock** overlay (decorative only, never a countdown), **Christmas-lights cursor** (desktop mouse only), CRT/scanline texture, grain.
- **Ambient sound**: speaker toggle bottom-left, **off by default**. The drone is synthesised in the browser (Web Audio), so no audio files or licences.
- **Reduced motion**: respected everywhere (no cursor trail, no glitch/portal/clock, static particles, instant scroll, typed text appears at once).
- **Easter eggs**: Konami code (inverted mode) · type `run`, `eggo`, `hopper`, `friendsdontlie`, `righthere`, `vecna`, `demogorgon` · click your name in the footer.

## Update your content (one file)

Everything lives in **`src/config/site.ts`**:

| What | Where |
| --- | --- |
| Email / GitHub / LinkedIn / resume | `links` |
| Projects (repo, live URL, screenshot, features, level) | `projects` |
| Experience / incident reports | `experience` (`achievements: []` for extras) |
| Skills / experiments | `experiments` |
| Education & certificate URLs | `education`, `certifications` |
| Page sections / nav | `sections` |
| Deployed site URL (SEO) | `site.url` |
| Contact form endpoint (Formspree etc.) | `links.formEndpoint` |

Anything set to `null` simply shows no button, so there are no dead links.

### Still to fill in
- `projects[codexa].repo`, `projects[campus-it-lab].repo` — not among your public GitHub repos. Codexa's description comes from your resume, not its source.
- `projects[*].image` — add screenshots to `public/projects/` and set e.g. `"/projects/vergo.png"`. Until then a "signal lost" CRT placeholder shows.
- `certifications[*].url`, `site.url`, `links.formEndpoint` (without it the form opens the visitor's mail app, pre-filled).

## GitHub Activity
- Profile, repos and events come from the GitHub REST API (unauthenticated: 60 requests/hour per IP). It loads when the terminal scrolls into view.
- The contribution graph isn't in GitHub's REST API, so it uses the public `github-contributions-api.jogruber.de`; if that fails the rest still works.
- Results are cached in `localStorage` for 10 minutes. On a rate limit or error the last snapshot is shown with a notice; with no cache you get an error panel with retry and a profile link.

## Deploy (Vercel)
1. Push to GitHub. 2. Import at vercel.com/new (no env vars). 3. Set `site.url` and redeploy.

## Structure
```
src/
  app/            layout (SEO, fonts, JSON-LD), page, icon.svg, globals.css (theme tokens + effects)
  config/site.ts  ALL content + links
  lib/            github.ts (API + cache), hooks.ts, fx.ts (effect event bus), sound.ts (Web Audio)
  components/     IntroSequence, HeroSection, HawkinsNavbar, AboutSection, ClassifiedProfile,
                  SkillsSection, ProjectInvestigations, ExperienceTimeline, GitHubTerminal,
                  EducationSection, ContactSection, UpsideDownToggle, EasterEggs, Footer
    effects/      VHSOverlay, ChristmasLights, LightsCursor, PortalTransition, VecnaClock, SporeParticles
    scene/        UpsideDownScene
    ui/           Section (headings/reveal), Logo, Spinner, BrandIcons
public/           Meet_Jaiswal_Resume.pdf
```