import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useReduceMotion } from '../../lib/motionPreference';
import { MARK_PATHS, MARK_VIEWBOX } from '../brand/paths';

/*
 * The Services hero, as a little story on loop. The Dsquare monogram is the studio's
 * employee: it sits at its desk with a Mac mini and a monitor and works through a
 * project — a client call, the idea, the brand, a landing page, the build, motion,
 * the brand out in the world, and the client calling back, happy.
 * Plays only while on screen; with motion off it shows one still frame.
 */

const INK = '#000000';
const SAND = '#E6E1D8';
const PAPER = '#FAFAFA';
const ORANGE = '#FA5C01';
const SOFT = '#D5D1C8';
const TAUPE = '#8D7961';
const DARK = '#151515';

const PHASE = 2.6; // seconds per chapter
const CHAPTERS = [
  'Client call',
  'The idea',
  'Brand identity',
  'Landing page',
  'Development',
  'Motion',
  'Out in the world',
  'Happy client',
] as const;
const LOOP = PHASE * CHAPTERS.length;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - (1 - clamp(t)) ** 3;
/** 0→1 over [a, b] of the chapter, eased */
const span = (p: number, a: number, b: number) => ease((p - a) / (b - a));

// Monitor screen (inside the frame)
const SX = 178;
const SY = 158;
const SW = 184;
const SH = 112;

/* ─── What the monitor shows in each chapter ─────────────────── */

function Call({ p, happy }: { p: number; happy: boolean }) {
  const cx = SX + SW / 2;
  const cy = SY + 48;
  const smile = happy ? 10 * span(p, 0.1, 0.4) : 0;
  return (
    <g>
      <rect x={SX} y={SY} width={SW} height={SH} fill={DARK} />
      {/* Ringing, then connected */}
      {!happy && p < 0.3 && [0, 1].map((k) => <circle key={k} cx={cx} cy={cy} r={26 + ((p * 120 + k * 14) % 28)} fill="none" stroke={ORANGE} strokeWidth={1.5} opacity={1 - ((p * 120 + k * 14) % 28) / 28} />)}
      {/* The client */}
      <circle cx={cx} cy={cy} r={24} fill={happy ? ORANGE : SOFT} />
      <circle cx={cx - 8} cy={cy - 5} r={2.6} fill={INK} />
      <circle cx={cx + 8} cy={cy - 5} r={2.6} fill={INK} />
      <path d={`M ${cx - 9} ${cy + 7} Q ${cx} ${cy + 7 + smile} ${cx + 9} ${cy + 7}`} fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      {/* Talking */}
      {!happy && p > 0.3 && (
        <g opacity={span(p, 0.3, 0.4)}>
          <rect x={SX + 10} y={SY + 10} width={44} height={16} fill={PAPER} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={SX + 20 + k * 12} cy={SY + 18} r={2.2} fill={INK} opacity={0.3 + 0.7 * (((p * 6 + k * 0.33) % 1) > 0.5 ? 1 : 0)} />
          ))}
        </g>
      )}
      {/* The studio, in its own tile */}
      <rect x={SX + SW - 46} y={SY + SH - 34} width={38} height={26} fill={SOFT} />
      <Mark x={SX + SW - 36} y={SY + SH - 30} size={18} />
      {/* Call controls */}
      <rect x={cx - 22} y={SY + SH - 18} width={14} height={8} fill="#3E9B57" />
      <rect x={cx + 8} y={SY + SH - 18} width={14} height={8} fill="#D9442E" />
    </g>
  );
}

function Idea({ p }: { p: number }) {
  const draw = span(p, 0.05, 0.55);
  const fill = span(p, 0.6, 0.8);
  const cx = SX + SW / 2;
  const cy = SY + SH / 2;
  return (
    <g>
      <rect x={SX} y={SY} width={SW} height={SH} fill={PAPER} />
      {/* A sketch grid */}
      {[1, 2, 3, 4, 5].map((k) => (
        <line key={k} x1={SX + (SW / 6) * k} y1={SY} x2={SX + (SW / 6) * k} y2={SY + SH} stroke={SOFT} strokeWidth={0.8} />
      ))}
      <circle cx={cx - 12} cy={cy} r={28} fill="none" stroke={INK} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <rect x={cx - 2} y={cy - 26} width={44} height={44} fill={ORANGE} fillOpacity={fill} stroke={INK} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - span(p, 0.2, 0.6)} />
    </g>
  );
}

