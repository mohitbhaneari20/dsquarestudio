import { cn } from '../../lib/cn';
import {
  HEADER_COPYRIGHT_PATHS,
  HEADER_LOGO_VIEWBOX,
  LOGO_HORIZONTAL_VIEWBOX,
  MARK_COPYRIGHT_PATHS,
  MARK_PATHS,
  MARK_VIEWBOX,
  WORDMARK_ONE_LINE_PATHS,
  WORDMARK_ONE_LINE_VIEWBOX,
  WORDMARK_TWO_LINE_PATHS,
} from './paths';

interface BrandProps {
  className?: string;
  /** Accessible name. Pass `null` when the logo sits next to visible text that already names it. */
  title?: string | null;
  /** Show the © in the mark's notch */
  copyright?: boolean;
}

function a11y(title: string | null | undefined, fallback: string) {
  return title === null ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': title ?? fallback };
}

/** The square monogram on its own, with the © in its top-right notch (as in the official monogram file). */
export function BrandMark({ className, title, copyright = true }: BrandProps) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={cn('fill-current', className)} {...a11y(title, 'Dsquare Studio')}>
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
      {copyright && HEADER_COPYRIGHT_PATHS.map((d, i) => <path key={`c${i}`} d={d} />)}
    </svg>
  );
}

/** Horizontal lockup: mark + "Dsquare / Studio". */
export function BrandLogo({ className, title, copyright = true }: BrandProps) {
  return (
    <svg viewBox={LOGO_HORIZONTAL_VIEWBOX} className={cn('fill-current', className)} {...a11y(title, 'Dsquare Studio')}>
      {MARK_PATHS.map((d, i) => (
        <path key={`m${i}`} d={d} />
      ))}
      {copyright && MARK_COPYRIGHT_PATHS.map((d, i) => <path key={`c${i}`} d={d} />)}
      {WORDMARK_TWO_LINE_PATHS.map((d, i) => (
        <path key={`w${i}`} d={d} />
      ))}
    </svg>
  );
}

/** "Dsquare Studio" on one line — scales to any width. */
export function BrandWordmark({ className, title }: Omit<BrandProps, 'copyright'>) {
  return (
    <svg viewBox={WORDMARK_ONE_LINE_VIEWBOX} className={cn('fill-current', className)} {...a11y(title, 'Dsquare Studio')}>
      {WORDMARK_ONE_LINE_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Header lockup (updated logo file): mark with © in its top-right notch + "Dsquare / Studio". */
export function HeaderLogo({ className, title }: Omit<BrandProps, 'copyright'>) {
  return (
    <svg viewBox={HEADER_LOGO_VIEWBOX} className={cn('fill-current', className)} {...a11y(title, 'Dsquare Studio')}>
      {MARK_PATHS.map((d, i) => (
        <path key={`m${i}`} d={d} />
      ))}
      {HEADER_COPYRIGHT_PATHS.map((d, i) => (
        <path key={`c${i}`} d={d} />
      ))}
      {WORDMARK_TWO_LINE_PATHS.map((d, i) => (
        <path key={`w${i}`} d={d} />
      ))}
    </svg>
  );
}

/** The D² monogram set inline with text (labels, eyebrows) in place of typed "D²". Reads as "D²" to screen readers. */
export function InlineMonogram({ className }: { className?: string }) {
  return (
    <>
      <BrandMark title={null} copyright={false} className={cn('inline-block size-[1.15em] align-[-0.22em]', className)} />
      <span className="sr-only">D²</span>
    </>
  );
}
