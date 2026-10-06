import { motion } from 'framer-motion';
import { ArrowUpRight, Asterisk, Smile } from 'lucide-react';
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { BrandMark } from '../brand/Brand';

/*
 * Brand stickers, slapped onto each page at random — two per page, tucked over the
 * page edges, tilted, and draggable. Each one is built like a real sticker: a white
 * die-cut border, a soft lifted shadow, a glossy sheen, and a peeled
 * corner on the cards.
 */

const ORANGE = '#FA5C01';

/** The white die-cut edge and the lift off the page. */
const LIFT: CSSProperties = { filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.22)) drop-shadow(0 12px 16px rgb(0 0 0 / 0.22))' };

/** A light streak across the surface, like gloss vinyl catching the light. */
function Sheen({ radius }: { radius: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[length:250%_100%] bg-[position:100%_0] transition-[background-position] duration-700 ease-out group-hover:bg-[position:0%_0]"
      style={{
        borderRadius: radius,
        backgroundImage: 'linear-gradient(115deg, rgb(255 255 255 / 0) 38%, rgb(255 255 255 / 0.55) 48%, rgb(255 255 255 / 0) 58%)',
        mixBlendMode: 'soft-light',
      }}
    />
  );
}

/** Text running round a circle. */
function RingText({ text, size, colour, fontSize = 11 }: { text: string; size: number; colour: string; fontSize?: number }) {
  const id = useId();
  const r = size / 2 - fontSize * 1.15;
  const c = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path id={id} d={`M ${c} ${c} m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0`} fill="none" />
      <text fill={colour} style={{ fontFamily: 'var(--font-mono)', fontSize, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        <textPath href={`#${id}`} textLength={Math.PI * 2 * r - fontSize} lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

/** A round sticker: white die-cut ring around the printed face. */
function Round({ size, face, children }: { size: number; face: CSSProperties; children: ReactNode }) {
  return (
    <div className="relative rounded-full bg-white p-[6px]" style={{ width: size, height: size }}>
      <div className="relative h-full w-full overflow-hidden rounded-full" style={face}>
        {children}
      </div>
      <Sheen radius="9999px" />
    </div>
  );
}

/** A rectangular sticker with rounded corners and its bottom-right corner peeling up. */
function Peeled({ w, h, radius, face, peel = 34, children }: { w: number; h: number; radius: number; face: CSSProperties; peel?: number; children: ReactNode }) {
  // The corner is cut away along a diagonal, and the flap folds back over the face
  const cut = `polygon(0 0, 100% 0, 100% calc(100% - ${peel}px), calc(100% - ${peel}px) 100%, 0 100%)`;
  return (
    <div className="relative" style={{ width: w, height: h }}>
      <div className="absolute inset-0 bg-white p-[6px]" style={{ borderRadius: radius + 6, clipPath: cut }}>
        <div className="relative h-full w-full overflow-hidden" style={{ ...face, borderRadius: radius }}>
          {children}
        </div>
        <Sheen radius={`${radius + 6}px`} />
      </div>
      {/* The lifted flap: the sticker's paper back, catching light at the fold */}
      <span
        aria-hidden="true"
        className="absolute"
        style={{
          right: 0,
          bottom: 0,
          width: peel,
          height: peel,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          background: 'linear-gradient(135deg, #f1f1ef 0%, #ffffff 45%, #d9d6d0 100%)',
          boxShadow: 'inset -2px -2px 4px rgb(0 0 0 / 0.08)',
          filter: 'drop-shadow(-2px -2px 3px rgb(0 0 0 / 0.18))',
          borderTopLeftRadius: 4,
        }}
      />
    </div>
  );
}

/** Line eye from the cursor's View tag. */
function Eye({ size, stroke }: { size: number; stroke: string }) {
  return (
    <svg viewBox="0 0 32 20" width={size} height={(size * 20) / 32} fill="none" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 10 C 7 2.5, 25 2.5, 30 10 C 25 17.5, 7 17.5, 2 10 Z" />
      <circle cx={16} cy={10} r={4.2} />
      <circle cx={16} cy={10} r={1.7} fill={ORANGE} stroke="none" />
    </svg>
  );
}

/* ─── The sticker sheet ─────────────────────────────────────── */

const STICKERS: Array<{ name: string; w: number; h: number; render: () => ReactNode }> = [
  {
    name: 'Design × Development',
    w: 168,
    h: 168,
    render: () => (
      <Round size={168} face={{ background: ORANGE }}>
        <RingText text="Design × Development × " size={156} colour="#000" fontSize={11} />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrandMark title={null} copyright={false} className="size-14 text-black" />
        </div>
      </Round>
    ),
  },
  {
    name: 'Icons',
    w: 236,
    h: 78,
    render: () => (
      <div className="relative rounded-full bg-white p-[6px]" style={{ width: 236, height: 78 }}>
        <div className="flex h-full w-full items-center justify-around rounded-full px-3 text-black" style={{ background: ORANGE }}>
          <Asterisk size={30} strokeWidth={1.8} />
          <span className="size-6 bg-black" />
          <Smile size={30} strokeWidth={1.8} />
          <Eye size={34} stroke="#000" />
          <ArrowUpRight size={30} strokeWidth={1.8} />
        </div>
        <Sheen radius="9999px" />
      </div>
    ),
  },
  {
    name: 'Definition card',
    w: 250,
    h: 160,
    render: () => (
      <Peeled w={250} h={160} radius={14} peel={30} face={{ background: '#fafafa' }}>
        <div className="flex h-full flex-col justify-between p-4 text-black">
          <div className="flex items-start justify-between">
            <span className="text-[26px] font-medium leading-none tracking-[-0.04em]">DSQUARE</span>
            <span className="flex">
              <span className="flex size-6 items-center justify-center rounded-full bg-black font-mono text-[9px] text-white">20</span>
              <span className="-ml-1 flex size-6 items-center justify-center rounded-full border border-black bg-white font-mono text-[9px]">26</span>
            </span>
          </div>
          <div className="flex items-end gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-black">
              <BrandMark title={null} copyright={false} className="size-4" />
            </span>
            <p className="font-mono text-[8.5px] uppercase leading-[1.45] tracking-[0.06em]">
              <b>Design:</b> work out what it should be.
              <br />
              <b>Develop:</b> make it real, not just pretty.
            </p>
          </div>
        </div>
      </Peeled>
    ),
  },
  {
    name: 'View the work',
    w: 150,
    h: 150,
    render: () => (
      <Round size={150} face={{ background: '#000' }}>
        <RingText text="View the work · View the work · " size={138} colour="#fafafa" fontSize={10} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Eye size={52} stroke="#fafafa" />
        </div>
      </Round>
    ),
  },
  {
    name: 'Good design',
    w: 196,
    h: 132,
    render: () => (
      <Peeled w={196} h={132} radius={12} peel={26} face={{ background: '#000' }}>
        <div className="flex h-full flex-col justify-between p-4 text-[#fafafa]">
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#FA5C01]">
            <span className="size-1.5 bg-[#FA5C01]" /> Dsquare Studio
          </span>
          <p className="text-[17px] font-medium leading-[1.05] tracking-[-0.03em]">Good design should do more than look good.</p>
        </div>
      </Peeled>
    ),
  },
];

type Placement = { sticker: number; side: 'left' | 'right'; top: number; rotate: number; inset: number };
type Box = { x0: number; y0: number; x1: number; y1: number };

/** Anything a sticker mustn't cover: text, links, buttons, images, fields, embeds (or anything marked `data-no-sticker`) — and pinned scroll scenes. */
const BLOCKERS = '[data-no-sticker], iframe, form, p, h1, h2, h3, h4, h5, h6, li, a, button, img, video, picture, canvas, input, textarea, select, label, figure, blockquote, dt, dd, [role="img"], .text-meta';

function blockedBoxes(layer: HTMLElement): Box[] {
  const origin = layer.getBoundingClientRect();
  const toBox = (r: DOMRect): Box => ({ x0: r.left - origin.left, y0: r.top - origin.top, x1: r.right - origin.left, y1: r.bottom - origin.top });
  const main = layer.parentElement?.querySelector('main');
  if (!main) return [];
  const boxes = [...main.querySelectorAll<HTMLElement>(BLOCKERS)].map((el) => el.getBoundingClientRect()).filter((r) => r.width && r.height).map(toBox);
  // Pinned scenes move under a sticker as you scroll, so their whole stretch is off limits
  main.querySelectorAll<HTMLElement>('.sticky').forEach((el) => el.parentElement && boxes.push(toBox(el.parentElement.getBoundingClientRect())));
  return boxes;
}

/**
 * Two different stickers on opposite edges, each placed where the part that shows
 * lands on empty space. If a page has no free spot on an edge, it gets fewer stickers.
 */
function place(layer: HTMLElement, scale: number): Placement[] {
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const width = layer.clientWidth;
  const height = layer.clientHeight;
  const boxes = blockedBoxes(layer);
  const order = [...STICKERS.keys()].sort(() => Math.random() - 0.5);
  const firstSide: Placement['side'] = Math.random() < 0.5 ? 'left' : 'right';
  const out: Placement[] = [];
  // Room around the visible part — generous vertically, since content eases up into place as it reveals
  const padX = 20;
  const padY = 64;
  const fits = (sticker: number, side: Placement['side'], top: number, inset: number) => {
    const s = STICKERS[sticker]!;
    // Rotation can swing the corners out a little, so allow some slack
    const w = s.w * scale * 1.12;
    const h = s.h * scale * 1.12;
    const shown = w * (1 - inset);
    const box: Box =
      side === 'left' ? { x0: 0, y0: top - padY, x1: shown + padX, y1: top + h + padY } : { x0: width - shown - padX, y0: top - padY, x1: width, y1: top + h + padY };
    // Never in the opening screen: the hero stays clean, and its parts move as you scroll
    if (top < window.innerHeight || top + h + padY > height) return false;
    const clear = (b: Box) => !(b.x0 < box.x1 && b.x1 > box.x0 && b.y0 < box.y1 && b.y1 > box.y0);
    // Two stickers on the same edge need a clear gap between them
    return boxes.every(clear) && out.every((p) => p.side !== side || Math.abs(p.top - top) > 2.2 * h + padY);
  };
  // First choice: one in each half of the page, on opposite edges. Then anywhere free.
  const slots = [
    { range: [0.06, 0.5], side: firstSide },
    { range: [0.5, 0.94], side: firstSide === 'left' ? 'right' : 'left' },
  ] as const;
  for (const slot of slots) {
    for (let attempt = 0; attempt < 240; attempt++) {
      const relaxed = attempt >= 120;
      const sticker = order[(out.length + attempt) % order.length]!;
      if (out.some((p) => p.sticker === sticker)) continue;
      // Relaxed: the opposite edge first, then either
      const side: Placement['side'] = !relaxed ? slot.side : attempt < 180 && out[0] ? (out[0].side === 'left' ? 'right' : 'left') : Math.random() < 0.5 ? 'left' : 'right';
      const top = (relaxed ? rand(0.04, 0.96) : rand(slot.range[0], slot.range[1])) * height;
      const inset = rand(0.3, 0.45);
      if (fits(sticker, side, top, inset)) {
        out.push({ sticker, side, top, rotate: rand(-16, 16), inset });
        break;
      }
    }
  }
  return out;
}

/** The stickers for the current page. New ones are picked on every page visit. */
export function PageStickers() {
  const { pathname } = useLocation();
  const small = !useMediaQuery('(min-width: 768px)');
  const scale = small ? 0.6 : 1;
  const layer = useRef<HTMLDivElement>(null);
  const [placements, setPlacements] = useState<Placement[] | null>(null);
  // Placed once the page has laid out (after the page transition and the first images)
  useEffect(() => {
    setPlacements(null);
    const t = window.setTimeout(() => layer.current && setPlacements(place(layer.current, scale)), 1400);
    return () => window.clearTimeout(t);
  }, [pathname, scale]);

  return (
    <div ref={layer} className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
      {placements?.map((p, i) => {
        const s = STICKERS[p.sticker]!;
        const w = s.w * scale;
        // Partly over the edge of the page, so they read as stuck on rather than laid out
        const x = -w * p.inset;
        return (
          <motion.div
            key={`${pathname}-${i}`}
            className="sticker group pointer-events-auto absolute cursor-grab active:cursor-grabbing"
            data-cursor="Drag"
            style={{ top: p.top, [p.side]: x, width: s.w, height: s.h, scale, transformOrigin: p.side === 'left' ? 'left top' : 'right top', ...LIFT }}
            initial={{ opacity: 0, scale: scale * 1.25, rotate: p.rotate + (p.side === 'left' ? -10 : 10) }}
            animate={{ opacity: 1, scale, rotate: p.rotate }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 + i * 0.25 }}
            whileHover={{ scale: scale * 1.04 }}
            whileDrag={{ scale: scale * 1.08 }}
            drag
            dragConstraints={layer}
            dragElastic={0.12}
            dragMomentum={false}
            title={`${s.name} sticker — drag me`}
          >
            {s.render()}
          </motion.div>
        );
      })}
    </div>
  );
}
