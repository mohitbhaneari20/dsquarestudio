/*
 * Short looping animations for the Services page, one per service.
 * Drawn on a 1600 × 1000 canvas in a minimal palette: a light neutral ground with a
 * faint grid, black / off-white / sand objects, and orange only as a small accent. No text — only objects.
 * Each scene is a pure function of time t (0 → LOOP seconds) and starts and
 * ends on the same empty frame, so it loops cleanly.
 */

export const W = 1600;
export const H = 1000;
export const LOOP = 8;

const C = {
  bg: '#EEEBE6',
  accent: '#FA5C01',
  ink: '#000000',
  paper: '#FAFAFA',
  sand: '#D5D1C8',
  taupe: '#675845',
  grid: 'rgba(0,0,0,0.055)',
  soft: 'rgba(0,0,0,0.32)',
};

type G = CanvasRenderingContext2D;

// ---------- timing helpers ----------
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Progress 0 → 1 inside [a, b] */
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const eo = (x: number) => 1 - (1 - x) ** 3;
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const back = (x: number) => {
  const s = 1.5;
  return x <= 0 ? 0 : 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2;
};
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
/** In over [a, b], out over [c, d] → 0 … 1 … 0 */
const life = (t: number, a: number, b: number, c: number, d: number) => Math.min(eio(seg(t, a, b)), 1 - eio(seg(t, c, d)));

// ---------- drawing helpers ----------
function ground(g: G) {
  g.fillStyle = C.bg;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = C.grid;
  g.lineWidth = 1.5;
  g.beginPath();
  for (let x = 80; x < W; x += 80) {
    g.moveTo(x, 0);
    g.lineTo(x, H);
  }
  for (let y = 80; y < H; y += 80) {
    g.moveTo(0, y);
    g.lineTo(W, y);
  }
  g.stroke();
}

function box(g: G, x: number, y: number, w: number, h: number, fill: string | null, stroke?: string, lw = 4) {
  if (fill) {
    g.fillStyle = fill;
    g.fillRect(x, y, w, h);
  }
  if (stroke) {
    g.strokeStyle = stroke;
    g.lineWidth = lw;
    g.strokeRect(x, y, w, h);
  }
}

/** Draw g's content scaled by s around (cx, cy). */
function scaled(g: G, cx: number, cy: number, s: number, draw: () => void) {
  if (s <= 0.001) return;
  g.save();
  g.translate(cx, cy);
  g.scale(s, s);
  g.translate(-cx, -cy);
  draw();
  g.restore();
}

function line(g: G, x1: number, y1: number, x2: number, y2: number, k = 1) {
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(lerp(x1, x2, k), lerp(y1, y2, k));
  g.stroke();
}

/** A pointer arrow with its tip at (x, y). */
function pointer(g: G, x: number, y: number, s = 1) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, 46);
  g.lineTo(12, 35);
  g.lineTo(20, 54);
  g.lineTo(29, 50);
  g.lineTo(21, 32);
  g.lineTo(37, 32);
  g.closePath();
  g.fillStyle = C.ink;
  g.fill();
  g.strokeStyle = C.paper;
  g.lineWidth = 3;
  g.stroke();
  g.restore();
}

/** Expanding ring where a click lands. */
function tap(g: G, x: number, y: number, k: number) {
  if (k <= 0 || k >= 1) return;
  g.strokeStyle = `rgba(0,0,0,${1 - k})`;
  g.lineWidth = 4;
  g.beginPath();
  g.arc(x, y, 14 + k * 46, 0, Math.PI * 2);
  g.stroke();
}

/** Position along a sequence of waypoints [time, x, y], eased between each. */
function path(t: number, pts: Array<[number, number, number]>): [number, number] {
  if (t <= pts[0]![0]) return [pts[0]![1], pts[0]![2]];
  for (let i = 1; i < pts.length; i++) {
    const [t1, x1, y1] = pts[i]!;
    const [t0, x0, y0] = pts[i - 1]!;
    if (t <= t1) {
      const k = eio(seg(t, t0, t1));
      return [lerp(x0, x1, k), lerp(y0, y1, k)];
    }
  }
  const last = pts[pts.length - 1]!;
  return [last[1], last[2]];
}

