/**
 * Build step: writes one HTML file per route with its own SEO head, plus 404.html,
 * sitemap.xml and robots.txt. Runs after `vite build` (see vite.config.ts).
 *
 * The app is still a single-page app — every file loads the same bundle — but each
 * URL now arrives with the right title, description, canonical, Open Graph / Twitter
 * tags, JSON-LD and a no-JavaScript fallback, and unknown URLs get a real 404.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { RouteMeta } from '../src/seo/meta';

type SeoModule = typeof import('../src/seo/meta');

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function head(m: RouteMeta, seo: SeoModule) {
  const url = seo.canonicalFor(m.path);
  const image = seo.absolute(m.image);
  const ld = JSON.stringify(seo.jsonLdFor(m)).replace(/</g, '\\u003c');
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.noIndex ? 'noindex, follow' : 'index, follow'}" />`,
    m.noIndex ? '' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="Dsquare Studio" />`,
    `<meta property="og:type" content="${m.type}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(m.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json" id="ld-json">${ld}</script>`,
  ]
    .filter(Boolean)
    .map((l) => `    ${l}`)
    .join('\n');
}

/** What a crawler or reader without JavaScript sees: the page's heading, summary and onward links. */
function fallback(m: RouteMeta, seo: SeoModule) {
  const links = seo.FALLBACK_LINKS.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('');
  return `<noscript><main><h1>${esc(m.h1)}</h1><p>${esc(m.description)}</p><nav aria-label="Site"><ul>${links}</ul></nav></main></noscript>`;
}

export function prerender(outDir: string, seo: SeoModule) {
  const template = readFileSync(join(outDir, 'index.html'), 'utf8');
  const render = (m: RouteMeta) =>
    template
      .replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, `<!-- seo -->\n${head(m, seo)}`)
      .replace(/<!-- seo:noscript -->[\s\S]*?<!-- \/seo:noscript -->/, fallback(m, seo));

  const routes = seo.allRoutes();
  for (const m of routes) {
    // Clean URLs: /work/falance is served from work/falance.html
    const file = m.path === '/' ? 'index.html' : `${m.path.slice(1)}.html`;
    const target = join(outDir, file);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, render(m));
  }
  writeFileSync(join(outDir, '404.html'), render(seo.NOT_FOUND));

  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .filter((m) => !m.noIndex)
    .map(
      (m) =>
        `  <url>\n    <loc>${seo.canonicalFor(m.path)}</loc>\n    <lastmod>${today}</lastmod>\n` +
        (m.changefreq ? `    <changefreq>${m.changefreq}</changefreq>\n` : '') +
        (m.priority !== undefined ? `    <priority>${m.priority.toFixed(1)}</priority>\n` : '') +
        `  </url>`,
    )
    .join('\n');
  writeFileSync(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${seo.ORIGIN}/sitemap.xml\n`);

  return routes.length;
}
