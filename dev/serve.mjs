// Serveur de dev local : sert dist/ (thème), dist/extension/ (content.js) et test/ (bancs de test,
// fixtures de pages RG) avec CORS.  Usage : npm run serve  puis  http://localhost:4173/
import http from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dirs = [path.join(root, 'dist'), path.join(root, 'dist', 'extension'), path.join(root, 'test'), path.join(root, 'maquette')];
const port = Number(process.env.PORT || 4173);
const types = {
  '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
};

const send = (res, status, body, type = 'text/plain') => {
  res.writeHead(status, { 'Content-Type': type.startsWith('text/') ? `${type}; charset=utf-8` : type, 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' });
  res.end(body);
};

http.createServer(async (req, res) => {
  // Préflight « Private Network Access » : page HTTPS publique -> localhost
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Private-Network': 'true' });
    return res.end();
  }
  const url = new URL(req.url, 'http://x');
  const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');

  // Fixtures et ressources : chemin relatif à test/ (ex. /fixtures/tickets.html, /fixtures/assets/xxx.svg)
  if (rel.startsWith('fixtures/')) {
    const p = path.normalize(path.join(root, 'test', rel));
    if (!p.startsWith(path.join(root, 'test'))) return send(res, 403, 'interdit');
    try {
      const buf = await readFile(p);
      return send(res, 200, buf, types[path.extname(p)] || 'application/octet-stream');
    } catch { return send(res, 404, 'not found'); }
  }

  // Page d'index : liste des fixtures
  if (rel === '' || rel === 'index.html') {
    let list = [];
    try { list = (await readdir(path.join(root, 'test', 'fixtures'))).filter((f) => f.endsWith('.html')).sort(); } catch { /* aucune fixture */ }
    const links = list.map((f) => `<li><a href="/fixtures/${f}">${f}</a> — <a href="/fixtures/${f}?theme=dark">sombre</a></li>`).join('');
    return send(res, 200, `<!doctype html><meta charset=utf-8><title>Fixtures</title><h1>Fixtures (${list.length})</h1><ul>${links}</ul>`, 'text/html');
  }

  // Fichiers du thème et bancs de test : recherche par nom dans dist/, dist/extension/, test/
  const name = path.basename(rel);
  for (const dir of dirs) {
    try {
      const body = await readFile(path.join(dir, name));
      return send(res, 200, body, types[path.extname(name)] || 'text/plain');
    } catch { /* dossier suivant */ }
  }
  return send(res, 404, 'not found');
}).listen(port, '127.0.0.1', () => console.log(`dev : http://127.0.0.1:${port}/`));