// ---------- 01 UI / UX: three screens, a flow between them, a pointer working through it ----------
function uiux(g: G, t: number) {
  ground(g);
  const out = 1 - eio(seg(t, 6.9, 7.7));
  const sw = 270;
  const sh = 480;
  const xs = [330, 800, 1270];
  const y0 = 260;
  const taps = [2.5, 3.9, 5.3];

  // Flow arrows between the screens
  g.setLineDash([12, 12]);
  g.strokeStyle = C.ink;
  g.lineWidth = 4;
  for (let i = 0; i < 2; i++) {
    const k = eio(seg(t, 1.0 + i * 0.3, 1.7 + i * 0.3)) * out;
    const a = xs[i]! + sw / 2 + 24;
    const b = xs[i + 1]! - sw / 2 - 24;
    line(g, a, y0 + sh / 2, b, y0 + sh / 2, k);
    if (k > 0.98) {
      g.setLineDash([]);
      g.beginPath();
      g.moveTo(b, y0 + sh / 2);
      g.lineTo(b - 18, y0 + sh / 2 - 12);
      g.lineTo(b - 18, y0 + sh / 2 + 12);
      g.closePath();
      g.fillStyle = C.ink;
      g.fill();
      g.setLineDash([12, 12]);
    }
  }
  g.setLineDash([]);

  xs.forEach((cx, i) => {
    const s = back(seg(t, 0.15 + i * 0.18, 0.95 + i * 0.18)) * out;
    const done = t > taps[i]! + 0.15;
    scaled(g, cx, y0 + sh / 2, s, () => {
      const x = cx - sw / 2;
      box(g, x, y0, sw, sh, C.paper, C.ink);
      box(g, x + 26, y0 + 30, 120, 16, C.ink);
      box(g, x + 26, y0 + 74, sw - 52, 150, done ? C.ink : C.sand);
      box(g, x + 26, y0 + 248, sw - 52, 14, C.soft);
      box(g, x + 26, y0 + 276, sw - 110, 14, C.soft);
      // the button the pointer taps
      box(g, x + 26, y0 + sh - 86, sw - 52, 56, done ? C.accent : C.ink);
      if (done) {
        // a tick appears on the pressed button
        g.strokeStyle = C.paper;
        g.lineWidth = 6;
        g.beginPath();
        g.moveTo(cx - 16, y0 + sh - 58);
        g.lineTo(cx - 4, y0 + sh - 46);
        g.lineTo(cx + 18, y0 + sh - 70);
        g.stroke();
      }
    });
  });

  // Pointer works through the flow
  const vis = life(t, 1.6, 1.9, 6.4, 6.8);
  if (vis > 0) {
    const [px, py] = path(t, [
      [1.6, 1500, 900],
      [2.4, xs[0]! + 10, y0 + sh - 60],
      [3.0, xs[0]! + 10, y0 + sh - 60],
      [3.8, xs[1]! + 10, y0 + sh - 60],
      [4.4, xs[1]! + 10, y0 + sh - 60],
      [5.2, xs[2]! + 10, y0 + sh - 60],
      [6.6, 1500, 900],
    ]);
    taps.forEach((tt, i) => tap(g, xs[i]! + 10, y0 + sh - 60, seg(t, tt, tt + 0.5)));
    g.globalAlpha = vis;
    const press = taps.some((tt) => t > tt && t < tt + 0.15) ? 0.86 : 1;
    pointer(g, px, py, 1.5 * press);
    g.globalAlpha = 1;
  }
}

// ---------- 02 Branding: construction → a mark → palette → the mark applied ----------
function mark(g: G, cx: number, cy: number, s: number, ink = C.ink, paper = C.paper) {
  // An abstract mark: black square, an off-white circle cut into one corner, a small square in the other
  box(g, cx - s / 2, cy - s / 2, s, s, ink);
  g.fillStyle = paper;
  g.beginPath();
  g.arc(cx + s / 2, cy - s / 2, s * 0.42, Math.PI / 2, Math.PI);
  g.lineTo(cx + s / 2, cy - s / 2);
  g.closePath();
  g.fill();
  box(g, cx - s / 2 + s * 0.14, cy + s / 2 - s * 0.34, s * 0.2, s * 0.2, paper);
}

