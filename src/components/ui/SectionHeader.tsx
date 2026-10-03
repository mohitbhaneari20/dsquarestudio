import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { TextReveal } from './TextReveal';
import { Reveal } from './Reveal';
import { SquareBullet } from './SquareBullet';

interface SectionHeaderProps {
  eyebrow: string;
  /** Section counter shown next to the eyebrow, e.g. '01' */
  index?: string;
  /** Each array item renders on its own line */
  title: string[];
  intro?: ReactNode;
  action?: ReactNode;
  className?: string;
  as?: 'h1' | 'h2';
}

/** Eyebrow + large headline + optional intro and action, on the 12-col grid. */
export function SectionHeader({ eyebrow, index, title, intro, action, className, as = 'h2' }: SectionHeaderProps) {
  return (
    <header className={cn('grid-site gap-y-8', className)}>
      <div className="col-span-12 self-start border-t border-border pt-4 text-muted lg:col-span-3">
        {/* Side by side with the heading (lg+), the tag starts at the top of its capitals */}
        <div className={cn('flex items-center gap-3', as === 'h1' ? 'lg:tag-top-h1' : 'lg:tag-top-h2')}>
          <SquareBullet />
          {index && <span className="text-meta">{index}</span>}
          <span className="text-meta">{eyebrow}</span>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-9 lg:border-t lg:border-border lg:pt-4">
        <TextReveal as={as} lines={title} className={as === 'h1' ? 'text-h1' : 'text-h2'} />
        {(intro || action) && (
          <Reveal delay={0.15} className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {intro && <div className="text-lead max-w-xl text-muted">{intro}</div>}
            {action && <div className="shrink-0">{action}</div>}
          </Reveal>
        )}
      </div>
    </header>
  );
}
