import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../../config/site';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Updates the document head for the current route.
 * index.html holds the same tags as defaults for non-JS crawlers.
 */
export function Seo({ title, description = site.defaultDescription, image = site.ogImage, type = 'website', noIndex }: SeoProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} — ${site.name}` : site.defaultTitle;
    const url = `${site.url}${pathname === '/' ? '/' : pathname}`;
    const imageUrl = image.startsWith('http') ? image : `${site.url}${image}`;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noIndex ? 'noindex' : 'index, follow');
    upsertLink('canonical', url);

    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', imageUrl);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
  }, [title, description, image, type, noIndex, pathname]);

  return null;
}