function branding(g: G, t: number) {
  ground(g);
  const out = 1 - eio(seg(t, 6.9, 7.7));
  const cx = 800;
  const cy = 430;

  // Construction guides
  const gk = eio(seg(t, 0.1, 1.0)) * (1 - eio(seg(t, 3.0, 3.6)));
  if (gk > 0) {
    g.setLineDash([10, 12]);
    g.strokeStyle = C.soft;
    g.lineWidth = 2.5;
    line(g, cx - 420, cy, cx + 420, cy, gk);
    line(g, cx, cy - 330, cx, cy + 330, gk);
    g.beginPath();
    g.arc(cx, cy, 250, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * gk);
    g.stroke();
    g.strokeRect(cx - 170, cy - 170, 340 * gk, 340 * gk);
    g.setLineDash([]);
  }

  // The mark builds, then moves up and shrinks to make room for the applications
  const build = back(seg(t, 0.8, 1.8));
  const lift = eio(seg(t, 3.4, 4.2));
  const mx = cx;
  const my = lerp(cy, 250, lift);
  const ms = lerp(300, 150, lift) * build * out;
  if (ms > 1) mark(g, mx, my, ms);

  // Palette swatches slide up under the mark
  const sw = [C.ink, C.paper, C.sand, C.taupe];
  sw.forEach((c, i) => {
    const k = back(seg(t, 2.0 + i * 0.15, 2.7 + i * 0.15)) * (1 - eio(seg(t, 3.3, 3.8)));
    if (k <= 0) return;
    box(g, cx - 250 + i * 130, lerp(H + 40, cy + 220, k), 110, 110, c, C.ink, 3);
  });

  // Applications: an icon, a card and a poster, each carrying the mark
  const apps = [
    { x: 370, y: 470, w: 240, h: 240, fill: C.ink, ink: C.paper, paper: C.ink, ms: 120 },
    { x: 680, y: 520, w: 380, h: 220, fill: C.paper, ink: C.ink, paper: C.paper, ms: 90 },
    { x: 1130, y: 420, w: 260, h: 380, fill: C.sand, ink: C.ink, paper: C.sand, ms: 120 },
  ];
  apps.forEach((a, i) => {
    const k = back(seg(t, 4.2 + i * 0.25, 5.0 + i * 0.25)) * out;
    if (k <= 0) return;
    scaled(g, a.x + a.w / 2, a.y + a.h / 2, k, () => {
      box(g, a.x, a.y, a.w, a.h, a.fill, C.ink, 4);
      mark(g, a.x + a.w / 2, a.y + a.h / 2 - (i === 2 ? 50 : 0), a.ms, a.ink, a.paper);
      if (i === 2) {
        box(g, a.x + 40, a.y + a.h - 90, a.w - 80, 14, C.ink);
        box(g, a.x + 40, a.y + a.h - 62, a.w - 140, 14, C.ink);
      }
    });
  });
}

// ---------- 03 Design systems: components appear as a library, then assemble a screen ----------
type Comp = 'button' | 'toggle' | 'check' | 'slider' | 'input' | 'avatar' | 'chip' | 'tabs' | 'card';
const COMPS: Comp[] = ['button', 'toggle', 'check', 'slider', 'input', 'avatar', 'chip', 'tabs', 'card'];

function component(g: G, kind: Comp, x: number, y: number, w: number, h: number) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  g.fillStyle = C.ink;
  g.strokeStyle = C.ink;
  g.lineWidth = 4;
  switch (kind) {
    case 'button':
      box(g, cx - 70, cy - 22, 140, 44, C.ink);
      break;
    case 'toggle':
      box(g, cx - 44, cy - 20, 88, 40, C.accent);
      box(g, cx + 4, cy - 16, 36, 32, C.paper);
      break;
    case 'check':
      box(g, cx - 22, cy - 22, 44, 44, C.ink);
      g.strokeStyle = C.paper;
      g.lineWidth = 6;
      g.beginPath();
      g.moveTo(cx - 12, cy);
      g.lineTo(cx - 3, cy + 10);
      g.lineTo(cx + 13, cy - 10);
      g.stroke();
      break;
    case 'slider':
      box(g, cx - 80, cy - 3, 160, 6, C.soft);
      box(g, cx - 80, cy - 3, 100, 6, C.ink);
      box(g, cx + 10, cy - 14, 28, 28, C.ink);
      break;
    case 'input':
      box(g, cx - 85, cy - 22, 170, 44, null, C.ink, 4);
      box(g, cx - 70, cy - 4, 70, 8, C.soft);
      break;
    case 'avatar':
      g.beginPath();
      g.arc(cx, cy, 30, 0, Math.PI * 2);
      g.fill();
      break;
    case 'chip':
      box(g, cx - 60, cy - 18, 56, 36, C.ink);
      box(g, cx + 6, cy - 18, 56, 36, null, C.ink, 4);
      break;
    case 'tabs':
      box(g, cx - 84, cy + 14, 168, 4, C.soft);
      box(g, cx - 84, cy + 12, 56, 8, C.ink);
      box(g, cx - 80, cy - 14, 44, 10, C.ink);
      box(g, cx - 20, cy - 14, 44, 10, C.soft);
      box(g, cx + 40, cy - 14, 44, 10, C.soft);
      break;
    case 'card':
      box(g, cx - 70, cy - 40, 140, 50, C.sand);
      box(g, cx - 70, cy + 20, 100, 10, C.ink);
      break;
  }
}

