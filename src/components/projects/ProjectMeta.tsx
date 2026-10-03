import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface MetaItem {
  label: string;
  value: ReactNode;
}

/** Definition list of small labelled facts (Client, Year, Services…). */
export function ProjectMeta({ items, className }: { items: MetaItem[]; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4', className)}>
      {items.map((item) => (
        <div key={item.label} className="border-t border-border pt-3">
          <dt className="text-meta mb-2 text-muted">{item.label}</dt>
          <dd className="text-sm leading-snug">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
