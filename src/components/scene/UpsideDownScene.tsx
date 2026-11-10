/** Original illustrated Upside Down road scene. Deterministic (seeded) so SSR and client match. */

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Dead tree: returns one path string per branch generation (thick → thin). */
function tree(seed: number, x: number, y: number, len: number, depth = 7): string[] {
  const r = mulberry(seed);
  const levels: string[] = Array(depth + 1).fill("");
  const grow = (px: number, py: number, ang: number, l: number, d: number) => {
    const x2 = px + Math.cos(ang) * l;
    const y2 = py + Math.sin(ang) * l;
    levels[depth - d] += `M${px | 0} ${py | 0}L${x2 | 0} ${y2 | 0}`;
    if (d === 0) return;
    const kids = d > 5 && r() > 0.5 ? 3 : 2;
    for (let i = 0; i < kids; i++) {
      const spread = (i - (kids - 1) / 2) * (0.5 + r() * 0.35) + (r() - 0.5) * 0.3;
      grow(x2, y2, ang + spread, l * (0.7 + r() * 0.14), d - 1);
    }
  };
  grow(x, y, -Math.PI / 2 + (r() - 0.5) * 0.2, len, depth);
  return levels;
}

const TREES: { seed: number; x: number; y: number; len: number }[] = [
  { seed: 3, x: 90, y: 820, len: 210 },
  { seed: 8, x: 250, y: 800, len: 170 },
  { seed: 15, x: 520, y: 760, len: 130 },
  { seed: 21, x: 700, y: 712, len: 80 },
  { seed: 33, x: 1520, y: 830, len: 230 },
  { seed: 42, x: 1330, y: 790, len: 180 },
  { seed: 57, x: 1110, y: 745, len: 120 },
  { seed: 64, x: 930, y: 712, len: 78 },
  { seed: 72, x: 420, y: 790, len: 120 },
  { seed: 88, x: 1230, y: 780, len: 110 },
];

const POLES = [
  { x: 330, top: 300, base: 800, s: 1 },
  { x: 610, top: 470, base: 740, s: 0.6 },
  { x: 1000, top: 480, base: 740, s: 0.6 },
  { x: 1290, top: 250, base: 810, s: 1.05 },
];

function Pole({ x, top, base, s }: (typeof POLES)[number]) {
  return (
    <g fill="#070306">
      <rect x={x - 7 * s} y={top} width={14 * s} height={base - top} />
      <rect x={x - 46 * s} y={top + 18 * s} width={92 * s} height={9 * s} />
      <rect x={x - 32 * s} y={top + 48 * s} width={64 * s} height={7 * s} />
    </g>
  );
}

function Creature({ x, y, s }: { x: number; y: number; s: number }) {
  // Original silhouette: long limbs, hunched torso, petal-split head.
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#050105">
      <path d="M-14 -105 C-22 -90 -20 -70 -16 -58 L-26 -10 L-14 -8 L-6 -50 L0 -8 L12 -10 L10 -58 C16 -72 18 -92 12 -105Z" />
      <path d="M-14 -90 L-48 -52 L-52 -36 L-44 -38 L-24 -64Z" />
      <path d="M14 -90 L46 -54 L50 -38 L42 -40 L22 -66Z" />
      {[-70, -35, 0, 35, 70].map((a) => (
        <ellipse key={a} cx="0" cy="-128" rx="5" ry="20" transform={`rotate(${a} 0 -108)`} />
      ))}
      <circle cx="0" cy="-108" r="9" />
    </g>
  );
}