function designSystems(g: G, t: number) {
  ground(g);
  const out = 1 - eio(seg(t, 6.9, 7.7));
  const tw = 260;
  const th = 170;
  const gx = 800 - (tw * 3 + 40 * 2) / 2;
  const gy = 150;
  // Where each component ends up in the assembled screen
  const sx = 520;
  const sy = 170;
  const screenTargets: Array<[number, number, number, number]> = [
    [sx + 300, sy + 560, tw, 90], // button
    [sx + 330, sy + 40, tw, 90], // toggle
    [sx + 20, sy + 470, tw, 90], // check
    [sx + 20, sy + 380, tw, 90], // slider
    [sx + 20, sy + 290, tw, 90], // input
    [sx + 20, sy + 40, 120, 90], // avatar
    [sx + 300, sy + 470, tw, 90], // chip
    [sx + 20, sy + 140, tw * 2, 70], // tabs
    [sx + 300, sy + 300, tw, 160], // card
  ];
  const assemble = eio(seg(t, 3.0, 4.2)) * (1 - eio(seg(t, 6.2, 6.9)));

  // The screen frame appears as the pieces arrive
  const frame = life(t, 3.2, 3.9, 6.1, 6.7);
  if (frame > 0) {
    g.globalAlpha = frame;
    box(g, sx, sy, 560, 680, C.paper, C.ink, 4);
    g.globalAlpha = 1;
  }

  COMPS.forEach((kind, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const pop = back(seg(t, 0.2 + i * 0.16, 0.9 + i * 0.16)) * out;
    if (pop <= 0) return;
    const [tx, ty, tw2, th2] = screenTargets[i]!;
    const x = lerp(gx + col * (tw + 40), tx, assemble);
    const y = lerp(gy + row * (th + 40), ty, assemble);
    const w = lerp(tw, tw2, assemble);
    const h = lerp(th, th2, assemble);
    scaled(g, x + w / 2, y + h / 2, pop, () => {
      // Library tiles have their own card; once assembled they sit straight on the screen
      if (assemble < 0.6) {
        g.globalAlpha = 1 - assemble / 0.6;
        box(g, x, y, w, h, C.paper, C.ink, 3);
        g.globalAlpha = 1;
      }
      component(g, kind, x, y, w, h);
    });
  });

  // Tokens: a spacing scale beside the screen
  const tok = life(t, 4.2, 4.8, 6.0, 6.5);
  if (tok > 0) {
    [16, 28, 44, 64, 92].forEach((s, i) => {
      const k = eo(seg(t, 4.2 + i * 0.08, 4.7 + i * 0.08)) * tok;
      box(g, 1140, 230 + i * 110, s * 2 * k, 56, i % 2 ? C.ink : C.sand);
    });
  }
}

