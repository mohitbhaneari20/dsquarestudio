import { useMotionPreference } from '../../lib/motionPreference';
import { cn } from '../../lib/cn';

/**
 * Header switch for site animations. Follows the system setting until the
 * visitor chooses; the choice is remembered on this device.
 * Shows "Motion" + a small switch on desktop, just the switch on phones.
 */
export function MotionToggle({ className }: { className?: string }) {
  const { reduce, choice, setMotionEnabled } = useMotionPreference();
  const on = !reduce;
  const hint = `Animations ${on ? 'on' : 'off'}${choice === null ? ' (following your system setting)' : ''} — click to turn ${on ? 'off' : 'on'}`;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Motion"
      title={hint}
      onClick={() => setMotionEnabled(!on)}
      className={cn(
        'group inline-flex h-11 min-w-11 items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground',
        className,
      )}
    >
      <span className="hidden lg:inline" aria-hidden="true">
        Motion
      </span>
      {/* Track + knob */}
      <span
        aria-hidden="true"
        className={cn(
          'relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full border transition-colors duration-300',
          on ? 'border-accent bg-accent' : 'border-foreground/25 bg-transparent group-hover:border-foreground/50',
        )}
      >
        <span
          className={cn(
            'absolute size-3 rounded-full transition-transform duration-300 ease-out',
            on ? 'translate-x-[15px] bg-[var(--accent-foreground)]' : 'translate-x-[2px] bg-foreground/40',
          )}
        />
      </span>
    </button>
  );
}
