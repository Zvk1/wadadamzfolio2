// Dependency-free local preview of this native HTML/CSS/ES-module website.
// For optimized production output, use npm run build and npm run preview.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.pdf':'application/pdf', '.svg':'image/svg+xml', '.ico':'image/x-icon' };
const port = 5174;
const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/favicon.ico') { res.writeHead(204).end(); return; }
    const base = pathname.startsWith('/src/') || pathname === '/' ? root : resolve(root, 'public');
    const path = pathname === '/' ? resolve(root, 'index.html') : resolve(base, `.${pathname}`);
    if (!path.startsWith(base.endsWith(sep) ? base : base + sep) || !(await stat(path)).isFile()) {
      res.writeHead(404).end('Not found'); return;
    }
    const data = await readFile(path);
    res.writeHead(200, { 'Content-Type':mime[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404).end('Not found'); }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Portfolio v2: http://127.0.0.1:${port}`));