function Branding({ p }: { p: number }) {
  const swatches = [ORANGE, INK, SOFT, PAPER];
  return (
    <g>
      <rect x={SX} y={SY} width={SW} height={SH} fill={PAPER} />
      <Mark x={SX + 12} y={SY + 12} size={20} />
      <text x={SX + SW - 14} y={SY + 58} textAnchor="end" fontFamily="var(--font-sans)" fontWeight={500} fontSize={46} fill={INK} opacity={span(p, 0.45, 0.65)} letterSpacing="-2">
        Aa
      </text>
      {swatches.map((c, k) => {
        const s = span(p, 0.08 + k * 0.08, 0.3 + k * 0.08);
        return <rect key={c} x={SX + 12 + k * 30} y={SY + SH - 46 + (1 - s) * 50} width={26} height={34} fill={c} stroke={INK} strokeWidth={c === PAPER ? 1 : 0} />;
      })}
    </g>
  );
}

function Landing({ p, moving = false }: { p: number; moving?: boolean }) {
  const show = (k: number) => (moving ? 1 : span(p, 0.06 + k * 0.1, 0.2 + k * 0.1));
  const wob = (k: number) => (moving ? Math.sin(p * Math.PI * 4 + k) * 6 : 0);
  return (
    <g>
      <rect x={SX} y={SY} width={SW} height={SH} fill={PAPER} />
      {/* Nav */}
      <g opacity={show(0)}>
        <rect x={SX + 8} y={SY + 7} width={SW - 16} height={9} fill={SOFT} />
        <rect x={SX + 12} y={SY + 9} width={5} height={5} fill={INK} />
      </g>
      {/* Headline */}
      <rect x={SX + 12 + wob(1)} y={SY + 26} width={92 * show(1)} height={10} fill={INK} />
      <rect x={SX + 12 - wob(2)} y={SY + 40} width={64 * show(2)} height={10} fill={INK} />
      {/* Button */}
      <rect x={SX + 12} y={SY + 58} width={36} height={10} fill={ORANGE} opacity={show(3)} transform={moving ? `translate(0 ${-Math.abs(Math.sin(p * Math.PI * 6)) * 3})` : undefined} />
      {/* Cards */}
      {[0, 1, 2].map((k) => (
        <rect key={k} x={SX + 12 + k * 56} y={SY + 78 + (moving ? Math.sin(p * Math.PI * 4 + k * 1.3) * 4 : 0)} width={48} height={26} fill={k === 1 ? INK : SOFT} opacity={show(4 + k * 0.6)} />
      ))}
      {/* Motion: a dot running along a path */}
      {moving && (
        <g>
          <path d={`M ${SX + 120} ${SY + 66} C ${SX + 140} ${SY + 20}, ${SX + 170} ${SY + 30}, ${SX + 172} ${SY + 60}`} fill="none" stroke={TAUPE} strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={SX + 120 + 52 * ((p * 1.6) % 1)} cy={SY + 66 - Math.sin(((p * 1.6) % 1) * Math.PI) * 34} r={5} fill={ORANGE} />
        </g>
      )}
    </g>
  );
}

function Code({ p }: { p: number }) {
  const lines = [
    [0, 60, ORANGE],
    [12, 90, PAPER],
    [12, 70, TAUPE],
    [24, 100, PAPER],
    [24, 54, ORANGE],
    [12, 80, PAPER],
    [0, 40, TAUPE],
  ] as const;
  return (
    <g>
      <rect x={SX} y={SY} width={SW} height={SH} fill={DARK} />
      <text x={SX + SW - 10} y={SY + 18} textAnchor="end" fontFamily="var(--font-mono)" fontSize={12} fill={ORANGE}>
        {'</>'}
      </text>
      {lines.map(([indent, w, c], k) => {
        const typed = clamp((p * 1.15 - k * 0.12) / 0.14);
        return <rect key={k} x={SX + 12 + indent} y={SY + 12 + k * 13} width={w * typed} height={6} fill={c} />;
      })}
      {/* Cursor */}
      <rect x={SX + 12 + 60} y={SY + 12 + Math.min(6, Math.floor(p * 7)) * 13} width={2} height={7} fill={PAPER} opacity={(p * 8) % 1 > 0.5 ? 1 : 0} />
    </g>
  );
}

