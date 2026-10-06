import { useReduceMotion, useSetMotion } from '../../lib/motionPreference';
import { cn } from '../../lib/cn';

/** Small fixed switch in the bottom-right corner of every page: Motion On / Off. */
export function MotionToggle() {
  const reduce = useReduceMotion();
  const setMotion = useSetMotion();
  const on = !reduce;
  return (
    <button
      type="button"
      onClick={() => setMotion(!on)}
      aria-pressed={on}
      aria-label={on ? 'Motion on — turn animations off' : 'Motion off — turn animations on'}
      className="text-meta fixed bottom-4 right-4 z-[90] inline-flex h-9 items-center gap-2 border border-border bg-[#fafafa]/90 px-3 text-black shadow-[0_8px_24px_-12px_rgb(0_0_0/0.35)] backdrop-blur-sm transition-colors hover:bg-black hover:text-[#fafafa] md:bottom-5 md:right-5"
    >
      <span aria-hidden="true" className={cn('size-[7px] transition-colors', on ? 'bg-accent' : 'border border-current')} />
      Motion: {on ? 'On' : 'Off'}
    </button>
  );
}
