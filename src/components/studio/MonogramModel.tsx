import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { MARK_PATHS, MARK_VIEWBOX } from '../brand/paths';
import { useReduceMotion } from '../../lib/motionPreference';

/** Soft fill so the stone never drops to black, plus a gentle key so its texture reads */
const LIGHT = { env: 0.55, ambient: 0.9, key: 1.1 };
/** Block depth as a share of its width */
const THICKNESS = 0.26;

/**
 * The monogram as a solid block, extruded straight from the logo vector: a perfectly
 * flat, smooth face (no engraved outline), the exact logo shape and softly rounded edges.
 * Returned centred and about 2 units wide.
 */
function monogramBlock() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"><path d="${MARK_PATHS[0]}"/></svg>`;
  const shapes = new SVGLoader().parse(svg).paths.flatMap((p) => SVGLoader.createShapes(p));
  const width = 157;
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: width * THICKNESS - 8,
    bevelEnabled: true,
    bevelThickness: 4,
    bevelSize: 2.6,
    bevelSegments: 8,
    curveSegments: 28,
  });
  geo.center();
  geo.scale(2 / width, -2 / width, 2 / width); // SVG's y axis points down
  return geo;
}

/** Tileable value noise on a grid, smoothly interpolated — the base of the concrete surface. */
function noiseLayer(size: number, cells: number, rand: () => number) {
  // Wrapping the grid (x % cells) makes the texture repeat without a visible seam
  const grid = Array.from({ length: cells * cells }, rand);
  const at = (x: number, y: number) => grid[(y % cells) * cells + (x % cells)]!;
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = (x / size) * cells;
      const gy = (y / size) * cells;
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      const fx = gx - x0;
      const fy = gy - y0;
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);
      const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
      const bot = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
      out[y * size + x] = top + (bot - top) * sy;
    }
  }
  return out;
}

/**
 * Raw poured-concrete texture, drawn in code: mottled grey, fine grain, small air
 * pores and faint vertical formwork lines. Used for colour and (as height) for bump.
 */
function concreteTexture() {
  const size = 512;
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const big = noiseLayer(size, 6, rand);
  const mid = noiseLayer(size, 24, rand);
  const fine = noiseLayer(size, 96, rand);

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 138 + (big[i]! - 0.5) * 52 + (mid[i]! - 0.5) * 26 + (fine[i]! - 0.5) * 22 + (rand() - 0.5) * 14;
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v - 1;
    img.data[i * 4 + 2] = v - 4;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  // Faint formwork board lines
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#4a4a46';
  for (let x = 40 + rand() * 30; x < size; x += 70 + rand() * 60) {
    ctx.lineWidth = 1 + rand() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (rand() - 0.5) * 6, size);
    ctx.stroke();
  }
  // Air pores
  ctx.globalAlpha = 1;
  for (let i = 0; i < 900; i++) {
    const r = 0.6 + rand() ** 3 * 3.2;
    ctx.fillStyle = `rgba(40,40,38,${0.45 + rand() * 0.45})`;
    const px = rand() * size;
    const py = rand() * size;
    // draw wrapped copies near the edges so pores continue across the tile seam
    for (const dx of [0, -size, size]) for (const dy of [0, -size, size]) {
      ctx.beginPath();
      ctx.arc(px + dx, py + dy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Give the mesh UVs by projecting each triangle onto the plane it mostly faces
 * (box mapping), so the concrete texture wraps the faces, sides and cut-outs
 * without stretching. Faces stay flat-shaded for crisp, cast-concrete edges.
 */
function boxMapped(geometry: THREE.BufferGeometry, scale = 1.1) {
  const geo = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  // Flipping y above reverses the winding; put the faces back the right way round
  const p = geo.getAttribute('position');
  for (let i = 0; i < p.count; i += 3) {
    const x = p.getX(i + 1), y = p.getY(i + 1), z = p.getZ(i + 1);
    p.setXYZ(i + 1, p.getX(i + 2), p.getY(i + 2), p.getZ(i + 2));
    p.setXYZ(i + 2, x, y, z);
  }
  // Keep the extrusion's own smooth normals so the rounded edges stay smooth
  geo.deleteAttribute('uv');
  geo.computeVertexNormals();
  const pos = geo.getAttribute('position');
  const nrm = geo.getAttribute('normal');
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i += 3) {
    const nx = Math.abs(nrm.getX(i));
    const ny = Math.abs(nrm.getY(i));
    const nz = Math.abs(nrm.getZ(i));
    for (let k = 0; k < 3; k++) {
      const j = i + k;
      const [u, v] =
        nz >= nx && nz >= ny ? [pos.getX(j), pos.getY(j)] : nx >= ny ? [pos.getZ(j), pos.getY(j)] : [pos.getX(j), pos.getZ(j)];
      uv[j * 2] = u * scale;
      uv[j * 2 + 1] = v * scale;
    }
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

/**
 * The D² monogram as a solid block in raw cast concrete, built from the logo vector:
 * grey, porous, with faint formwork lines, softly lit on a transparent background. It sways slowly,
 * tilts toward the cursor, and only renders while on screen. With reduced motion it holds a still view.
 */
export default function MonogramModel({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Transparent canvas: nothing but the badge is drawn, so no dark area can show around it
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = LIGHT.env;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    // A strong even fill (so nothing goes black) and a soft key from the top-left so the stone's texture reads
    scene.add(new THREE.AmbientLight('#ffffff', LIGHT.ambient));
    const key = new THREE.DirectionalLight('#fffaf2', LIGHT.key);
    key.position.set(-3, 4, 4);
    scene.add(key);

    const group = new THREE.Group();
    group.rotation.set(-0.08, -0.32, 0.08);
    scene.add(group);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    {
      // Concrete: colour and bump from the same generated texture, fully matte
      const tex = concreteTexture();
      const stone = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: tex,
        bumpMap: tex,
        bumpScale: 2.2,
        roughness: 0.95,
        metalness: 0,
      });
      const block = new THREE.Mesh(boxMapped(monogramBlock()), stone);
      block.scale.setScalar(0.92); // leaves room for the thick block as it turns
      group.add(block);
      setReady(true);
    }

    // Lean toward the cursor
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
    };
    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true });


    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
    });
    io.observe(host);

    let frame = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!reduce) {
        const sway = Math.sin(t * 0.45) * 0.18;
        group.rotation.y += (-0.32 + sway + target.x * 0.28 - group.rotation.y) * 0.06;
        group.rotation.x += (-0.08 + target.y * 0.2 - group.rotation.x) * 0.06;
        group.position.y = Math.sin(t * 0.9) * 0.03;
      }
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      io.disconnect();
      group.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => m.dispose());
        }
      });
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduce]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        opacity: ready ? 1 : 0,
        transition: 'opacity 600ms ease',
      }}
      role="img"
      aria-label="The Dsquare D² monogram in raw concrete stone"
    />
  );
}
