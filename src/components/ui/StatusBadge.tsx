import { cn } from '../../lib/cn';

/** Mono uppercase badge with a live dot, e.g. ● BUILDING */
export function StatusBadge({ label, live = true, className }: { label: string; live?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'text-meta inline-flex h-7 items-center gap-2 rounded-full border border-border px-3 text-foreground',
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', live ? 'animate-pulse-dot bg-accent' : 'bg-muted')} aria-hidden="true" />
      {label}
    </span>
  );
}