// ---------- 04 Motion: an easing curve, an object riding it, a timeline with keyframes ----------
function motionDesign(g: G, t: number) {
  ground(g);
  const vis = life(t, 0.1, 0.8, 6.9, 7.6);
  if (vis <= 0) return;
  g.globalAlpha = vis;

  // Easing graph
  const gx = 160;
  const gy = 160;
  const gs = 460;
  box(g, gx, gy, gs, gs, C.paper, C.ink, 4);
  const P0: [number, number] = [gx + 40, gy + gs - 40];
  const P3: [number, number] = [gx + gs - 40, gy + 40];
  const P1: [number, number] = [gx + gs * 0.62, gy + gs - 40];
  const P2: [number, number] = [gx + gs * 0.38, gy + 40];
  const curve = eio(seg(t, 0.4, 1.4));
  const bez = (u: number): [number, number] => {
    const m = 1 - u;
    return [
      m * m * m * P0[0] + 3 * m * m * u * P1[0] + 3 * m * u * u * P2[0] + u * u * u * P3[0],
      m * m * m * P0[1] + 3 * m * m * u * P1[1] + 3 * m * u * u * P2[1] + u * u * u * P3[1],
    ];
  };
  g.strokeStyle = C.soft;
  g.lineWidth = 3;
  line(g, P0[0], P0[1], P1[0], P1[1], curve);
  line(g, P3[0], P3[1], P2[0], P2[1], curve);
  g.strokeStyle = C.ink;
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(P0[0], P0[1]);
  for (let i = 1; i <= 60 * curve; i++) {
    const [x, y] = bez(i / 60);
    g.lineTo(x, y);
  }
  g.stroke();
  [P1, P2].forEach(([x, y]) => curve > 0.9 && box(g, x - 12, y - 12, 24, 24, C.accent, C.ink, 4));

  // The ride: 0 → 1 → 0 with the same easing, twice
  const cycle = 2.5;
  const local = t < 1.6 ? 0 : ((t - 1.6) % cycle) / cycle;
  const forward = local < 0.5;
  const u = forward ? local * 2 : (1 - local) * 2;
  const running = t >= 1.6 && t < 6.6;

  // A point travels along the curve in the graph
  if (running) {
    const [bx, by] = bez(u);
    box(g, bx - 14, by - 14, 28, 28, C.ink);
  }

  // The object, with onion-skin ghosts behind it
  const trackX0 = 760;
  const trackX1 = 1440;
  const trackY = 330;
  g.strokeStyle = C.soft;
  g.lineWidth = 3;
  g.setLineDash([10, 12]);
  line(g, trackX0, trackY + 70, trackX1 + 140, trackY + 70);
  g.setLineDash([]);
  for (let k = 4; k >= 0; k--) {
    const ug = clamp(u - (forward ? 1 : -1) * k * 0.06);
    const xg = lerp(trackX0, trackX1, running ? eio(ug) : 0);
    g.globalAlpha = vis * (k === 0 ? 1 : 0.18 * (5 - k) * 0.5);
    box(g, xg, trackY - 70, 140, 140, k === 0 ? C.ink : C.sand);
  }
  g.globalAlpha = vis;

  // Timeline with keyframes and a playhead
  const tlx = 160;
  const tly = 760;
  const tlw = 1280;
  box(g, tlx, tly, tlw, 6, C.ink);
  [0, 0.5, 1].forEach((k) => {
    const kx = tlx + tlw * k;
    g.save();
    g.translate(kx, tly + 3);
    g.rotate(Math.PI / 4);
    box(g, -14, -14, 28, 28, C.paper, C.ink, 4);
    g.restore();
  });
  const ph = running ? local : 0;
  box(g, tlx + tlw * ph - 3, tly - 50, 6, 106, C.accent);
  g.globalAlpha = 1;
}

// ---------- 05 No-code: blocks dragged from a panel into a page ----------
function noCode(g: G, t: number) {
  ground(g);
  const out = 1 - eio(seg(t, 6.9, 7.7));
  const vis = eio(seg(t, 0.1, 0.8)) * out;
  if (vis <= 0) return;
  g.globalAlpha = vis;

  // Panel of blocks
  const px = 140;
  const py = 150;
  box(g, px, py, 300, 700, C.paper, C.ink, 4);
  const thumbs: Array<[number, number]> = [
    [px + 40, py + 50],
    [px + 40, py + 210],
    [px + 40, py + 370],
    [px + 40, py + 530],
  ];
  // Page canvas
  const cx0 = 560;
  const cy0 = 150;
  const cw = 900;
  box(g, cx0, cy0, cw, 700, null, C.ink, 4);
  g.setLineDash([12, 12]);
  g.strokeStyle = C.soft;
  g.lineWidth = 3;
  g.strokeRect(cx0 + 24, cy0 + 24, cw - 48, 652);
  g.setLineDash([]);

  // Where each block lands
  const slots: Array<[number, number, number, number]> = [
    [cx0 + 40, cy0 + 40, cw - 80, 70], // nav
    [cx0 + 40, cy0 + 130, cw - 80, 250], // hero
    [cx0 + 40, cy0 + 400, cw - 80, 170], // cards
    [cx0 + 40, cy0 + 590, cw - 80, 70], // footer
  ];
  const drawBlock = (i: number, x: number, y: number, w: number, h: number) => {
    if (i === 0) {
      box(g, x, y, w, h, C.paper);
      box(g, x + 20, y + h / 2 - 8, w * 0.18, 16, C.ink);
      box(g, x + w - w * 0.3, y + h / 2 - 5, w * 0.26, 10, C.soft);
    } else if (i === 1) {
      box(g, x, y, w, h, C.ink);
      box(g, x + w * 0.06, y + h * 0.3, w * 0.45, h * 0.12, C.paper);
      box(g, x + w * 0.06, y + h * 0.52, w * 0.3, h * 0.08, C.sand);
      box(g, x + w * 0.62, y + h * 0.15, w * 0.32, h * 0.7, C.sand);
    } else if (i === 2) {
      for (let k = 0; k < 3; k++) box(g, x + k * (w / 3) + 6, y, w / 3 - 12, h, C.paper, C.ink, 3);
    } else {
      box(g, x, y, w, h, C.sand);
      box(g, x + 20, y + h / 2 - 5, w * 0.2, 10, C.ink);
    }
  };

  const starts = [1.0, 2.2, 3.4, 4.6];
  thumbs.forEach(([tx, ty], i) => drawBlock(i, tx, ty, 220, 120));

  let pointerAt: [number, number] = [1500, 950];
  starts.forEach((s, i) => {
    const pick = s + 0.35;
    const drop = s + 1.0;
    const [tx, ty] = thumbs[i]!;
    const [sx, sy, sw, sh] = slots[i]!;
    if (t < pick) {
      if (t > s - 0.6) pointerAt = path(t, [[s - 0.6, pointerAt[0], pointerAt[1]], [pick, tx + 110, ty + 60]]);
      return;
    }
    const k = eio(seg(t, pick, drop));
    const x = lerp(tx, sx, k);
    const y = lerp(ty, sy, k);
    const w = lerp(220, sw, k);
    const h = lerp(120, sh, k);
    if (t < drop) {
      // dragging: a lifted copy with a shadow, guide lines showing the slot
      g.globalAlpha = vis * 0.35;
      box(g, x + 14, y + 16, w, h, C.ink);
      g.globalAlpha = vis;
      g.setLineDash([8, 8]);
      g.strokeStyle = C.ink;
      g.lineWidth = 3;
      g.strokeRect(sx, sy, sw, sh);
      g.setLineDash([]);
      pointerAt = [x + w / 2, y + h / 2];
    } else if (i === starts.length - 1 || t < starts[i + 1]! - 0.6) {
      pointerAt = [sx + sw / 2, sy + sh / 2];
    }
    drawBlock(i, x, y, w, h);
  });
  if (t > 5.6) pointerAt = path(t, [[5.6, pointerAt[0], pointerAt[1]], [6.4, 1500, 950]]);
  pointer(g, pointerAt[0], pointerAt[1], 1.5);
  g.globalAlpha = 1;
}

