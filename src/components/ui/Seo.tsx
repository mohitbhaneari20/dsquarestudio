import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { absolute, canonicalFor, jsonLdFor, metaFor } from '../../seo/meta';

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
 * Keeps the document head in sync with the current route on client-side navigation.
 * All titles, descriptions, images and structured data live in src/seo/meta.ts; the
 * same values are written into each page's HTML at build time, so the tags here
 * update existing ones rather than adding duplicates.
 */
export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaFor(pathname);
    const url = meta.noIndex ? null : canonicalFor(pathname);
    const image = absolute(meta.image);

    document.title = meta.title;
    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'robots', meta.noIndex ? 'noindex, follow' : 'index, follow');
    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (url) upsertLink('canonical', url);
    else canonical?.remove();

    upsertMeta('property', 'og:type', meta.type);
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', url ?? absolute(pathname));
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:image:alt', meta.imageAlt);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', image);

    let ld = document.getElementById('ld-json');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'ld-json';
      ld.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(jsonLdFor(meta));
  }, [pathname]);

  return null;
}