export function UpsideDownScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "#14020a" }} />
          <stop offset="0.35" style={{ stopColor: "var(--crimson)" }} />
          <stop offset="0.75" style={{ stopColor: "var(--accent-deep)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent)" }} />
        </linearGradient>
        <radialGradient id="horizon" cx="50%" cy="78%" r="45%">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="blur40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40" /></filter>
        <filter id="blur10" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="roadg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1626" />
          <stop offset="1" stopColor="#0d0509" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#sky)" />
      <rect width="1600" height="900" fill="url(#horizon)" />

      {/* looming structure: huge pillar and curved arms in the haze */}
      <g filter="url(#blur10)" opacity=".5" fill="#2a0713">
        <path d="M770 0 L830 0 L850 330 L800 560 L750 330Z" />
        <path d="M380 0 Q700 90 960 330 L900 360 Q680 170 330 40Z" />
        <path d="M1220 0 Q1010 70 870 280 L920 300 Q1060 140 1260 40Z" opacity=".7" />
      </g>
      <g filter="url(#blur40)" opacity=".55">
        <ellipse cx="800" cy="520" rx="420" ry="120" fill="#ff5c7c" />
        <ellipse cx="300" cy="560" rx="360" ry="90" fill="#ff2424" opacity=".6" />
        <ellipse cx="1350" cy="520" rx="320" ry="100" fill="#ff2d75" opacity=".6" />
      </g>

      {/* lightning */}
      <g fill="none" stroke="#fff4f4" strokeWidth="3" strokeLinejoin="round" filter="url(#glow)">
        <polyline className="animate-bolt" points="520,40 470,160 520,170 440,300 480,310 410,430" style={{ animationDelay: "0.4s" }} />
        <polyline className="animate-bolt" points="1180,0 1120,120 1170,130 1080,260 1130,270 1040,420" style={{ animationDelay: "2.9s" }} />
        <polyline className="animate-bolt" points="900,60 860,170 900,180 840,290" style={{ animationDelay: "5.2s" }} />
      </g>

      {/* distant haze over ground */}
      <rect y="560" width="1600" height="340" fill="#1a0510" opacity=".35" />

      {/* trees */}
      <g stroke="#08040a" strokeLinecap="round" fill="none">
        {TREES.map((t, ti) =>
          tree(t.seed, t.x, t.y, t.len).map((d, i) => (
            <path key={`${ti}-${i}`} d={d} strokeWidth={Math.max(1, (t.len / 14) * (1 - i / 8))} />
          )),
        )}
      </g>

      {/* poles + wires */}
      {POLES.map((p) => <Pole key={p.x} {...p} />)}
      <g fill="none" stroke="#0a0408" strokeWidth="1.6">
        <path d="M290 318 Q460 390 570 488" />
        <path d="M370 318 Q500 372 650 488" />
        <path d="M1040 498 Q1160 430 1250 268" />
        <path d="M960 498 Q1120 440 1330 268" />
        <path d="M655 488 Q790 530 985 498" />
      </g>

      {/* ground + road */}
      <path d="M0 760 Q200 700 420 740 L800 700 L1180 740 Q1400 700 1600 750 V900 H0Z" fill="#0a0409" />
      <path d="M760 700 L840 700 L1130 900 L470 900Z" fill="url(#roadg)" />
      <g stroke="#cfc3b2" strokeOpacity=".5" strokeWidth="5" strokeLinecap="round">
        <path d="M800 716 L800 724" strokeWidth="2" />
        <path d="M800 740 L800 756" strokeWidth="3" />
        <path d="M800 782 L800 806" strokeWidth="4" />
        <path d="M800 840 L800 880" strokeWidth="6" />
      </g>
      <path d="M0 800 Q300 770 560 830 L470 900 H0Z M1600 800 Q1300 770 1040 830 L1130 900 H1600Z" fill="#06020a" />

      {/* creatures standing on the road */}
      <Creature x={770} y={712} s={0.55} />
      <Creature x={858} y={718} s={0.36} />

      {/* vignette */}
      <rect width="1600" height="900" fill="url(#vig)" />
      <defs>
        <radialGradient id="vig" cx="50%" cy="55%" r="75%">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".7" />
        </radialGradient>
      </defs>
    </svg>
  );
}
