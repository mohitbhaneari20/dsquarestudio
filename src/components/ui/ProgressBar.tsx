import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useReduceMotion } from '../../lib/motionPreference';

interface ProgressBarProps {
  value: number;
  label: string;
  segments?: number;
  className?: string;
}

/** Segmented progress bar — reads like ████████░░ 80%. Value comes from project data. */
export function ProgressBar({ value, label, segments = 20, className }: ProgressBarProps) {
  const reduce = useReduceMotion();
  const clamped = Math.max(0, Math.min(100, value));
  const filled = Math.round((clamped / 100) * segments);

  return (
    <div
      className={cn('flex items-center gap-4', className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <motion.div
        className="flex flex-1 gap-[3px]"
        initial="empty"
        whileInView="full"
        viewport={{ once: true }}
        transition={{ staggerChildren: reduce ? 0 : 0.03 }}
      >
        {Array.from({ length: segments }, (_, i) => (
          <motion.span
            key={i}
            className={cn('h-2.5 flex-1', i < filled ? (i === filled - 1 ? 'bg-accent' : 'bg-foreground') : 'bg-border')}
            variants={i < filled ? { empty: { opacity: 0.15 }, full: { opacity: 1 } } : undefined}
          />
        ))}
      </motion.div>
      <span className="text-meta w-10 text-right tabular-nums">{clamped}%</span>
    </div>
  );
}
