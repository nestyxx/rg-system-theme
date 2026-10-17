// Tests automatiques du thème (aucun navigateur requis) :  npm test
//  1. le build passe et produit les fichiers attendus ;
//  2. manifest.json : JSON valide, version = package.json, tous les fichiers référencés existent ;
//  3. aucune ressource externe dans le CSS livré (CSP : pas de CDN) ;
//  4. contraste WCAG AA (4,5:1) des couples de couleurs du thème clair ET sombre ;
//  5. aucun nom de client / donnée réelle dans les fichiers versionnés (liste dans test/forbidden.txt, non versionnée).
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => readFileSync(path.join(root, ...p), 'utf8');
let failed = 0;
const ok = (msg) => console.log('  ✓ ' + msg);
const ko = (msg) => { failed++; console.log('  ✗ ' + msg); };
const check = (cond, msg) => (cond ? ok(msg) : ko(msg));

// 1. Build
console.log('Build');
try {
  execFileSync(process.execPath, [path.join(root, 'build.mjs')], { cwd: root, stdio: 'pipe' });
  ok('npm run build');
} catch (e) {
  ko('npm run build : ' + String(e.stderr || e.message).split('\n').slice(0, 3).join(' | '));
}

// 1b. Syntaxe des scripts de l'extension
for (const f of ['content.js', 'popup.js']) {
  try { execFileSync(process.execPath, ['--check', path.join(root, 'src', 'extension', f)], { stdio: 'pipe' }); ok('syntaxe ' + f); } catch (e) { ko('syntaxe ' + f + ' : ' + String(e.stderr).slice(0, 200)); }
}

// 2. Manifest
console.log('Manifest');
const ext = path.join(root, 'dist', 'extension');
const pkg = JSON.parse(read('package.json'));
let manifest = {};
try { manifest = JSON.parse(read('dist', 'extension', 'manifest.json')); ok('JSON valide'); } catch (e) { ko('manifest.json illisible : ' + e.message); }
check(manifest.manifest_version === 3, 'Manifest V3');
check(manifest.version === pkg.version, `version ${manifest.version} = package.json ${pkg.version}`);
const refs = [
  ...Object.values(manifest.icons || {}),
  ...Object.values((manifest.action || {}).default_icon || {}),
  (manifest.action || {}).default_popup,
  ...(manifest.content_scripts || []).flatMap((c) => [...(c.css || []), ...(c.js || [])]),
].filter(Boolean);
for (const f of new Set(refs)) check(existsSync(path.join(ext, f)), `fichier présent : ${f}`);
const hosts = [...(manifest.host_permissions || []), ...(manifest.content_scripts || []).flatMap((c) => c.matches)];
check(hosts.length > 0 && hosts.every((h) => h === 'https://dashboard.rg-supervision.com/*'), 'accès limité à dashboard.rg-supervision.com');