function Launch() {
  return (
    <g>
      <rect x={SX} y={SY} width={SW} height={SH} fill={ORANGE} />
      <Mark x={SX + SW / 2 - 22} y={SY + SH / 2 - 22} size={44} colour={INK} />
    </g>
  );
}

/** The brand, out in the world: things fly from the monitor to their places above the desk. */
function OutInTheWorld({ p }: { p: number }) {
  const from = { x: SX + SW / 2, y: SY + SH / 2 };
  const items = [
    { kind: 'poster', x: 40, y: 34, w: 50, h: 70 },
    { kind: 'billboard', x: 128, y: 22, w: 112, h: 52 },
    { kind: 'phone', x: 268, y: 26, w: 36, h: 68 },
    { kind: 'post', x: 326, y: 46, w: 52, h: 52 },
  ];
  return (
    <g>
      {items.map((it, k) => {
        const s = span(p, 0.08 + k * 0.1, 0.4 + k * 0.1);
        const x = from.x + (it.x - from.x) * s;
        const y = from.y + (it.y - from.y) * s;
        const sc = 0.2 + 0.8 * s;
        const likes = span(p, 0.55 + k * 0.06, 0.8 + k * 0.06);
        return (
          <g key={it.kind} transform={`translate(${x} ${y}) scale(${sc})`} opacity={s}>
            <rect width={it.w} height={it.h} fill={it.kind === 'billboard' ? INK : PAPER} stroke={INK} strokeWidth={2} />
            <rect x={it.w / 2 - 10} y={it.h / 2 - 10} width={20} height={20} fill={ORANGE} />
            {it.kind === 'billboard' && <line x1={it.w / 2} y1={it.h} x2={it.w / 2} y2={it.h + 14} stroke={INK} strokeWidth={3} />}
            {/* A little like count */}
            <g transform={`translate(${it.w - 6} -6) scale(${likes})`}>
              <circle r={8} fill={ORANGE} />
              <path d="M -3.2 -0.8 a 1.8 1.8 0 0 1 3.2 -1.2 a 1.8 1.8 0 0 1 3.2 1.2 c 0 2 -3.2 3.6 -3.2 3.6 s -3.2 -1.6 -3.2 -3.6 z" fill={PAPER} transform="translate(-0 0)" />
            </g>
          </g>
        );
      })}
    </g>
  );
}

/* ─── The cast ──────────────────────────────────────────────── */

