import { createServer, defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * After the build, write a real HTML file per route with its own SEO tags, plus
 * 404.html, sitemap.xml and robots.txt. Route metadata comes from src/seo/meta.ts,
 * loaded through a throwaway Vite server so the TypeScript data files work as-is.
 */
function seoPrerender(): Plugin {
  let outDir = 'dist';
  return {
    name: 'dsquare-seo-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const server = await createServer({ configFile: false, appType: 'custom', server: { middlewareMode: true }, logLevel: 'error' });
      try {
        const seo = await server.ssrLoadModule('/src/seo/meta.ts');
        const { prerender } = await server.ssrLoadModule('/scripts/prerender-seo.ts');
        const count = prerender(outDir, seo);
        console.log(`  seo: ${count} pages, 404.html, sitemap.xml and robots.txt written`);
      } finally {
        await server.close();
      }
    },
  };
}

// Use the port the environment assigns (e.g. the preview tool's autoPort), else Vite's defaults
const assignedPort = process.env.PORT ? Number(process.env.PORT) : undefined;

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPrerender()],
  server: { port: assignedPort ?? 5173 },
  preview: { port: assignedPort ?? 4173 },
});
