import { useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';
import { H, LOOP, SCENES, W, type SceneName } from './scenes';

/**
 * A service's looping brand-colour animation, drawn live on a canvas.
 * It only runs while on screen; otherwise it rests on a still frame.
 */
export function ServiceMotion({ scene, label, className }: { scene: SceneName; label: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const inView = useInView(ref, { margin: '100px 0px' });

  useEffect(() => {
    const canvas = ref.current;
    const g = canvas?.getContext('2d');
    if (!canvas || !g) return;
    const draw = SCENES[scene];
    // A representative still while off screen
    if (!inView) {
      draw(g, LOOP * 0.6);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = () => {
      draw(g, ((performance.now() - start) / 1000) % LOOP);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [scene, inView]);

  return <canvas ref={ref} width={W} height={H} role="img" aria-label={`${label} — animation`} className={cn('block h-auto w-full', className)} />;
}
