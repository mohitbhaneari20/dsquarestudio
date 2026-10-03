import { Fragment } from 'react';
import { stages, type Stage } from '../../data/types';
import { cn } from '../../lib/cn';

/** IDEA → BRAND → DESIGN → DEVELOPMENT → LAUNCH, with the current stage highlighted. */
export function PhaseTimeline({ current, className }: { current: Stage; className?: string }) {
  const currentIndex = stages.indexOf(current);
  return (
    <ol className={cn('text-meta flex flex-wrap items-center gap-x-2 gap-y-2', className)} aria-label="Project stages">
      {stages.map((stage, i) => (
        <Fragment key={stage}>
          <li
            className={cn(
              'inline-flex items-center gap-1.5',
              i < currentIndex && 'text-foreground',
              i === currentIndex && 'rounded-full bg-foreground px-2.5 py-1 text-background',
              i > currentIndex && 'text-muted',
            )}
            aria-current={i === currentIndex ? 'step' : undefined}
          >
            {i < currentIndex && <span aria-hidden="true">✓</span>}
            {stage}
            {i < currentIndex && <span className="sr-only">(done)</span>}
          </li>
          {i < stages.length - 1 && (
            <li aria-hidden="true" className="text-muted">
              →
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
