/**
 * Original ambient drone synthesised with the Web Audio API.
 * No audio files, so nothing to license. Off by default; starts only after a user click.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let nodes: (OscillatorNode | AudioBufferSourceNode)[] = [];

export function startAmbient() {
  if (ctx) return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 260;
  lp.connect(master);

  // low detuned drone
  for (const [f, type] of [[55, "sawtooth"], [55.4, "sawtooth"], [82.5, "sine"]] as const) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    o.connect(lp);
    o.start();
    nodes.push(o);
  }
  // slow breathing of the filter
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 90;
  lfo.connect(lfoGain).connect(lp.frequency);
  lfo.start();
  nodes.push(lfo);

  master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.5);
}

export function stopAmbient() {
  if (!ctx || !master) return;
  const c = ctx;
  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.linearRampToValueAtTime(0, c.currentTime + 0.8);
  setTimeout(() => {
    nodes.forEach((n) => { try { n.stop(); } catch {} });
    nodes = [];
    c.close();
    if (ctx === c) { ctx = null; master = null; }
  }, 900);
}
