import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReduceMotion } from '../../lib/motionPreference';

type Mode = 'default' | 'link' | 'cta' | 'label';
type CursorState = { mode: Mode; label?: string };

/*
 * Matte black arrow with a short tube for a tail, drawn in a 70 × 82 box.
 * The tip sits at (2.5, 2.5).
 */
const OUTLINE =
  'M2.5 2.5 L65 44.5 L60.5 47 C53 47.2 48.6 48.6 47.6 53 L57.4 64.6 A6.6 4 -38 0 1 46.4 75.6 L36.8 63.6 C33.6 60.4 28.6 60.2 24.8 63 L10.5 78.4 Z';
const VB_W = 70;
const VB_H = 82;
/** Rendered width in px; the tip lands exactly on the pointer. */
const SIZE = 30;
const TIP = (2.5 / VB_W) * SIZE;
/** How far it leans into the direction of travel (degrees). */
const MAX_LEAN = 10;

function Arrow() {
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width={SIZE} height={(SIZE * VB_H) / VB_W} className="block overflow-visible">
      <defs>
        <clipPath id="cur-clip">
          <path d={OUTLINE} />
        </clipPath>
        {/* Soft fold light: a wide glow with a tighter core along the crease */}
        <filter id="cur-blur-wide" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="cur-blur-tight" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        {/* Fine matte grain */}
        <filter id="cur-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0" />
        </filter>
        <radialGradient id="cur-flank" cx="0.32" cy="0.42" r="0.5">
          <stop offset="0" stopColor="#2a2a2a" />
          <stop offset="1" stopColor="#2a2a2a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cur-shade" x1="0.35" y1="0.3" x2="1" y2="0.55">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Body (stroke in the same colour softens the corners) */}
      <path d={OUTLINE} fill="#111111" stroke="#111111" strokeWidth={2.2} strokeLinejoin="round" />

      <g clipPath="url(#cur-clip)">
        {/* Light falling on the left flank */}
        <rect width={VB_W} height={VB_H} fill="url(#cur-flank)" />
        {/* The crease running from the middle of the arrow down into the tail */}
        <path d="M20 30 C 28 39, 36 47, 48 63" fill="none" stroke="#8a8a8a" strokeWidth={12} strokeOpacity={0.26} filter="url(#cur-blur-wide)" />
        <path d="M23 34 C 30 41, 37 48, 47.5 62" fill="none" stroke="#bdbdbd" strokeWidth={2.6} strokeOpacity={0.2} filter="url(#cur-blur-tight)" />
        {/* The right-hand side turns away from the light */}
        <rect width={VB_W} height={VB_H} fill="url(#cur-shade)" />
        {/* Tube: a soft highlight along its upper side */}
        <path d="M49.6 54.6 L56 63" stroke="#bdbdbd" strokeWidth={1.6} strokeOpacity={0.3} strokeLinecap="round" filter="url(#cur-blur-tight)" />
        <rect width={VB_W} height={VB_H} filter="url(#cur-grain)" />
      </g>

      {/* Open end of the tube */}
      <ellipse cx={51.9} cy={70.1} rx={6.4} ry={3.8} transform="rotate(-38 51.9 70.1)" fill="#030303" stroke="#4a4a4a" strokeWidth={0.7} />

      {/* Hairline rim so it still reads over black sections */}
      <path d={OUTLINE} fill="none" stroke="rgb(255 255 255 / 0.13)" strokeWidth={0.6} strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Minimal matte arrow cursor (desktop only).
 *
 * - leans slightly toward the direction of travel
 * - link / button / CTA: grows a touch
 * - `data-cursor="Dig it"` (projects) and other labels: a small sharp tag beside the arrow
 * - click: presses in
 */
export function CustomCursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduce = useReduceMotion();
  const enabled = finePointer && !reduce;

  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  const x = useSpring(px, { stiffness: 1400, damping: 70, mass: 0.2 });
  const y = useSpring(py, { stiffness: 1400, damping: 70, mass: 0.2 });
  const lean = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });

  const [state, setState] = useState<CursorState>({ mode: 'default' });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const last = useRef({ x: 0, t: 0 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    let settle = 0;

    const onMove = (e: PointerEvent) => {
      px.set(e.clientX);
      py.set(e.clientY);
      const now = performance.now();
      const vx = (e.clientX - last.current.x) / Math.max(8, now - last.current.t);
      last.current = { x: e.clientX, t: now };
      lean.set(Math.max(-MAX_LEAN, Math.min(MAX_LEAN, vx * 10)));
      clearTimeout(settle);
      settle = window.setTimeout(() => lean.set(0), 70);
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (labelled) return setState({ mode: 'label', label: labelled.dataset.cursor });
      if (target?.closest('[data-cursor-cta]')) return setState({ mode: 'cta' });
      if (target?.closest('input, textarea, select')) return setVisible(false);
      if (target?.closest('a, button, [role="tab"], label')) return setState({ mode: 'link' });
      setState({ mode: 'default' });
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerover', onOver);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      clearTimeout(settle);
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerover', onOver);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, px, py, lean]);

  if (!enabled) return null;

  const { mode } = state;
  const scale = (pressed ? 0.85 : 1) * ({ default: 1, link: 1.12, cta: 1.18, label: 1.08 }[mode]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        style={{ marginLeft: -TIP, marginTop: -TIP, rotate: lean, transformOrigin: `${TIP}px ${TIP}px` }}
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      >
        <Arrow />
      </motion.div>

      {/* Small sharp tag beside the arrow, e.g. "Dig it" on projects */}
      <AnimatePresence>
        {mode === 'label' && state.label && (
          <motion.span
            key={state.label}
            className="text-meta absolute left-7 top-8 whitespace-nowrap bg-black px-2.5 py-1.5 text-[#fafafa]"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {state.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
