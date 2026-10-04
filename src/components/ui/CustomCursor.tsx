import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReduceMotion } from '../../lib/motionPreference';

type Mode = 'default' | 'link' | 'cta' | 'label';
type CursorState = { mode: Mode; label?: string };

/** Ring size per mode (px) — the trailing square grows over things you can click. */
const RING = { default: 34, link: 54, cta: 66, label: 92 } as const;
/** How much the ring stretches along the direction of travel at full speed. */
const MAX_STRETCH = 0.45;

/** Words in `data-cursor` that show an icon instead of text. */
const EYE_LABEL = 'View';

/**
 * Line eye for "View". Each click bumps `blink`, which closes and reopens the lids;
 * it also blinks on its own now and then while it waits.
 */
function Eye({ blink }: { blink: number }) {
  const origin = { originX: '50%', originY: '50%', transformBox: 'fill-box' } as const;
  // Remember which click opened this eye, so only clicks made while it's showing blink it
  const [seen] = useState(blink);
  return (
    <svg viewBox="0 0 32 20" width={38} height={24} fill="none" stroke="#fafafa" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="block overflow-visible">
      {/* A slow blink every few seconds while it waits */}
      <motion.g style={origin} animate={{ scaleY: [1, 1, 0.06, 1] }} transition={{ duration: 3.2, times: [0, 0.9, 0.94, 1], ease: 'easeInOut', repeat: Infinity }}>
        {/* A quick blink on every click */}
        <motion.g
          key={blink}
          style={origin}
          initial={false}
          animate={blink > seen ? { scaleY: [1, 0.06, 1] } : { scaleY: 1 }}
          transition={{ duration: 0.28, times: [0, 0.4, 1], ease: 'easeInOut' }}
        >
          {/* Almond outline */}
          <path d="M2 10 C 7 2.5, 25 2.5, 30 10 C 25 17.5, 7 17.5, 2 10 Z" />
          {/* Iris and an orange pupil */}
          <circle cx={16} cy={10} r={4.2} />
          <circle cx={16} cy={10} r={1.6} fill="var(--accent)" stroke="none" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

/**
 * Two-part square cursor (desktop only) — the "square" in Dsquare.
 *
 * - a small orange square sits exactly on the pointer
 * - a hairline square trails behind on a soft spring, stretching along the
 *   direction of travel and breathing gently when the pointer rests
 * - link / button: the ring opens up and the dot tucks away
 * - CTA: the ring turns orange
 * - `data-cursor="View"` (projects): the ring fills and shows an eye, which blinks on click
 * - other `data-cursor` labels (e.g. "Spin"): the ring fills and shows the word
 * - click: the ring presses in, the dot pops
 * The ring is frosted glass: a translucent white fill that blurs what's behind it.
 */
export function CustomCursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduce = useReduceMotion();
  const enabled = finePointer && !reduce;

  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  // Dot: nearly locked to the pointer. Ring: a softer, floatier follow.
  const dotX = useSpring(px, { stiffness: 1600, damping: 70, mass: 0.15 });
  const dotY = useSpring(py, { stiffness: 1600, damping: 70, mass: 0.15 });
  const ringX = useSpring(px, { stiffness: 260, damping: 24, mass: 0.6 });
  const ringY = useSpring(py, { stiffness: 260, damping: 24, mass: 0.6 });
  // Stretch along the travel direction
  const angle = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const stretch = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  // Longer along the direction of travel, a little thinner across it — like a drop of ink
  const scaleX = useTransform(stretch, (v) => 1 + v);
  const scaleY = useTransform(stretch, (v) => 1 - v * 0.45);

  const [state, setState] = useState<CursorState>({ mode: 'default' });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [blink, setBlink] = useState(0);
  const [moving, setMoving] = useState(false);
  const last = useRef({ x: 0, y: 0, t: 0, a: 0 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    let settle = 0;

    const onMove = (e: PointerEvent) => {
      px.set(e.clientX);
      py.set(e.clientY);
      const now = performance.now();
      const l = last.current;
      const dt = Math.max(8, now - l.t);
      const dx = e.clientX - l.x;
      const dy = e.clientY - l.y;
      const speed = Math.hypot(dx, dy) / dt; // px per ms
      if (speed > 0.05) {
        // Unwrap so the ring always turns the short way (a stretched square repeats every 180°)
        let a = (Math.atan2(dy, dx) * 180) / Math.PI;
        while (a - l.a > 90) a -= 180;
        while (a - l.a < -90) a += 180;
        l.a = a;
        angle.set(a);
      }
      stretch.set(Math.min(MAX_STRETCH, speed * 0.18));
      last.current = { ...l, x: e.clientX, y: e.clientY, t: now };
      setMoving(true);
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        stretch.set(0);
        // Settle back square (a square looks the same every 90°, so snap to the nearest)
        last.current.a = Math.round(last.current.a / 90) * 90;
        angle.set(last.current.a);
        setMoving(false);
      }, 90);
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

    const onDown = () => {
      setPressed(true);
      setBlink((b) => b + 1);
    };
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
  }, [enabled, px, py, angle, stretch]);

  if (!enabled) return null;

  const { mode } = state;
  const size = RING[mode];
  const labelled = mode === 'label' && !!state.label;
  const idle = mode === 'default' && !moving && !pressed;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      {/* Trailing square */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Stretch along the direction of travel */}
        <motion.div className="relative size-0" style={{ rotate: angle, scaleX, scaleY, transformOrigin: '0 0' }}>
          <motion.div
            className="absolute border border-solid"
            // Frosted glass: blurs and brightens whatever is behind it, with a soft lift
            style={{
              backdropFilter: 'blur(3px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(3px) saturate(1.6)',
              boxShadow: '0 8px 24px -10px rgb(0 0 0 / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.55)',
            }}
            animate={{
              width: size,
              height: size,
              // Centred on the pointer while it grows
              left: -size / 2,
              top: -size / 2,
              scale: pressed ? 0.78 : idle ? [1, 1.08, 1] : 1,
              backgroundColor: labelled ? 'rgb(12 12 12 / 0.55)' : mode === 'cta' ? 'rgb(250 92 1 / 0.28)' : mode === 'link' ? 'rgb(255 255 255 / 0.32)' : 'rgb(255 255 255 / 0.22)',
              borderColor: mode === 'cta' ? 'rgb(250 92 1 / 0.7)' : labelled ? 'rgb(255 255 255 / 0.18)' : 'rgb(255 255 255 / 0.7)',
            }}
            transition={{
              width: { type: 'spring', stiffness: 320, damping: 26 },
              height: { type: 'spring', stiffness: 320, damping: 26 },
              left: { type: 'spring', stiffness: 320, damping: 26 },
              top: { type: 'spring', stiffness: 320, damping: 26 },
              scale: idle ? { duration: 2.4, ease: 'easeInOut', repeat: Infinity } : { type: 'spring', stiffness: 420, damping: 22 },
              default: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
            }}
          />
        </motion.div>
      </motion.div>

      {/* Label inside the filled square, kept upright (outside the stretch) */}
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <AnimatePresence>
          {labelled && (
            <motion.span
              key={state.label}
              className="text-meta absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[#fafafa]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {state.label === EYE_LABEL ? <Eye blink={blink} /> : state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Orange dot on the pointer */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.span
          className="block size-[7px] -translate-x-1/2 -translate-y-1/2 bg-accent"
          animate={{ scale: pressed ? 1.8 : mode === 'default' ? 1 : 0, rotate: pressed ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 24 }}
        />
      </motion.div>
    </div>
  );
}

