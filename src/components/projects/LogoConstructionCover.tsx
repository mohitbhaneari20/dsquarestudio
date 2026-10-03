import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useIntroDone } from '../../lib/intro';
import { useReduceMotion } from '../../lib/motionPreference';

interface LogoConstructionCoverProps {
  src: string;
  alt: string;
  /** Logo + line colour */
  color: string;
  background: string;
}

/*
 * Geometry in a 400×300 (4:3) box. The logo sits in a centred square;
 * every guide is derived from it so the construction stays consistent.
 */
const W = 400;
const H = 300;
const CX = W / 2;
const CY = H / 2;
const S = 84; // logo square
const L = CX - S / 2; // left
const T = CY - S / 2; // top
const R = CX + S / 2; // right
const B = CY + S / 2; // bottom
const O = 18; // outer frame offset

/**
 * A logo presented the way it's drawn on a construction sheet: small and centred,
 * framed by thin guides, circles, diagonals and anchor points — no measurements.
 * Guides grow in from the centre when the card scrolls into view.
 */
export function LogoConstructionCover({ src, alt, color, background }: LogoConstructionCoverProps) {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReduceMotion();
  const ready = useIntroDone();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const shown = reduce || (ready && inView);

  /*
   * Each guide grows out from its own centre and fades up to its final strength,
   * staggered outwards. (Deliberately not `pathLength`: Framer implements it by
   * rewriting the dash pattern, which breaks dashed guides and hairline strokes.)
   *   'x' / 'y' — a straight guide growing along its axis
   *   'xy'      — diagonals, circles and frames scaling up into place
   */
  const draw = (i: number, opacity: number, grow: 'x' | 'y' | 'xy' = 'xy') => {
    const from = grow === 'x' ? { scaleX: 0 } : grow === 'y' ? { scaleY: 0 } : { scale: 0.86 };
    const to = grow === 'x' ? { scaleX: 1 } : grow === 'y' ? { scaleY: 1 } : { scale: 1 };
    return {
      initial: reduce ? { opacity, ...to } : { opacity: 0, ...from },
      animate: shown ? { opacity, ...to } : undefined,
      transition: { duration: 1.3, delay: 0.1 + i * 0.07, ease: [0.65, 0, 0.35, 1] as const },
      style: { transformBox: 'fill-box' as const, transformOrigin: 'center' },
    };
  };
  const dot = (i: number) => ({
    initial: reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 },
    animate: shown ? { scale: 1, opacity: 1 } : undefined,
    transition: { duration: 0.4, delay: 0.9 + i * 0.03, ease: 'easeOut' as const },
    style: { transformBox: 'fill-box' as const, transformOrigin: 'center' },
  });

  const line = { stroke: color, strokeWidth: 1, vectorEffect: 'non-scaling-stroke' as const, fill: 'none' };
  const anchors: Array<[number, number]> = [
    [L, T], [R, T], [L, B], [R, B],
    [L - O, T - O], [R + O, T - O], [L - O, B + O], [R + O, B + O],
  ];
  const nodes: Array<[number, number]> = [
    [CX, CY - 60], [CX, CY + 60], [CX - 60, CY], [CX + 60, CY],
  ];

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 h-full w-full"
      style={{ backgroundColor: background }}
      role="img"
      aria-label={alt}
    >
      {/* Guides brighten a touch on hover */}
      <g className="opacity-80 transition-opacity duration-700 group-hover:opacity-100">
        {/* Centre cross through the whole card */}
        <motion.line x1={0} y1={CY} x2={W} y2={CY} {...line} strokeDasharray="2 4" {...draw(0, 0.35, 'x')} />
        <motion.line x1={CX} y1={0} x2={CX} y2={H} {...line} strokeDasharray="2 4" {...draw(1, 0.35, 'y')} />

        {/* Edge guides of the logo square */}
        <motion.line x1={0} y1={T} x2={W} y2={T} {...line} {...draw(2, 0.18, 'x')} />
        <motion.line x1={0} y1={B} x2={W} y2={B} {...line} {...draw(3, 0.18, 'x')} />
        <motion.line x1={L} y1={0} x2={L} y2={H} {...line} {...draw(4, 0.18, 'y')} />
        <motion.line x1={R} y1={0} x2={R} y2={H} {...line} {...draw(5, 0.18, 'y')} />

        {/* Diagonals through the centre */}
        <motion.line x1={CX - 150} y1={0} x2={CX + 150} y2={H} {...line} {...draw(6, 0.14)} />
        <motion.line x1={CX + 150} y1={0} x2={CX - 150} y2={H} {...line} {...draw(7, 0.14)} />

        {/* Circles: inscribed, outer, and a wide dashed orbit */}
        <motion.circle cx={CX} cy={CY} r={S / 2} {...line} {...draw(8, 0.45)} />
        <motion.circle cx={CX} cy={CY} r={60} {...line} {...draw(9, 0.3)} />
        <motion.circle cx={CX} cy={CY} r={104} {...line} strokeDasharray="1 5" {...draw(10, 0.25)} />

        {/* Logo bounding box + outer frame */}
        <motion.rect x={L} y={T} width={S} height={S} {...line} {...draw(11, 0.6)} />
        <motion.rect x={L - O} y={T - O} width={S + O * 2} height={S + O * 2} {...line} {...draw(12, 0.25)} />

        {/* Anchor squares at the frame corners, nodes where the circle meets the cross */}
        {anchors.map(([x, y], i) => (
          <motion.rect
            key={`a${i}`}
            x={x - 2.5}
            y={y - 2.5}
            width={5}
            height={5}
            fill={background}
            stroke={color}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            {...dot(i)}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <motion.circle key={`n${i}`} cx={x} cy={y} r={2.2} fill={color} {...dot(anchors.length + i)} />
        ))}
      </g>

      {/* The logo itself, small and centred */}
      <motion.g
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={shown ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        <g className="origin-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-box:fill-box] motion-ok:group-hover:scale-[1.06]">
          <image href={src} x={L + 6} y={T + 6} width={S - 12} height={S - 12} preserveAspectRatio="xMidYMid meet" />
        </g>
      </motion.g>
    </svg>
  );
}
