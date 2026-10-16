// Empaquette dist/extension en dist/rg-system-theme-<version>.zip (à transmettre tel quel : « Charger l'extension décompressée » après extraction).
//   npm run build && npm run pack
import { readFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const src = path.join(root, 'dist', 'extension');
const zip = path.join(root, 'dist', `rg-system-theme-${version}.zip`);
if (!existsSync(path.join(src, 'manifest.json'))) { console.error('dist/extension absent : lancer « npm run build » d\'abord.'); process.exit(1); }
rmSync(zip, { force: true });
if (process.platform === 'win32') {
  execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${src}\*' -DestinationPath '${zip}' -Force`], { stdio: 'inherit' });
} else {
  execFileSync('zip', ['-r', zip, '.'], { cwd: src, stdio: 'inherit' });
}
console.log('OK  ' + path.relative(root, zip));
