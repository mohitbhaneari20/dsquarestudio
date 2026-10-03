import { cn } from '../../lib/cn';

/** The small accent square used as a bullet and section marker — the "square" in Dsquare. */
export function SquareBullet({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('inline-block size-[7px] shrink-0 bg-accent', className)} />;
}
