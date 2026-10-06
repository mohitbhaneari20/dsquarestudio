import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useId, useState } from 'react';
import { faqs } from '../../data/faq';
import { cn } from '../../lib/cn';
import { Reveal } from '../ui/Reveal';
import { SquareBullet } from '../ui/SquareBullet';
import { TextReveal } from '../ui/TextReveal';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <section className="container-site section-space pt-0!">
      <div className="grid-site gap-y-12">
        <div className="col-span-12 lg:col-span-5">
          <p className="text-meta flex items-center gap-2 text-muted">
            <SquareBullet /> FAQ
          </p>
          <TextReveal as="h2" lines={['Good questions', 'to ask first.']} className="text-h2 mt-8" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-muted">The things people usually want to know before starting something with us.</p>
          </Reveal>
        </div>

        <ul className="col-span-12 border-b border-border lg:col-span-7">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.question} className="border-t border-border">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left text-xl font-medium tracking-[-0.02em] md:text-2xl"
                  >
                    <span className="transition-colors group-hover:text-accent">{f.question}</span>
                    <Plus
                      size={22}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className={cn('mt-1 shrink-0 transition-transform duration-300', isOpen && 'rotate-45 text-accent-ink')}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${id}-a${i}`}
                      role="region"
                      aria-labelledby={`${id}-q${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-7 text-lg text-muted">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