// ---------- 06 Websites: a page that scrolls, then resizes from desktop to tablet to phone ----------
function websites(g: G, t: number) {
  ground(g);
  const out = 1 - eio(seg(t, 7.0, 7.7));
  const vis = back(seg(t, 0.1, 0.9)) * out;
  if (vis <= 0) return;

  // Frame size: desktop → tablet → phone → desktop
  const sizes: Array<[number, number]> = [
    [1180, 760],
    [640, 820],
    [360, 760],
  ];
  const k1 = eio(seg(t, 2.8, 3.5));
  const k2 = eio(seg(t, 4.2, 4.9));
  const k3 = eio(seg(t, 5.8, 6.5));
  let fw = lerp(sizes[0]![0], sizes[1]![0], k1);
  let fh = lerp(sizes[0]![1], sizes[1]![1], k1);
  fw = lerp(fw, sizes[2]![0], k2);
  fh = lerp(fh, sizes[2]![1], k2);
  fw = lerp(fw, sizes[0]![0], k3);
  fh = lerp(fh, sizes[0]![1], k3);

  scaled(g, 800, 500, vis, () => {
    const fx = 800 - fw / 2;
    const fy = 500 - fh / 2;
    box(g, fx, fy, fw, fh, C.paper, C.ink, 4);
    box(g, fx, fy, fw, 44, C.ink);
    for (let i = 0; i < 3; i++) box(g, fx + 18 + i * 22, fy + 16, 12, 12, i === 0 ? C.accent : C.paper);

    // Content, clipped to the window, scrolling a little
    g.save();
    g.beginPath();
    g.rect(fx + 2, fy + 46, fw - 4, fh - 48);
    g.clip();
    const scroll = eio(seg(t, 1.0, 2.4)) * 220 * (1 - eio(seg(t, 2.6, 3.2)));
    const pad = Math.max(20, fw * 0.05);
    let y = fy + 70 - scroll;
    const iw = fw - pad * 2;
    // nav
    box(g, fx + pad, y, Math.min(140, iw * 0.3), 18, C.ink);
    y += 50;
    // hero
    const heroH = fw > 700 ? 280 : 220;
    box(g, fx + pad, y, iw, heroH, C.ink);
    box(g, fx + pad + 30, y + heroH * 0.35, iw * 0.5, 24, C.paper);
    box(g, fx + pad + 30, y + heroH * 0.35 + 40, iw * 0.3, 16, C.sand);
    box(g, fx + pad + 30, y + heroH - 70, 120, 40, C.accent);
    y += heroH + 30;
    // cards reflow: 3 → 2 → 1 columns
    const cols = fw > 820 ? 3 : fw > 480 ? 2 : 1;
    const gap = 20;
    const cw = (iw - gap * (cols - 1)) / cols;
    for (let i = 0; i < 6; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const x = fx + pad + c * (cw + gap);
      const yy = y + r * 210;
      box(g, x, yy, cw, 140, C.sand);
      box(g, x, yy + 156, cw * 0.7, 14, C.ink);
    }
    g.restore();
  });
}


