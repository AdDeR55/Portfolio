"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Database, ExternalLink, GitFork, RefreshCw, Search, Star } from "lucide-react";
import { links } from "@/config/site";
import {
  describeEvent, isFresh, loadGitHub, RateLimitError, readCache, timeAgo,
  type Contributions, type GHData,
} from "@/lib/github";
import { Section, SectionHeading, Reveal } from "@/components/ui/Section";

type State =
  | { s: "idle" }
  | { s: "loading" }
  | { s: "ready"; data: GHData; notice?: string }
  | { s: "error"; msg: string; rate: boolean; resetAt?: number };

const LEVELS = ["#1a0b0c", "#4a0d12", "#8a1219", "#d01822", "#ff4a4a"];
const LANG = ["#ff2424", "#ffd166", "#4cc9f0", "#7cf29a", "#ff8a3d", "#c084fc", "#a99b8c", "#f472b6"];

/** Types lines out one character at a time (instant under reduced motion). */
function useTypedLines(lines: string[], run: boolean) {
  const [count, setCount] = useState(0);
  const total = lines.join("\n").length;
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setCount(total), 0);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => setCount((c) => (c >= total ? (clearInterval(id), c) : c + 2)), 18);
    return () => clearInterval(id);
  }, [run, total]);
  return lines.join("\n").slice(0, run ? count : 0);
}

