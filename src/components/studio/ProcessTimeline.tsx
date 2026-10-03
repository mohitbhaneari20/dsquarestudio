import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState, type KeyboardEvent } from 'react';
import { processSteps } from '../../data/services';
import { cn } from '../../lib/cn';
import { pad } from '../../lib/format';
import { Reveal } from '../ui/Reveal';

/**
 * Desktop: tabbed timeline with a progress line that fills to the active step.
 * Mobile: a simple stacked list — every step visible, nothing hidden behind taps.
 */
export function ProcessTimeline() {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const step = processSteps[active];

  const onKeyDown = (e: KeyboardEvent) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const nextIndex = (active + delta + processSteps.length) % processSteps.length;
    setActive(nextIndex);
    tabs.current[nextIndex]?.focus();
  };

  return (
    <>
      {/* Mobile */}
      <ol className="md:hidden">
        {processSteps.map((s, i) => (
          <Reveal as="li" key={s.title} className="grid grid-cols-[3rem_1fr] border-t border-border py-6">
            <span className="text-meta pt-2 text-accent">{pad(i + 1)}</span>
            <div>
              <h3 className="text-h3">{s.title}</h3>
              <p className="mt-2 text-muted">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      {/* Tablet / desktop */}
      <div className="hidden md:block">
        <div role="tablist" aria-label="How we work" className="relative grid grid-cols-5" onKeyDown={onKeyDown}>
          <span className="absolute inset-x-0 top-0 h-px bg-border" aria-hidden="true" />
          <motion.span
            className="absolute left-0 top-0 h-[2px] bg-accent"
            animate={{ width: `${((active + 1) / processSteps.length) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />
          {processSteps.map((s, i) => (
            <button
              key={s.title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`process-tab-${i}`}
              aria-selected={i === active}
              aria-controls="process-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                'flex flex-col items-start gap-3 pt-6 text-left transition-colors duration-300',
                i <= active ? 'text-foreground' : 'text-muted hover:text-foreground',
              )}
            >
              <span className="text-meta">{pad(i + 1)}</span>
              <span className="text-h3">{s.title}</span>
            </button>
          ))}
        </div>

        <div id="process-panel" role="tabpanel" aria-labelledby={`process-tab-${active}`} className="mt-16 min-h-[14rem] border-t border-border pt-8">
          <AnimatePresence mode="wait" initial={false}>
            {step && (
              <motion.div
                key={step.title}
                className="grid-site"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="col-span-3 text-[clamp(4rem,9vw,9rem)] font-medium leading-[0.8] tracking-[-0.06em] text-accent">
                  {pad(active + 1)}
                </span>
                <p className="text-h3 col-span-8 col-start-5 max-w-2xl">{step.body}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
