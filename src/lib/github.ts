import { links } from "@/config/site";

export interface GHUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}
export interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  updated_at: string;
  topics?: string[];
}
export interface GHEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: { commits?: { message: string }[]; action?: string; ref_type?: string };
}
export interface ContribDay { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
export interface Contributions { total: number; days: ContribDay[] }

export interface GHData {
  user: GHUser;
  repos: GHRepo[];
  events: GHEvent[] | null;
  contributions: Contributions | null;
  fetchedAt: number;
}

export class RateLimitError extends Error {
  constructor(public resetAt?: number) {
    super("GitHub API rate limit reached");
  }
}

const GH = "https://api.github.com";
const CACHE_KEY = "gh-intel-v1";
const FRESH_MS = 10 * 60 * 1000;

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${GH}${path}`, { headers: { Accept: "application/vnd.github+json" } });
  if (res.status === 403 || res.status === 429) {
    const reset = Number(res.headers.get("x-ratelimit-reset"));
    throw new RateLimitError(reset ? reset * 1000 : undefined);
  }
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchContributions(user: string): Promise<Contributions> {
  // GitHub's REST API has no contribution calendar; this public proxy exposes the real one.
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`);
  if (!res.ok) throw new Error("contrib");
  const j = (await res.json()) as { total: Record<string, number>; contributions: ContribDay[] };
  return { total: Object.values(j.total).reduce((a, b) => a + b, 0), days: j.contributions };
}

export function readCache(): GHData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as GHData) : null;
  } catch {
    return null;
  }
}
export const isFresh = (d: GHData) => Date.now() - d.fetchedAt < FRESH_MS;

export async function loadGitHub(): Promise<GHData> {
  const u = links.githubUser;
  const [user, repos, events, contrib] = await Promise.allSettled([
    gh<GHUser>(`/users/${u}`),
    gh<GHRepo[]>(`/users/${u}/repos?per_page=100&sort=pushed`),
    gh<GHEvent[]>(`/users/${u}/events/public?per_page=30`),
    fetchContributions(u),
  ]);
  if (user.status === "rejected") throw user.reason;
  if (repos.status === "rejected") throw repos.reason;
  const data: GHData = {
    user: user.value,
    repos: repos.value,
    events: events.status === "fulfilled" ? events.value : null,
    contributions: contrib.status === "fulfilled" ? contrib.value : null,
    fetchedAt: Date.now(),
  };
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
  return data;
}

export function timeAgo(iso: string) {
  const s = Math.max(1, (Date.now() - new Date(iso).getTime()) / 1000);
  const t: [number, string][] = [[31536000, "y"], [2592000, "mo"], [86400, "d"], [3600, "h"], [60, "m"]];
  for (const [n, l] of t) if (s >= n) return `${Math.floor(s / n)}${l} ago`;
  return "just now";
}

export function describeEvent(e: GHEvent): string {
  switch (e.type) {
    case "PushEvent": {
      const n = e.payload.commits?.length;
      return n ? `Pushed ${n} commit${n > 1 ? "s" : ""}` : "Pushed commits";
    }
    case "CreateEvent": return `Created ${e.payload.ref_type ?? "ref"}`;
    case "WatchEvent": return "Starred";
    case "ForkEvent": return "Forked";
    case "IssuesEvent": return `${e.payload.action ?? "Updated"} an issue`;
    case "PullRequestEvent": return `${e.payload.action ?? "Updated"} a pull request`;
    case "DeleteEvent": return "Deleted a ref";
    default: return e.type.replace("Event", "");
  }
}