// ---------- Graphic design: a logo on an artboard, a presentation deck, a package that folds up ----------
function graphicDesign(g: G, t: number) {
  ground(g);
  const out = 1 - eio(seg(t, 6.9, 7.7));

  // Logo artboard with corner handles
  const lk = back(seg(t, 0.2, 1.0)) * out;
  scaled(g, 330, 470, lk, () => {
    box(g, 190, 330, 280, 280, C.paper, C.ink, 4);
    for (const [x, y] of [[190, 330], [470, 330], [190, 610], [470, 610]] as const) box(g, x - 9, y - 9, 18, 18, C.paper, C.ink, 3);
    const mk = back(seg(t, 0.7, 1.4));
    if (mk > 0) mark(g, 330, 470, 150 * mk);
  });

  // Presentation deck: three 16:9 slides fan out
  const slides = [
    { dx: 0, dy: 0, r: 0 },
    { dx: 40, dy: 34, r: 0.05 },
    { dx: 80, dy: 68, r: 0.1 },
  ];
  for (let i = slides.length - 1; i >= 0; i--) {
    const k = eio(seg(t, 1.5 + i * 0.25, 2.3 + i * 0.25)) * out;
    if (k <= 0) continue;
    const sl = slides[i]!;
    const w = 380;
    const h = 214;
    const cx = 760 + sl.dx * k;
    const cy = 330 + sl.dy * k;
    g.save();
    g.translate(cx, cy);
    g.rotate(sl.r * k);
    g.globalAlpha = Math.min(1, k * 1.5);
    box(g, -w / 2, -h / 2, w, h, C.paper, C.ink, 4);
    if (i === 0) {
      // the front slide: a headline bar, a chart and an accent
      box(g, -w / 2 + 26, -h / 2 + 28, 160, 18, C.ink);
      box(g, -w / 2 + 26, -h / 2 + 58, 110, 12, C.soft);
      [60, 96, 72, 120].forEach((bh, j) => {
        const gk = eo(seg(t, 2.5 + j * 0.1, 3.0 + j * 0.1));
        box(g, 30 + j * 34, h / 2 - 28 - bh * gk, 22, bh * gk, j === 3 ? C.accent : C.ink);
      });
    } else {
      box(g, -w / 2 + 26, -h / 2 + 28, 120, 14, C.ink);
      box(g, -w / 2 + 26, -h / 2 + 60, w - 52, h - 90, C.sand);
    }
    g.restore();
  }
  g.globalAlpha = 1;

  // Packaging: a box rises and folds closed, the mark on its front
  const rise = eio(seg(t, 3.6, 4.6)) * out;
  if (rise > 0) {
    const cx = 1240;
    const base = 760;
    const hgt = 220 * rise;
    const top: Array<[number, number]> = [
      [cx, base - hgt - 170],
      [cx + 180, base - hgt - 85],
      [cx, base - hgt],
      [cx - 180, base - hgt - 85],
    ];
    const poly = (pts: Array<[number, number]>, fill: string) => {
      g.beginPath();
      g.moveTo(pts[0]![0], pts[0]![1]);
      pts.slice(1).forEach(([x, y]) => g.lineTo(x, y));
      g.closePath();
      g.fillStyle = fill;
      g.fill();
      g.strokeStyle = C.ink;
      g.lineWidth = 4;
      g.stroke();
    };
    // left face
    poly([top[3]!, top[2]!, [cx, base], [cx - 180, base - 85]], C.paper);
    // right face
    poly([top[2]!, top[1]!, [cx + 180, base - 85], [cx, base]], C.sand);
    // the mark on the left face, skewed onto it
    const mk = eo(seg(t, 4.5, 5.0));
    if (mk > 0 && hgt > 60) {
      // centre of the left face, then skew so the mark lies flat on it
      g.save();
      g.translate(cx - 90, base - hgt / 2 - 42.5);
      g.transform(1, 85 / 180, 0, 1, 0, 0);
      g.globalAlpha = mk;
      mark(g, 0, 0, Math.min(90, hgt * 0.5) * mk);
      g.restore();
      g.globalAlpha = 1;
    }
    // lid flaps close
    const lid = eio(seg(t, 4.6, 5.3));
    if (lid > 0) {
      g.globalAlpha = lid;
      poly(top, C.paper);
      g.strokeStyle = C.soft;
      g.lineWidth = 3;
      line(g, top[3]![0] + 90, top[3]![1] + 42, top[1]![0] - 90, top[1]![1] - 42, lid);
      g.globalAlpha = 1;
    }
  }
}


