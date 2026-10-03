import { useInView } from 'framer-motion';
import { Play } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { MediaAsset, Motif, Tone } from '../../data/types';
import { cn } from '../../lib/cn';
import { MARK_PATHS } from '../brand/paths';
import { useReduceMotion } from '../../lib/motionPreference';

/** A muted looping clip that only downloads and plays while it's on screen. */
function InViewVideo({ className, media, still }: { className: string; media: MediaAsset; still: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: '200px 0px' });
  useEffect(() => {
    const v = ref.current;
    if (!v || still) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, still]);
  return (
    <video
      ref={ref}
      className={className}
      src={media.src}
      poster={media.poster}
      controls={still}
      muted
      loop
      playsInline
      preload="none"
      aria-label={media.alt}
    />
  );
}

interface ProjectVisualProps {
  media: MediaAsset;
  tone: Tone;
  /** Text used by the placeholder (usually the project title) */
  label: string;
  /** Used to show where the real asset should go (dev only) */
  slug?: string;
  /** Sizing/aspect classes for the wrapper, e.g. 'aspect-[4/5]' */
  className?: string;
  /** Eager-load above-the-fold images */
  priority?: boolean;
  sizes?: string;
  /** Scale up slightly when an ancestor `.group` is hovered */
  hoverZoom?: boolean;
}

/**
 * Renders a project image or video. When no `src` is set it draws a
 * typographic placeholder in the project's tone, so unfinished entries
 * still look intentional.
 */
export function ProjectVisual({ media, tone, label, slug, className, priority, sizes = '100vw', hoverZoom }: ProjectVisualProps) {
  const reduce = useReduceMotion();
  const inner = cn(
    'absolute inset-0 h-full w-full',
    media.fit === 'contain' ? 'object-contain p-[12%]' : 'object-cover',
    hoverZoom && 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-ok:group-hover:scale-[1.04]',
  );

  let content;
  if (media.src && media.type === 'video') {
    content = <InViewVideo className={inner} media={media} still={!!reduce} />;
  } else if (media.src && media.size) {
    // Minimal cover: the image small and centred on a flat backdrop
    content = (
      <img
        className="absolute left-1/2 top-1/2 h-auto max-h-[60%] -translate-x-1/2 -translate-y-1/2 object-contain"
        style={{ width: media.size }}
        src={media.src}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  } else if (media.src) {
    content = (
      <img
        className={inner}
        src={media.src}
        srcSet={media.srcSet}
        sizes={media.srcSet ? sizes : undefined}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    );
  } else {
    content = (
      <div className={inner} style={{ backgroundColor: tone.bg, color: tone.ink }} role="img" aria-label={media.alt}>
        <PlaceholderArt motif={media.motif ?? 'type'} label={label} accent={tone.accent} />
        {/* Labels step aside when the image is small (container queries) */}
        <span className="text-meta absolute left-4 top-4 opacity-70 @max-[13rem]:hidden">{label}</span>
        {media.kind && media.type !== 'video' && (
          <span className="text-meta absolute right-4 top-4 opacity-70 @max-[22rem]:hidden">{media.kind}</span>
        )}
        {media.type === 'video' && (
          <span className="text-meta absolute right-4 top-4 inline-flex items-center gap-1.5 opacity-70">
            <Play size={10} fill="currentColor" aria-hidden="true" /> Video
          </span>
        )}
        {import.meta.env.DEV && slug && (
          <span className="text-meta absolute bottom-4 left-4 normal-case tracking-normal opacity-50 @max-[22rem]:hidden">
            /assets/projects/{slug}/
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('@container relative overflow-hidden', className)} style={{ backgroundColor: media.background ?? tone.bg }}>
      {content}
    </div>
  );
}

/* ─── Placeholder art ─────────────────────────────────────────
   Drawn in an 800×600 box and cropped to fill any aspect ratio. */

function PlaceholderArt({ motif, label, accent }: { motif: Motif; label: string; accent?: string }) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      {motif === 'type' && <TypeMotif label={label} />}
      {motif === 'grid' && <GridMotif />}
      {motif === 'interface' && <InterfaceMotif />}
      {motif === 'orbit' && <OrbitMotif />}
      {motif === 'mark' && <MarkMotif />}
      {motif === 'lines' && <LinesMotif />}
      {motif === 'mobile' && <MobileMotif accent={accent} />}
      {motif === 'code' && <CodeMotif accent={accent} />}
    </svg>
  );
}

const hairline = { strokeWidth: 1, opacity: 0.18 };

function GuideLines() {
  return (
    <g {...hairline}>
      {[100, 200, 300, 400, 500, 600, 700].map((x) => (
        <line key={x} x1={x} y1={0} x2={x} y2={600} />
      ))}
    </g>
  );
}

function TypeMotif({ label }: { label: string }) {
  return (
    <>
      <GuideLines />
      <line x1={0} y1={300} x2={800} y2={300} strokeWidth={1} opacity={0.35} />
      <text
        x={-12}
        y={470}
        fill="currentColor"
        stroke="none"
        fontFamily="Geist, Helvetica, sans-serif"
        fontWeight={600}
        fontSize={230}
        letterSpacing={-14}
      >
        {label.toUpperCase()}
      </text>
    </>
  );
}

function GridMotif() {
  return (
    <>
      <g {...hairline}>
        {[200, 400, 600].map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={600} />
        ))}
        {[200, 400].map((y) => (
          <line key={y} x1={0} y1={y} x2={800} y2={y} />
        ))}
      </g>
      <rect x={200} y={200} width={200} height={200} fill="currentColor" stroke="none" />
      <circle cx={600} cy={300} r={100} fill="currentColor" stroke="none" opacity={0.85} />
      <path d="M400 600 A200 200 0 0 1 600 400 L600 600 Z" fill="currentColor" stroke="none" opacity={0.25} />
      <path d="M0 200 A200 200 0 0 1 200 0" strokeWidth={2} />
    </>
  );
}

