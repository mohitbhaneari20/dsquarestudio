// Serves the motion page and saves recorded videos into the studio site.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// Saves into the site's public/assets/home
const OUT = join(here, '../../public/assets/home');

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' && url.pathname === '/save') {
    const name = basename(url.searchParams.get('name') || 'clip.webm');
    const chunks = [];
    for await (const c of req) chunks.push(c);
    await mkdir(OUT, { recursive: true });
    await writeFile(join(OUT, name), Buffer.concat(chunks));
    res.end('ok');
    return;
  }
  try {
    const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
    res.end(await readFile(join(here, basename(file))));
  } catch {
    res.statusCode = 404;
    res.end('404');
  }
}).listen(+process.env.PORT || 5199, function () {
  console.log('http://localhost:' + this.address().port);
});
