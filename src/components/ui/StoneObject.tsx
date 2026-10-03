import { animate, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import { useReduceMotion } from '../../lib/motionPreference';

const FRONT_SRC = '/brand/stone.webp';
/** Same silhouette, darker — used for the slices that make up the stone's thickness. */
const SIDE_SRC = '/brand/stone-side.webp';

/** Number of stacked slices that fake the thickness, and the gap between them (px). */
const LAYERS = 14;
const STEP = 1.8;

/** How strongly the stone follows the cursor (same feel as the monogram). */
const MAX_TILT_Y = 28; // degrees, left/right
const MAX_TILT_X = 20; // degrees, up/down
const MAX_SHIFT_X = 18; // px of magnetic pull
const MAX_SHIFT_Y = 12;

/** Clip the lighting layers to the stone's outline. */
const STONE_MASK = {
  WebkitMaskImage: `url(${FRONT_SRC})`,
  maskImage: `url(${FRONT_SRC})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
} as const;

/**
 * The Dsquare monogram carved into a stone, given real depth in CSS 3D:
 * stacked, darker copies of its silhouette form the thickness behind the
 * photographed face.
 *
 * Same behaviour as the old extruded monogram: on desktop it tilts toward the
 * cursor, drifts slightly toward it (magnetic), is lit from the cursor's side (the far
 * side falls into shadow), lifts on hover and does a full turn when clicked; it eases back when
 * the cursor leaves. Starts still and only moves once `active`.
 * Touch devices and reduced motion get a calm, static stone.
 */
export function StoneObject({ className, active = true }: { className?: string; active?: boolean }) {
  const reduce = useReduceMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const interactive = !reduce && finePointer && active;
  const rootRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Pointer position relative to the stone's centre, -1 → 1 on each axis
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 16, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 16, mass: 0.6 });

  const rotateY = useTransform(sx, (v) => v * MAX_TILT_Y);
  const rotateX = useTransform(sy, (v) => -v * MAX_TILT_X);
  const shiftX = useTransform(sx, (v) => v * MAX_SHIFT_X);
  const shiftY = useTransform(sy, (v) => v * MAX_SHIFT_Y);
  // The light comes from the cursor: the side of the stone facing it brightens, the far side falls
  // into shadow. At rest it sits a little above centre, like a key light from the front-top.
  const lightX = useTransform(sx, (v) => `${50 + v * 55}%`);
  const lightY = useTransform(sy, (v) => `${32 + v * 55}%`);
  const highlight = useMotionTemplate`radial-gradient(circle at ${lightX} ${lightY}, rgb(255 255 255 / 0.2), rgb(255 255 255 / 0.06) 35%, transparent 65%)`;
  const shade = useMotionTemplate`radial-gradient(circle at ${lightX} ${lightY}, transparent 25%, rgb(0 0 0 / 0.4) 100%)`;
  // Floor shadow slides a little opposite the drift, anchoring the object
  const shadowX = useTransform(shiftX, (v) => -v * 0.6);

  // Extra full turn on click
  const spin = useMotionValue(0);

  useEffect(() => {
    if (!interactive) {
      px.set(0);
      py.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // Normalise by half the viewport so the whole screen maps to the full range
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      px.set(clamp((e.clientX - cx) / (window.innerWidth / 2)));
      py.set(clamp((e.clientY - cy) / (window.innerHeight / 2)));
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [interactive, px, py]);

  const onClick = () => {
    if (!interactive || spin.isAnimating()) return;
    animate(spin, 360, { duration: 1.1, ease: [0.65, 0, 0.35, 1] }).then(() => spin.set(0));
  };

  const slice = 'pointer-events-none absolute inset-0 h-full w-full select-none object-contain';

  return (
    <div
      ref={rootRef}
      className={cn('relative aspect-[415/580] [perspective:1100px]', interactive && 'cursor-pointer', className)}
      role="img"
      aria-label="Dsquare Studio monogram carved in stone"
      data-cursor={interactive ? 'Spin' : undefined}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Magnetic drift + hover lift */}
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={interactive ? { x: shiftX, y: shiftY } : undefined}
        animate={{ scale: interactive && hovered ? 1.04 : 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        {/* Tilt toward the cursor */}
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={reduce ? { rotateY: -18, rotateX: 6 } : { rotateX, rotateY }}
        >
          {/* Gentle idle sway + click spin */}
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d]"
            animate={reduce || !active ? { rotateY: 0 } : { rotateY: [0, 10, -10, 0] }}
            transition={{ rotateY: { duration: 12, ease: 'easeInOut', repeat: Infinity, delay: 0.4 } }}
          >
            <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateY: spin }}>
              {/* Thickness: darker copies of the silhouette stacked behind the face */}
              {Array.from({ length: LAYERS - 1 }, (_, i) => (
                <img
                  key={i}
                  src={SIDE_SRC}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className={slice}
                  style={{ transform: `translateZ(${(i - LAYERS / 2) * STEP}px)` }}
                />
              ))}
              {/* The photographed face, lit by the cursor: screen brightens the near side, multiply darkens the far side */}
              <div className="absolute inset-0" style={{ transform: `translateZ(${(LAYERS / 2 - 1) * STEP}px)` }}>
                <img src={FRONT_SRC} alt="" aria-hidden="true" draggable={false} className={slice} />
                {interactive ? (
                  <>
                    <motion.div className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ ...STONE_MASK, backgroundImage: shade }} />
                    <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ ...STONE_MASK, backgroundImage: highlight }} />
                  </>
                ) : (
                  // Touch / reduced motion: a fixed light from the top-left
                  <>
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-multiply"
                      style={{ ...STONE_MASK, backgroundImage: 'radial-gradient(circle at 35% 25%, transparent 25%, rgb(0 0 0 / 0.3) 100%)' }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-screen"
                      style={{ ...STONE_MASK, backgroundImage: 'radial-gradient(circle at 35% 25%, rgb(255 255 255 / 0.16), transparent 60%)' }}
                    />
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Soft floor shadow */}
      <motion.div
        className="absolute -bottom-6 left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl"
        style={interactive ? { x: shadowX } : undefined}
        aria-hidden="true"
      />
    </div>
  );
}