function InterfaceMotif() {
  return (
    <g strokeWidth={1.5}>
      <rect x={140} y={90} width={520} height={420} rx={10} fill="currentColor" fillOpacity={0.04} />
      <line x1={140} y1={128} x2={660} y2={128} opacity={0.5} />
      {[162, 180, 198].map((cx) => (
        <circle key={cx} cx={cx} cy={109} r={4.5} opacity={0.6} />
      ))}
      <rect x={140} y={128} width={120} height={382} fill="currentColor" fillOpacity={0.08} stroke="none" />
      {[160, 184, 208, 232].map((y) => (
        <rect key={y} x={158} y={y} width={84} height={8} rx={4} fill="currentColor" stroke="none" opacity={0.35} />
      ))}
      <rect x={290} y={160} width={200} height={20} rx={4} fill="currentColor" stroke="none" />
      <rect x={290} y={192} width={300} height={8} rx={4} fill="currentColor" stroke="none" opacity={0.35} />
      <rect x={290} y={232} width={160} height={120} rx={6} opacity={0.5} />
      <rect x={466} y={232} width={160} height={120} rx={6} fill="currentColor" stroke="none" opacity={0.85} />
      <rect x={290} y={372} width={336} height={110} rx={6} opacity={0.5} />
      <polyline points="306,460 360,420 410,440 470,400 530,412 610,388" strokeWidth={2} />
    </g>
  );
}

function OrbitMotif() {
  return (
    <>
      {[60, 120, 180, 240].map((r, i) => (
        <circle key={r} cx={400} cy={300} r={r} strokeWidth={1.5} opacity={0.3 + i * 0.15} />
      ))}
      <ellipse cx={400} cy={300} rx={300} ry={90} strokeWidth={1.5} transform="rotate(-18 400 300)" />
      <circle cx={655} cy={210} r={16} fill="currentColor" stroke="none" />
      <circle cx={400} cy={300} r={22} fill="currentColor" stroke="none" />
    </>
  );
}

/** The Dsquare monogram, centred (uses the official brand shape). */
function MarkMotif() {
  const size = 300;
  const scale = size / 157.01;
  return (
    <>
      <GuideLines />
      <g transform={`translate(${400 - size / 2} ${300 - size / 2}) scale(${scale})`} fill="currentColor" stroke="none">
        {MARK_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </>
  );
}

function LinesMotif() {
  return (
    <g fill="currentColor" stroke="none">
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={0} y={i * 44 + 10} width={800} height={2 + (i % 4) * 5} opacity={0.15 + (i % 5) * 0.15} />
      ))}
      <rect x={480} y={120} width={220} height={360} opacity={0.9} />
    </g>
  );
}

function MobileMotif({ accent }: { accent?: string }) {
  return (
    <g strokeWidth={1.5}>
      <rect x={300} y={40} width={200} height={520} rx={30} fill="currentColor" fillOpacity={0.05} />
      <rect x={370} y={58} width={60} height={12} rx={6} fill="currentColor" stroke="none" opacity={0.6} />
      <rect x={322} y={96} width={156} height={180} rx={8} fill={accent ?? 'currentColor'} stroke="none" opacity={accent ? 1 : 0.85} />
      <rect x={322} y={292} width={110} height={14} rx={4} fill="currentColor" stroke="none" />
      <rect x={322} y={316} width={150} height={8} rx={4} fill="currentColor" stroke="none" opacity={0.35} />
      <rect x={322} y={332} width={130} height={8} rx={4} fill="currentColor" stroke="none" opacity={0.35} />
      <rect x={322} y={360} width={72} height={72} rx={6} opacity={0.5} />
      <rect x={406} y={360} width={72} height={72} rx={6} opacity={0.5} />
      <rect x={322} y={480} width={156} height={44} rx={22} fill="currentColor" stroke="none" />
    </g>
  );
}

function CodeMotif({ accent }: { accent?: string }) {
  // Indentation + width per line; reads like a component file at a glance.
  const lines: Array<[number, number, boolean?]> = [
    [0, 260, true], [1, 340], [2, 220], [2, 300, true], [3, 180], [3, 240], [2, 120], [1, 160, true],
    [1, 380], [2, 260], [2, 200, true], [1, 90], [0, 60],
  ];
  return (
    <g stroke="none">
      {lines.map(([indent, width, highlight], i) => (
        <g key={i}>
          <text x={70} y={92 + i * 36} fill="currentColor" opacity={0.35} fontFamily="Geist Mono, monospace" fontSize={16}>
            {String(i + 1).padStart(2, '0')}
          </text>
          <rect
            x={120 + indent * 32}
            y={80 + i * 36}
            width={width}
            height={12}
            rx={3}
            fill={highlight ? (accent ?? 'currentColor') : 'currentColor'}
            opacity={highlight ? 1 : 0.4}
          />
        </g>
      ))}
    </g>
  );
}