function Mark({ x, y, size, colour = INK }: { x: number; y: number; size: number; colour?: string }) {
  const [, , vw] = MARK_VIEWBOX.split(' ').map(Number);
  return (
    <g transform={`translate(${x} ${y}) scale(${size / (vw ?? 157)})`} fill={colour}>
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

export function StudioStory({ className }: { className?: string }) {
  const reduce = useReduceMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const [t, setT] = useState(PHASE * 7 + PHASE * 0.7); // still frame: the happy client

  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setT((v) => (v + dt) % LOOP);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, inView]);

  const phase = Math.floor(t / PHASE) % CHAPTERS.length;
  const p = (t % PHASE) / PHASE;

  // The employee: types while building, waves on calls, cheers at launch, jumps for joy at the end
  const typing = phase >= 1 && phase <= 5;
  const bob = phase === 7 ? -Math.abs(Math.sin(p * Math.PI * 4)) * 10 : Math.sin(t * 2.2) * 1.2;
  const handJit = typing ? Math.sin(t * 28) * 2 : 0;
  const body = { x: 68, y: 262 + bob, s: 96 };
  const shoulder = { x: body.x + body.s - 6, y: body.y + 58 };
  const armTo =
    phase === 0 || phase === 7
      ? { x: shoulder.x + 22, y: shoulder.y - 34 + Math.sin(t * 9) * 6 } // waving at the call
      : phase === 6
        ? { x: shoulder.x + 14, y: shoulder.y - 46 } // cheering
        : { x: 198 + handJit, y: 324 }; // on the keyboard
  const otherArm = phase === 6 || phase === 7 ? { x: body.x + 2, y: body.y + 6 } : { x: 190 - handJit, y: 326 };

  return (
    <svg ref={ref} viewBox="0 0 400 500" className={className} role="img" aria-label="The Dsquare monogram at its desk: a client call, the idea, the brand, a landing page, the build, motion, the brand out in the world, and a happy client calling back.">
      <rect width={400} height={500} fill={SAND} />
      {/* Studio wall grid */}
      {[1, 2, 3].map((k) => (
        <line key={k} x1={k * 100} y1={0} x2={k * 100} y2={420} stroke={INK} strokeOpacity={0.06} />
      ))}

      {/* The spark of an idea */}
      {phase === 1 && (
        <g transform={`translate(${body.x + body.s / 2} ${body.y - 22}) scale(${0.6 + 0.4 * span(p, 0, 0.3)})`} opacity={span(p, 0, 0.2)}>
          <path d="M 0 -14 C 2 -4, 4 -2, 14 0 C 4 2, 2 4, 0 14 C -2 4, -4 2, -14 0 C -4 -2, -2 -4, 0 -14 Z" fill={ORANGE} />
        </g>
      )}

      {/* Out in the world, above the desk */}
      {phase === 6 && <OutInTheWorld p={p} />}

      {/* Desk */}
      <rect x={20} y={330} width={360} height={10} fill={INK} />
      <rect x={36} y={340} width={6} height={80} fill={INK} />
      <rect x={358} y={340} width={6} height={80} fill={INK} />
      <line x1={0} y1={420} x2={400} y2={420} stroke={INK} strokeWidth={2} />

      {/* Mac mini beside the monitor, with its status light */}
      <rect x={312} y={312} width={50} height={18} fill={SOFT} stroke={INK} strokeWidth={2} />
      <circle cx={352} cy={321} r={2} fill={phase === 4 ? ORANGE : TAUPE} />

      {/* Monitor */}
      <rect x={170} y={150} width={200} height={128} fill={INK} />
      <svg x={SX} y={SY} width={SW} height={SH} viewBox={`${SX} ${SY} ${SW} ${SH}`} overflow="hidden">
        {phase === 0 && <Call p={p} happy={false} />}
        {phase === 1 && <Idea p={p} />}
        {phase === 2 && <Branding p={p} />}
        {phase === 3 && <Landing p={p} />}
        {phase === 4 && <Code p={p} />}
        {phase === 5 && <Landing p={p} moving />}
        {phase === 6 && <Launch />}
        {phase === 7 && <Call p={p} happy />}
      </svg>
      <rect x={262} y={278} width={16} height={44} fill={INK} />
      <rect x={236} y={322} width={68} height={8} fill={INK} />

      {/* Keyboard */}
      <rect x={176} y={325} width={58} height={5} fill={TAUPE} />

      {/* Stool, pulled up close to the screen */}
      <rect x={66} y={358} width={104} height={8} fill={INK} />
      <rect x={114} y={366} width={8} height={54} fill={INK} />
      <rect x={94} y={414} width={48} height={6} fill={INK} />

      {/* The employee: the Dsquare monogram, in studio orange */}
      <line x1={shoulder.x} y1={shoulder.y} x2={armTo.x} y2={armTo.y} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <line x1={body.x + 20} y1={body.y + 66} x2={otherArm.x} y2={otherArm.y} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={phase === 6 || phase === 7 ? 1 : 0.9} />
      <Mark x={body.x} y={body.y} size={body.s} colour={ORANGE} />

      {/* Happy client: little hearts from the screen */}
      {phase === 7 &&
        [0, 1, 2].map((k) => {
          const h = clamp((p - k * 0.18) / 0.6);
          return (
            <path
              key={k}
              d="M -6 -2 a 3.4 3.4 0 0 1 6 -2.2 a 3.4 3.4 0 0 1 6 2.2 c 0 3.8 -6 6.8 -6 6.8 s -6 -3 -6 -6.8 z"
              fill={ORANGE}
              transform={`translate(${SX + SW / 2 + (k - 1) * 34} ${SY - 6 - h * 70}) scale(${0.8 + h})`}
              opacity={h > 0 ? 1 - h : 0}
            />
          );
        })}

      {/* Chapter caption and progress */}
      <text x={20} y={458} fontFamily="var(--font-mono)" fontSize={12} letterSpacing="1.5" fill={INK}>
        <tspan fill={ORANGE}>{String(phase + 1).padStart(2, '0')}</tspan> · {(CHAPTERS[phase] ?? CHAPTERS[0]).toUpperCase()}
      </text>
      {CHAPTERS.map((_, k) => (
        <rect key={k} x={20 + k * 46} y={472} width={40} height={3} fill={k === phase ? ORANGE : k < phase ? INK : SOFT} />
      ))}
    </svg>
  );
}
