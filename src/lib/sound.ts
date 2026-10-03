/**
 * Tiny UI sounds, synthesised with the Web Audio API (no audio files).
 * Browsers only allow audio after the visitor interacts, so the context is
 * created on the first click or key press.
 */
let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

/** Overall loudness of every UI sound (0–1). */
const VOLUME = 0.5;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    // Half a second of white noise, reused by every sound
    noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

const jitter = (amount: number) => 1 + (Math.random() * 2 - 1) * amount;

/** A short burst of filtered noise — the "contact" part of a click or key. */
function burst(c: AudioContext, at: number, { freq, q, gain, length, type }: { freq: number; q: number; gain: number; length: number; type: BiquadFilterType }) {
  const src = c.createBufferSource();
  src.buffer = noise;
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const env = c.createGain();
  env.gain.setValueAtTime(gain * VOLUME, at);
  env.gain.exponentialRampToValueAtTime(0.0001, at + length);
  src.connect(filter).connect(env).connect(c.destination);
  src.start(at, Math.random() * 0.4);
  src.stop(at + length + 0.02);
}

/** A tiny pitched body under the noise — gives each sound its "thock". */
function tone(c: AudioContext, at: number, { from, to, gain, length, type = 'sine' }: { from: number; to: number; gain: number; length: number; type?: OscillatorType }) {
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + length);
  const env = c.createGain();
  env.gain.setValueAtTime(gain * VOLUME, at);
  env.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(env).connect(c.destination);
  osc.start(at);
  osc.stop(at + length + 0.02);
}

/** Mouse click: a soft, bright tick. */
export function playClick() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  burst(c, t, { freq: 3200 * jitter(0.08), q: 1.2, gain: 0.28, length: 0.018, type: 'bandpass' });
  tone(c, t, { from: 1900 * jitter(0.05), to: 900, gain: 0.12, length: 0.035, type: 'triangle' });
}

/** Typing: a mechanical-keyboard clack. Space and Enter are deeper, Backspace a little higher. */
export function playKey(key: string) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const big = key === ' ' || key === 'Enter';
  const pitch = (key === 'Backspace' ? 1.18 : big ? 0.72 : 1) * jitter(0.1);
  // Key hitting the switch…
  burst(c, t, { freq: 2600 * pitch, q: 0.9, gain: big ? 0.3 : 0.24, length: big ? 0.04 : 0.028, type: 'bandpass' });
  // …the low body of the keycap…
  tone(c, t, { from: (big ? 150 : 210) * pitch, to: (big ? 80 : 120) * pitch, gain: big ? 0.3 : 0.2, length: big ? 0.07 : 0.05 });
  // …and the release a moment later
  burst(c, t + 0.045 * jitter(0.2), { freq: 4200 * pitch, q: 1.5, gain: 0.07, length: 0.015, type: 'bandpass' });
}
