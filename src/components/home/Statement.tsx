import { motion } from 'framer-motion';
import { Reveal } from '../ui/Reveal';
import { SquareBullet } from '../ui/SquareBullet';
import { useReduceMotion } from '../../lib/motionPreference';

const words = ['Design', 'Develop', 'Deploy'];

const disciplines = [
  {
    title: 'Design',
    headline: 'Work out what it should be.',
    body: 'Brand, interface and experience — shaped around what people need to understand and do.',
  },
  {
    title: 'Develop',
    headline: 'Make it real, not just pretty.',
    body: 'Responsive, accessible builds in code or no-code, made from the same decisions as the design.',
  },
  {
    title: 'Deploy',
    headline: 'Ship it, then keep improving.',
    body: 'Launch is a checkpoint. We test, adjust and keep the work moving after it goes live.',
  },
];

/** Hand-drawn style loop around a word; draws itself in when scrolled into view. */
function Scribble({ children }: { children: string }) {
  const reduce = useReduceMotion();
  return (
    <span className="relative inline-block px-[0.15em]">
      {children}
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="absolute -inset-x-[12%] -inset-y-[22%] h-[144%] w-[124%]" aria-hidden="true">
        <motion.path
          d="M18 44 C 20 14, 120 4, 176 22 C 204 32, 190 66, 120 72 C 60 77, 8 66, 14 40 C 18 26, 60 16, 104 14"
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.4}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
        />
      </svg>
    </span>
  );
}

/** Black band: three condensed Ds, a short line, then what each D means. */
export function Statement() {
  return (
    <section className="theme-inverse section-space relative z-10">
      <div className="container-site">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-condensed text-[clamp(4.5rem,15vw,13rem)]" aria-label="Design, develop, deploy">
            {words.map((w, i) => (
              <Reveal key={w} delay={i * 0.08}>
                <span className="block">{w}</span>
              </Reveal>
            ))}
          </h2>
          <Reveal delay={0.3}>
            <p className="mt-10 text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-tight tracking-[-0.03em]">
              Three Ds. <Scribble>One</Scribble> studio.
            </p>
          </Reveal>
        </div>

        <div className="grid-site mt-24 gap-y-12 md:mt-36">
          {disciplines.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.08} className="col-span-12 border-t border-border pt-5 md:col-span-4">
              <p className="text-meta flex items-center gap-2 text-muted">
                <SquareBullet /> {d.title}
              </p>
              <h3 className="text-h3 mt-8">{d.headline}</h3>
              <p className="mt-4 max-w-sm text-muted">{d.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
