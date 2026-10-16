// Construit une fixture pour chaque capture trouvée dans un dossier de résultats d'outil.
//   node test/fixtures-all.mjs <dossier>   (captures = fichiers > 500 Ko dont le début contient "route")
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = process.argv[2];
if (!dir) {
  console.error('Usage : node test/fixtures-all.mjs <dossier>');
  process.exit(1);
}
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.txt'))
  .map((f) => path.join(dir, f))
  .filter((f) => statSync(f).size > 500_000 && readFileSync(f, 'utf8').slice(0, 400).includes('route'));

let ok = 0;
let ko = 0;
for (const f of files) {
  try {
    console.log(execFileSync(process.execPath, [path.join(here, 'fixtures-build.mjs'), f], { encoding: 'utf8' }).trim());
    ok++;
  } catch (e) {
    ko++;
    console.error('ÉCHEC', path.basename(f), String(e.message).split('\n')[0]);
  }
}
console.log(`${ok} fixture(s) construite(s), ${ko} échec(s)`);
