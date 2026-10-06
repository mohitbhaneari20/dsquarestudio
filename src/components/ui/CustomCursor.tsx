import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReduceMotion } from '../../lib/motionPreference';

type Mode = 'default' | 'link' | 'label';
type CursorState = { mode: Mode; label?: string };

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
    <svg viewBox="0 0 32 20" width={26} height={16} fill="none" stroke="#fafafa" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="block overflow-visible">
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
 * A quiet custom cursor (mouse and trackpad only) — the "square" in Dsquare.
 *
 * - a small orange square sits exactly on the pointer
 * - over links and buttons a thin orange outline grows around it
 * - over projects (`data-cursor="View"`) a small black tag with an eye sits beside the
 *   pointer — never on top of the work — and blinks on click; other labels show their word
 * - it hides over text fields, so the normal text cursor shows there
 * Always orange, on every background.
 */
export function CustomCursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduce = useReduceMotion();
  const enabled = finePointer && !reduce;

  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  // Tight springs: it should feel attached to the pointer, not trail behind it
  const x = useSpring(px, { stiffness: 1400, damping: 70, mass: 0.15 });
  const y = useSpring(py, { stiffness: 1400, damping: 70, mass: 0.15 });

  const [state, setState] = useState<CursorState>({ mode: 'default' });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [blink, setBlink] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px.set(e.clientX);
      py.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (labelled) return setState({ mode: 'label', label: labelled.dataset.cursor });
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
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerover', onOver);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, px, py]);

  if (!enabled) return null;

  const { mode, label } = state;
  const ring = mode === 'link' ? 30 : 0;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Outline over links and buttons */}
      <motion.span
        className="absolute block border-[1.5px] border-accent"
        animate={{ width: ring, height: ring, left: -ring / 2, top: -ring / 2, opacity: ring ? 1 : 0, scale: pressed ? 0.85 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      />
      {/* The square on the pointer */}
      <motion.span
        className="absolute -left-1 -top-1 block size-2 bg-accent"
        animate={{ scale: pressed ? 0.6 : mode === 'label' ? 0.75 : 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      />
      {/* Tag beside the pointer over projects and labelled elements */}
      <AnimatePresence>
        {mode === 'label' && label && (
          <motion.span
            key={label}
            className={`text-meta absolute left-4 top-4 flex items-center justify-center whitespace-nowrap bg-black text-[#fafafa] ${label === EYE_LABEL ? 'size-10' : 'h-8 min-w-8 px-2.5'}`}
            initial={{ opacity: 0, scale: 0.8, x: -4, y: -4 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top left' }}
          >
            {label === EYE_LABEL ? <Eye blink={blink} /> : label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
