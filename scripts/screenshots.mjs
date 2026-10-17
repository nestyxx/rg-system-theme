// Génère les captures du README (docs/img/*.png) avec Edge en mode headless, à partir du banc de test local.
//   npm run serve   (dans un autre terminal)   puis   node scripts/screenshots.mjs
// Les pages utilisées sont les fixtures locales (non versionnées, anonymisées) et test/surfaces.html (balisage fictif).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs', 'img');
mkdirSync(out, { recursive: true });
const edge = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/microsoft-edge', '/usr/bin/chromium', '/usr/bin/google-chrome',
].find(existsSync);
if (!edge) { console.error('Edge / Chrome introuvable.'); process.exit(1); }
const base = process.env.BASE || 'http://localhost:4173';

const SHOTS = [
  ['direction', '/direction.html', '1440,900', 6000],
  ['rg-light', '/fixtures/views-sum-all.html?theme=light', '1440,900', 12000],
  ['rg-dark', '/fixtures/views-sum-all.html?theme=dark', '1440,900', 12000],
  ['rg-original', '/fixtures/views-sum-all.html?off=1', '1440,900', 12000],
  ['rg-charts-dark', '/fixtures/data-network--st24-d3-k7.html?theme=dark', '1440,900', 12000],
  ['rg-config-light', '/fixtures/configuration-alerts.html?theme=light', '1440,900', 12000],
  ['rg-login', '/surfaces.html?view=login&theme=light', '1000,640', 6000],
  ['rg-tablet', '/fixtures/pedigree.html?theme=light', '820,1000', 12000],
];
const only = process.argv.slice(2);
// Aperçu social (fichier local, sans serveur)
SHOTS.push(['social-preview', 'FILE:docs/social-preview.html', '1280,640', 6000]);
for (const [name, url, size, budget] of SHOTS) {
  if (only.length && !only.includes(name)) continue;
  const file = path.join(out, name + '.png');
  try {
    execFileSync(edge, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      `--window-size=${size}`, `--virtual-time-budget=${budget}`, `--screenshot=${file}`, (url.startsWith('FILE:') ? 'file:///' + path.join(root, url.slice(5)).replaceAll('\\', '/') : base + url)], { stdio: 'pipe', timeout: 90000 });
    console.log('OK  docs/img/' + name + '.png');
  } catch (e) { console.error('ÉCHEC ' + name + ' : ' + String(e.message).split('\n')[0]); }
}