// 3. CSS : pas de ressource externe
console.log('CSS livré');
const css = read('dist', 'extension', 'theme.css') + read('dist', 'extension', 'fonts.css');
const ext_urls = [...css.matchAll(/url\(\s*["']?(https?:)?\/\/[^)]+/g)].map((m) => m[0].slice(0, 60));
check(ext_urls.length === 0, 'aucune ressource externe (url(http…))' + (ext_urls.length ? ' : ' + ext_urls[0] : ''));
check(!/@import\s+(url\()?["']?https?:/.test(css), 'aucun @import distant');
for (const f of ['popup.html', 'popup.css', 'popup.js']) check(existsSync(path.join(ext, f)), `fichier présent : ${f}`);
check(css.length < 600 * 1024, `taille raisonnable (${(css.length / 1024).toFixed(0)} Ko)`);
const unscoped = [...read('dist', 'theme.dev.css').matchAll(/^(?!\s)([^@\s}/*][^{]*)\{/gm)].map((m) => m[1].trim()).filter((s) => !/html\[data-rgx\]|^\.rgx-|^#rgx-|^:root|^\*|^@|^from|^to|^\d+%/.test(s));
check(unscoped.length === 0, 'toutes les règles sont sous html[data-rgx]' + (unscoped.length ? ' : ' + unscoped.slice(0, 3).join(' ; ') : ''));

// 4. Contrastes
console.log('Contrastes (WCAG AA, 4,5:1)');
const tokens = read('src', 'css', '00-tokens.css');
const block = (re) => Object.fromEntries([...tokens.match(re)[1].matchAll(/--rgx-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const light = block(/html\[data-rgx\]\s*\{([^}]*)\}/);
const dark = { ...light, ...block(/data-rgx-theme="dark"\]\s*\{([^}]*)\}/) };
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const PAIRS = [
  ['ink', 'bg'], ['ink', 'surface'], ['ink', 'surface-2'], ['ink', 'row-hover'],
  ['muted', 'surface'], ['muted', 'bg'],
  ['brand', 'surface'], ['brand', 'bg'], ['brand-ink', 'brand'], ['brand-ink', 'brand-hover'],
  ['ok', 'ok-bg'], ['warn', 'warn-bg'], ['crit', 'crit-bg'], ['info', 'info-bg'],
  ['ok', 'surface'], ['warn', 'surface'], ['crit', 'surface'],
  ['side-text', 'side'],
];
for (const [name, t] of [['clair', light], ['sombre', dark]]) {
  for (const [fg, bg] of PAIRS) {
    const r = ratio(t[fg], t[bg]);
    check(r >= 4.5, `${name} : ${fg} sur ${bg} = ${r.toFixed(2)}`);
  }
}
check(ratio('#ffffff', dark['side-active']) >= 4.5, `sombre : blanc sur side-active = ${ratio('#ffffff', dark['side-active']).toFixed(2)}`);

// 5. Données sensibles : contrôle générique (adresses e-mail réelles) + liste locale facultative
console.log('Données sensibles');
{
  const files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter((f) => f && !f.startsWith('node_modules') && !/\.(png|woff2?|ico)$/.test(f) && f !== 'package-lock.json');
  const mails = [];
  for (const f of files) {
    if (!existsSync(path.join(root, f)) || statSync(path.join(root, f)).size > 3_000_000) continue;
    for (const m of readFileSync(path.join(root, f), 'utf8').matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g)) {
      if (!/(example|exemple|noreply|\.test$|domaine|rgsystem\.com$)/i.test(m[0]) && !/@(media|font-face|import|keyframes|layer|property|supports|container)/.test(m[0])) mails.push(f + ' : ' + m[0]);
    }
  }
  check(mails.length === 0, 'aucune adresse e-mail réelle dans les fichiers suivis' + (mails.length ? ' → ' + [...new Set(mails)].slice(0, 3).join(' ; ') : ''));
}
const forbiddenFile = path.join(root, 'test', 'forbidden.txt');
if (existsSync(forbiddenFile)) {
  const words = read('test', 'forbidden.txt').split('\n').map((s) => s.trim()).filter(Boolean);
  const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter((f) => f && !f.startsWith('node_modules') && !/\.(png|woff2?)$/.test(f) && f !== 'test/forbidden.txt');
  const hits = [];
  for (const f of tracked) {
    if (!existsSync(path.join(root, f)) || statSync(path.join(root, f)).size > 3_000_000) continue;
    const txt = readFileSync(path.join(root, f), 'utf8').toLowerCase();
    for (const w of words) if (txt.includes(w.toLowerCase())) hits.push(`${f} : « ${w} »`);
  }
  check(hits.length === 0, `aucune occurrence des ${words.length} termes interdits` + (hits.length ? ' → ' + hits.slice(0, 3).join(' ; ') : ''));
} else {
  console.log('  - test/forbidden.txt absent : contrôle ignoré');
}

console.log(failed ? `\n${failed} échec(s)` : '\nTout est vert.');
process.exit(failed ? 1 : 0);
