import { motion } from 'framer-motion';
import { categories, type Category } from '../../data/types';
import { cn } from '../../lib/cn';

interface CategoryFilterProps {
  active?: Category;
  counts: Record<string, number>;
  total: number;
  onChange: (category?: Category) => void;
}

/** Plain-text filter with a sliding underline — no pills. */
export function CategoryFilter({ active, counts, total, onChange }: CategoryFilterProps) {
  const options: Array<{ label: string; value?: Category; count: number }> = [
    { label: 'All', count: total },
    ...categories.map((c) => ({ label: c, value: c, count: counts[c] ?? 0 })),
  ];

  return (
    <div role="group" aria-label="Filter projects by category" className="flex gap-x-6 gap-y-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-wrap md:gap-x-8">
      {options.map((o) => {
        const isActive = o.value === active;
        const empty = o.count === 0;
        return (
          <button
            key={o.label}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={isActive}
            // Categories with no projects yet can't be picked (they'd show an empty list)
            disabled={empty && !isActive}
            className={cn(
              'relative shrink-0 py-2 text-sm uppercase tracking-[0.02em] transition-colors',
              isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
              empty && !isActive && 'cursor-default opacity-40 hover:text-muted',
            )}
          >
            {o.label}
            <sup className="ml-1 font-mono text-[11px]">{o.count}</sup>
            {isActive && (
              <motion.span
                layoutId="work-filter-underline"
                className="absolute inset-x-0 bottom-0 h-[2px] bg-accent"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
