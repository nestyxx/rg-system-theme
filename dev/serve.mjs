// Serveur de dev local : sert dist/ et test/ (banc de test) avec CORS.
// Utile pour prévisualiser le CSS et lancer test/harness.html (voir README, « Développement »).
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dirs = [path.join(root, 'dist'), path.join(root, 'test')];
const port = Number(process.env.PORT || 4173);
const types = { '.css': 'text/css', '.js': 'text/javascript', '.html': 'text/html' };

http.createServer(async (req, res) => {
  // Préflight « Private Network Access » : page HTTPS publique -> localhost
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Private-Network': 'true',
    });
    return res.end();
  }
  const name = path.basename(new URL(req.url, 'http://x').pathname) || 'harness.html';
  for (const dir of dirs) {
    try {
      const body = await readFile(path.join(dir, name));
      res.writeHead(200, {
        'Content-Type': `${types[path.extname(name)] || 'text/plain'}; charset=utf-8`,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      });
      return res.end(body);
    } catch { /* on essaie le dossier suivant */ }
  }
  res.writeHead(404); res.end('not found');
}).listen(port, '127.0.0.1', () => console.log(`dev : http://127.0.0.1:${port}/harness.html`));