// ---------- Digital experiences: one experience, synced across laptop, tablet and phone ----------
function digitalExperience(g: G, t: number) {
  ground(g);
  const out = 1 - eio(seg(t, 6.9, 7.7));
  // [centre x, centre y, screen w, screen h]
  const devices: Array<[number, number, number, number]> = [
    [520, 420, 540, 340],
    [1030, 450, 260, 350],
    [1340, 480, 150, 290],
  ];
  const centres = devices.map(([x, y]) => [x, y] as const);

  // Links between the devices (drawn first, so they run behind the screens)
  g.setLineDash([12, 12]);
  g.strokeStyle = C.soft;
  g.lineWidth = 3;
  for (let i = 0; i < 2; i++) {
    const k = eio(seg(t, 1.1 + i * 0.25, 1.9 + i * 0.25)) * out;
    const [x1, y1] = centres[i]!;
    const [x2, y2] = centres[i + 1]!;
    line(g, x1, y1, x2, y2, k);
  }
  g.setLineDash([]);

  const arrive = [2.3, 3.5, 4.6];
  devices.forEach(([cx, cy, w, h], i) => {
    const k = back(seg(t, 0.2 + i * 0.18, 1.0 + i * 0.18)) * out;
    scaled(g, cx, cy, k, () => {
      const x = cx - w / 2;
      const y = cy - h / 2;
      if (i === 0) {
        // laptop: screen + base
        box(g, x - 14, y - 14, w + 28, h + 28, C.ink);
        box(g, x, y, w, h, C.paper);
        g.beginPath();
        g.moveTo(x - 60, y + h + 14);
        g.lineTo(x + w + 60, y + h + 14);
        g.lineTo(x + w + 30, y + h + 44);
        g.lineTo(x - 30, y + h + 44);
        g.closePath();
        g.fillStyle = C.ink;
        g.fill();
      } else {
        box(g, x - 12, y - 22, w + 24, h + 44, C.ink);
        box(g, x, y, w, h, C.paper);
      }
      // the same content arrives on each screen in turn
      const c = back(seg(t, arrive[i]!, arrive[i]! + 0.6));
      if (c > 0) {
        const pad = w * 0.1;
        scaled(g, cx, cy, c, () => {
          box(g, x + pad, y + pad, w - pad * 2, h * 0.36, C.ink);
          box(g, x + pad, y + pad + h * 0.44, (w - pad * 2) * 0.7, Math.max(10, h * 0.05), C.soft);
          box(g, x + pad, y + pad + h * 0.54, (w - pad * 2) * 0.45, Math.max(10, h * 0.05), C.soft);
          box(g, x + pad, y + h - pad - h * 0.14, (w - pad * 2) * 0.5, h * 0.12, C.accent);
        });
      }
      // a short pulse once everything is in sync
      const p = seg(t, 5.2, 6.0);
      if (p > 0 && p < 1) {
        g.strokeStyle = `rgba(0,0,0,${1 - p})`;
        g.lineWidth = 4;
        const grow = 16 + p * 40;
        g.strokeRect(x - grow, y - grow, w + grow * 2, h + grow * 2);
      }
    });
  });

  // A signal travels along the links, carrying the content
  for (let i = 0; i < 2; i++) {
    const k = seg(t, arrive[i]! + 0.5, arrive[i + 1]!);
    if (k <= 0 || k >= 1) continue;
    const [x1, y1] = centres[i]!;
    const [x2, y2] = centres[i + 1]!;
    const e = eio(k);
    box(g, lerp(x1, x2, e) - 14, lerp(y1, y2, e) - 14, 28, 28, C.accent, C.ink, 3);
  }
}

/** Play two scenes back to back (each starts and ends empty, so the join is clean). */
const pair =
  (a: (g: G, t: number) => void, b: (g: G, t: number) => void) =>
  (g: G, t: number) =>
    t < LOOP ? a(g, t) : b(g, t - LOOP);

export const SCENES = {
  'branding-design-systems': pair(branding, designSystems),
  'ui-ux-web-design': pair(uiux, websites),
  'web-development': noCode,
  'motion-graphic-design': pair(graphicDesign, motionDesign),
  'digital-experiences': digitalExperience,
} as const;

/** Loop length per scene: combined services play both of their scenes. */
export const SCENE_LOOPS: Record<keyof typeof SCENES, number> = {
  'branding-design-systems': LOOP * 2,
  'ui-ux-web-design': LOOP * 2,
  'web-development': LOOP,
  'motion-graphic-design': LOOP * 2,
  'digital-experiences': LOOP,
};

export type SceneName = keyof typeof SCENES;
