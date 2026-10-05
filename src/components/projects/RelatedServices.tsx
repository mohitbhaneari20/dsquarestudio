import { Link } from 'react-router-dom';
import { services } from '../../data/services';
import type { Category } from '../../data/types';

/** Which service each project category belongs to (section ids on /services). */
const SERVICE_FOR: Partial<Record<Category, string>> = {
  Branding: 'branding-design-systems',
  'UI / UX': 'ui-ux-web-design',
  Web: 'ui-ux-web-design',
  Development: 'web-development',
  Motion: 'motion-graphic-design',
};

/** "Related services" links from a case study to the matching sections of the Services page. */
export function RelatedServices({ categories, className }: { categories: Category[]; className?: string }) {
  const slugs = [...new Set(categories.map((c) => SERVICE_FOR[c]).filter((s): s is string => !!s))];
  const list = slugs.map((slug) => services.find((s) => s.slug === slug)).filter((s): s is (typeof services)[number] => !!s);
  if (!list.length) return null;
  return (
    <p className={className}>
      <span className="text-meta mr-3 text-muted">Related services</span>
      {list.map((s, i) => (
        <span key={s.slug}>
          {i > 0 && <span className="text-muted"> · </span>}
          <Link to={`/services#${s.slug}`} className="link-underline">
            {s.title}
          </Link>
        </span>
      ))}
    </p>
  );
}