function ContribGraph({ c }: { c: Contributions }) {
  const cell = 11, gap = 3;
  const first = new Date(c.days[0].date + "T00:00:00Z").getUTCDay();
  const cells = [...Array<null>(first).fill(null), ...c.days];
  const weeks = Math.ceil(cells.length / 7);
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg width={weeks * (cell + gap)} height={7 * (cell + gap)} role="img" aria-label={`Contribution activity: ${c.total} contributions in the last year`}>
          {cells.map((d, i) =>
            d ? (
              <rect key={d.date} x={Math.floor(i / 7) * (cell + gap)} y={(i % 7) * (cell + gap)} width={cell} height={cell} rx="1.5" fill={LEVELS[d.level]}>
                <title>{`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}</title>
              </rect>
            ) : null,
          )}
        </svg>
      </div>
      <p className="mt-1 flex items-center justify-between text-xs text-term/70">
        <span>{c.total} contributions in the last year</span>
        <span className="flex items-center gap-1.5">less {LEVELS.map((l) => <i key={l} className="inline-block h-2.5 w-2.5" style={{ background: l }} />)} more</span>
      </p>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="border border-term/25 bg-black/40 p-3">
      <p className="retro text-lg text-term/60">{k}</p>
      <p className="retro text-4xl text-term" style={{ textShadow: "0 0 10px rgba(124,242,154,.55)" }}>{v}</p>
    </div>
  );
}

function Database_({ data, notice, onRefresh }: { data: GHData; notice?: string; onRefresh: () => void }) {
  const { user, repos, events, contributions } = data;
  const [q, setQ] = useState("");
  const [lang, setLang] = useState("ALL");
  const [sort, setSort] = useState<"pushed" | "stars" | "name">("pushed");

  const langs = useMemo(() => {
    const m = new Map<string, number>();
    repos.forEach((r) => r.language && m.set(r.language, (m.get(r.language) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [repos]);
  const total = langs.reduce((a, [, n]) => a + n, 0);
  const shown = useMemo(
    () =>
      repos
        .filter((r) => (lang === "ALL" || r.language === lang) && (r.name + " " + (r.description ?? "")).toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => (sort === "stars" ? b.stargazers_count - a.stargazers_count : sort === "name" ? a.name.localeCompare(b.name) : +new Date(b.pushed_at) - +new Date(a.pushed_at))),
    [repos, q, lang, sort],
  );

  return (
    <div className="space-y-6 font-mono text-sm text-term">
      {notice && (
        <p role="status" className="flex items-start gap-3 border border-[#ffd166]/50 bg-[#ffd166]/10 p-3 text-[#ffd166]"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{notice}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="border border-term/25 bg-black/40 p-4">
          <p className="retro mb-3 text-2xl text-term">&gt; CONTRIBUTION ACTIVITY</p>
          {contributions ? <ContribGraph c={contributions} /> : (
            <p className="text-term/70">Contribution data unavailable right now. <a className="underline" href={user.html_url} target="_blank" rel="noopener noreferrer">View on GitHub</a>.</p>
          )}
        </div>
        <div className="border border-term/25 bg-black/40 p-4">
          <p className="retro mb-3 text-2xl text-term">&gt; LANGUAGES</p>
          {langs.length === 0 ? <p className="text-term/70">No language data.</p> : (
            <>
              <div className="flex h-2.5 overflow-hidden" role="img" aria-label="Language distribution by repository count">
                {langs.map(([l, n], i) => <span key={l} title={`${l}: ${n}`} style={{ width: `${(n / total) * 100}%`, background: LANG[i % LANG.length] }} />)}
              </div>
              <ul className="mt-3 space-y-1.5">
                {langs.map(([l, n], i) => (
                  <li key={l} className="flex items-center justify-between"><span className="flex items-center gap-2"><i className="inline-block h-2 w-2" style={{ background: LANG[i % LANG.length] }} />{l}</span><span className="text-term/60">{n} repo{n > 1 ? "s" : ""}</span></li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-term/25 bg-black/40 p-4">
          <p className="retro mb-3 text-2xl text-term">&gt; RECENT UPDATES</p>
          <ul className="divide-y divide-term/15">
            {[...repos].sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at)).slice(0, 4).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-2"><a href={r.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.name}</a><span className="shrink-0 text-term/60">{timeAgo(r.pushed_at)}</span></li>
            ))}
          </ul>
        </div>
        <div className="border border-term/25 bg-black/40 p-4">
          <p className="retro mb-3 text-2xl text-term">&gt; LATEST ACTIVITY</p>
          {events === null ? <p className="text-term/70">Activity feed unavailable.</p> : events.length === 0 ? <p className="text-term/70">No recent public activity.</p> : (
            <ul className="divide-y divide-term/15">
              {events.slice(0, 4).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2"><span>{describeEvent(e)} <span className="text-term/60">· {e.repo.name.split("/")[1]}</span></span><span className="shrink-0 text-term/60">{timeAgo(e.created_at)}</span></li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border border-term/25 bg-black/40 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="retro text-2xl text-term">&gt; REPOSITORIES ({shown.length})</p>
          <div className="flex flex-wrap gap-2">
            <label className="relative"><span className="sr-only">Search records</span><Search size={14} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-term/60" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="search…" className="w-36 border border-term/30 bg-black/60 py-1.5 pr-2 pl-8 text-term placeholder:text-term/40 focus:border-term focus:outline-none" /></label>
            <label><span className="sr-only">Sort records</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="border border-term/30 bg-black/60 px-2 py-1.5 text-term focus:border-term focus:outline-none">
                <option value="pushed">recent</option><option value="stars">stars</option><option value="name">name</option>
              </select></label>
            <button type="button" onClick={onRefresh} aria-label="Refresh GitHub data" className="grid h-8 w-8 place-items-center border border-term/30 text-term hover:border-term"><RefreshCw size={14} /></button>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by language">
          {["ALL", ...langs.map(([l]) => l)].map((l) => (
            <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`border px-2.5 py-0.5 text-xs transition ${lang === l ? "border-term bg-term text-black" : "border-term/30 text-term/80 hover:border-term"}`}>{l}</button>
          ))}
        </div>
        {repos.length === 0 ? <p className="py-6 text-center text-term/70">No public repositories on record.</p> : shown.length === 0 ? <p className="py-6 text-center text-term/70">No repositories match.</p> : (
          <ul className="grid gap-3 md:grid-cols-2">
            {shown.map((r, i) => (
              <li key={r.id}>
                <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col border border-term/25 bg-black/50 p-3 transition hover:border-term hover:bg-term/5">
                  <span className="flex items-center justify-between gap-2"><span className="retro text-xl text-term/60">REPO #{String(i + 1).padStart(3, "0")}</span><ExternalLink size={13} className="text-term/50" /></span>
                  <span className="mt-1 font-semibold text-term group-hover:underline">{r.name}</span>
                  <span className="mt-1 line-clamp-2 text-term/70">{r.description ?? "No description on file."}</span>
                  <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-term/70">
                    {r.language && <span className="text-fg">{r.language}</span>}
                    <span className="inline-flex items-center gap-1"><Star size={11} />{r.stargazers_count}</span>
                    <span className="inline-flex items-center gap-1"><GitFork size={11} />{r.forks_count}</span>
                    {r.fork && <span>fork</span>}
                    <span className="ml-auto">pushed {timeAgo(r.pushed_at)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function GitHubTerminal() {
  const [state, setState] = useState<State>({ s: "idle" });
  const [expanded, setExpanded] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  const load = useCallback(async (force = false) => {
    const cached = readCache();
    if (!force && cached && isFresh(cached)) { setState({ s: "ready", data: cached }); return; }
    setState(cached ? { s: "ready", data: cached } : { s: "loading" });
    try {
      setState({ s: "ready", data: await loadGitHub() });
    } catch (e) {
      const rate = e instanceof RateLimitError;
      if (cached) {
        setState({ s: "ready", data: cached, notice: rate ? "GitHub API rate limit reached. Showing the last successful snapshot." : "Could not reach GitHub. Showing the last successful snapshot." });
      } else {
        setState({ s: "error", msg: e instanceof Error ? e.message : "Unknown error", rate, resetAt: rate ? e.resetAt : undefined });
      }
    }
  }, []);

  // fetch once, when the terminal scrolls into view
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { io.disconnect(); void load(); }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  const boot = [
    "GITHUB DATA TERMINAL v1.0",
    `> connect api.github.com/users/${links.githubUser}`,
    state.s === "idle" || state.s === "loading" ? "> awaiting response…" : state.s === "error" ? "> connection failed" : "> connection established. records retrieved.",
  ];
  const typed = useTypedLines(boot, true);
  const ready = state.s === "ready" ? state.data : null;
  const subject = ready
    ? [`> user: ${ready.user.login}${ready.user.name ? ` (${ready.user.name})` : ""}`, ready.user.bio ? `> bio: ${ready.user.bio}` : null, `> synced ${timeAgo(new Date(ready.fetchedAt).toISOString())}`].filter(Boolean)
    : [];

  return (
    <Section id="github">
      <SectionHeading id="github" code="LIVE DATA" title="GitHub Activity" sub={`Live data on @${links.githubUser}, pulled straight from GitHub. No statistic here is hand-written.`} />

      <Reveal>
        <div ref={host} className="crt border-2 border-[#1a3a22] p-4 sm:p-6 md:p-8">
          <div className="relative z-[1]">
            <div className="mb-5 flex items-center justify-between border-b border-term/25 pb-3">
              <p className="retro text-xl text-term/70">LIVE DATA · GITHUB API</p>
              <span className="flex gap-1.5" aria-hidden="true"><i className="h-2.5 w-2.5 rounded-full bg-accent" /><i className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" /><i className="h-2.5 w-2.5 rounded-full bg-term" /></span>
            </div>

            <pre className="retro min-h-[5.5rem] text-2xl leading-snug whitespace-pre-wrap text-term" style={{ textShadow: "0 0 10px rgba(124,242,154,.55)" }} aria-live="polite">
              {typed}
              {ready && subject.map((l) => `\n${l}`)}
              <span className="animate-blink inline-block h-5 w-2.5 translate-y-1 bg-term" aria-hidden="true" />
            </pre>

            {state.s === "error" && (
              <div role="alert" className="mt-5 border border-accent/60 bg-accent/10 p-4 font-mono text-sm text-fg">
                <p className="flex items-center gap-2 text-accent"><AlertTriangle size={16} /> {state.rate ? "RATE LIMIT REACHED" : "CONNECTION FAILED"}</p>
                <p className="mt-2 text-fg/80">
                  {state.rate ? `GitHub limits unauthenticated requests.${state.resetAt ? ` Resets around ${new Date(state.resetAt).toLocaleTimeString()}.` : ""}` : `Could not load GitHub data (${state.msg}).`} You can still browse the records directly on GitHub.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" onClick={() => load(true)} className="inline-flex items-center gap-2 border border-term/50 px-4 py-1.5 text-term hover:bg-term hover:text-black"><RefreshCw size={14} /> Retry</button>
                  <a href={links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-accent px-4 py-1.5 text-accent hover:bg-accent hover:text-black"><ExternalLink size={14} /> Open GitHub profile</a>
                </div>
              </div>
            )}

            {(state.s === "idle" || state.s === "loading") && (
              <p className="retro mt-4 text-xl text-term/70" aria-busy="true">LOADING DATA<span className="animate-blink">…</span></p>
            )}

            {ready && (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-5">
                  <Stat k="PUBLIC REPOS" v={ready.user.public_repos} />
                  <Stat k="FOLLOWERS" v={ready.user.followers} />
                  <Stat k="FOLLOWING" v={ready.user.following} />
                  <Stat k="STARS" v={ready.repos.reduce((a, r) => a + r.stargazers_count, 0)} />
                  <Stat k="FORKS" v={ready.repos.reduce((a, r) => a + r.forks_count, 0)} />
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((x) => !x)}
                    className="retro inline-flex items-center gap-3 border-2 border-term px-6 py-2 text-2xl tracking-widest text-term shadow-[0_0_20px_-6px_rgba(124,242,154,.7)] transition hover:bg-term hover:text-black"
                  >
                    <Database size={18} /> {expanded ? "Close GitHub database" : "Access GitHub database"}
                  </button>
                </div>
                {expanded && state.s === "ready" && <div className="mt-8"><Database_ data={state.data} notice={state.notice} onRefresh={() => load(true)} /></div>}
              </>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
