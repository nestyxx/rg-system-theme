// Transforme une capture de page RG System (JSON produit par le script de capture) en page HTML
// autonome dans test/fixtures/ : DOM + CSS effectif + sprites/polices en fichiers locaux.
//
//   node test/fixtures-build.mjs <fichier-capture> <nom>      ex. : ... tickets
//
// Les fixtures ne sont PAS versionnées (test/fixtures/ est dans .gitignore) : même anonymisées,
// elles reproduisent l'interface d'un compte client réel.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [, , file, nameArg] = process.argv;
if (!file) {
  console.error('Usage : node test/fixtures-build.mjs <fichier-capture> [nom]');
  process.exit(1);
}

// Le fichier d'outil est un tableau [{type, text}]. Le champ text contient la capture sous forme de
// chaîne JSON (littéral entre guillemets), suivie d'une ligne de contexte ajoutée par l'outil.
let txt = readFileSync(file, 'utf8');
if (txt.trimStart().startsWith('[')) txt = JSON.parse(txt)[0].text;
if (txt.startsWith('"')) {
  let i = 1;
  while (i < txt.length && txt[i] !== '"') i += txt[i] === String.fromCharCode(92) ? 2 : 1;   // fin du littéral de chaîne
  txt = JSON.parse(txt.slice(0, i + 1));
}
const cap = JSON.parse(txt);

// Nom de la fixture : donné, sinon déduit de la route (#/node/root/page/views/sum/servers -> views-sum-servers)
const slug = (r) => { const m = new RegExp('#/node/([^/]+)/page/(.+)$').exec(r || ''); const page = (m ? m[2] : (r || 'page')).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase(); return m && m[1] !== 'root' ? `${page}--${m[1].toLowerCase()}` : page; };
const name = nameArg || slug(cap.route);

const assetsDir = path.join(here, 'fixtures', 'assets');
mkdirSync(assetsDir, { recursive: true });

const EXT = { 'image/svg+xml': 'svg', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'font/woff2': 'woff2', 'font/woff': 'woff', 'application/font-woff': 'woff', 'application/font-woff2': 'woff2', 'font/ttf': 'ttf', 'application/x-font-ttf': 'ttf', 'application/vnd.ms-fontobject': 'eot', 'text/css': 'css' };
const urlMap = {};
for (const [u, a] of Object.entries(cap.assets || {})) {
  const ct = (a.ct || '').split(';')[0].trim();
  const ext = EXT[ct] || path.extname(new URL(u).pathname).slice(1) || 'bin';
  const hash = createHash('sha1').update(u).digest('hex').slice(0, 12);
  const out = `${hash}.${ext}`;
  const p = path.join(assetsDir, out);
  if (!existsSync(p)) writeFileSync(p, Buffer.from(a.b64, 'base64'));
  urlMap[u] = `/fixtures/assets/${out}`;
}

const rewriteUrl = (u) => {
  try {
    const abs = new URL(u, cap.origin + '/').href;
    const [base, frag] = abs.split('#');
    return urlMap[base] ? urlMap[base] + (frag ? '#' + frag : '') : u;
  } catch { return u; }
};

let css = cap.css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (m, q, u) => (/^data:/.test(u) ? m : `url("${rewriteUrl(u)}")`));
css = css.replace(/<\/style/gi, '<\\/style');

let body = cap.body
  .replace(/(href|xlink:href)="([^"#]*dist\/[^"#]*)(#[^"]*)?"/g, (m, attr, u, frag) => `${attr}="${rewriteUrl(u)}${frag || ''}"`)
  .replace(/(src)="([^"]+)"/g, (m, attr, u) => (/^(data:|http)/.test(u) ? m : `${attr}="${rewriteUrl(u)}"`));

const html = `<!doctype html>
<html lang="fr" class="${cap.htmlClass || ''}">
<head>
<meta charset="utf-8">
<title>${(cap.title || 'RG System').replace(/</g, '&lt;')} — fixture ${name} (${cap.route})</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>
// Réglages de test : ?theme=dark|light|auto  ?density=compact  ?off=1 (thème désactivé)
(function () {
  var q = new URLSearchParams(location.search);
  localStorage.setItem('rgx.theme', q.get('theme') || 'light');
  localStorage.setItem('rgx.density', q.get('density') || 'comfortable');
  if (q.get('off') === '1') localStorage.setItem('rgx.enabled', '0'); else localStorage.removeItem('rgx.enabled');
})();
</script>
<style>
${css}
</style>
<!-- Thème (comme l'extension : feuilles injectées puis script) -->
<link rel="stylesheet" href="/fonts.css">
<link rel="stylesheet" href="/theme.css">
</head>
<body id="${cap.bodyId || ''}" class="${cap.bodyClass || ''}">
${body}
<script src="/content.js"></script>
<script>
// Fixture statique : jsTree positionne ses barres de survol/sélection (span.jstree-wholerow-span) en JavaScript
// d'après la géométrie d'origine. On les recale sur la géométrie réelle (thème appliqué).
(function () {
  function fix() {
    document.querySelectorAll('.jstree-wholerow-real').forEach(function (ul) {
      var base = ul.getBoundingClientRect().top;
      ul.querySelectorAll('li').forEach(function (li) {
        var sp = li.querySelector(':scope > .jstree-wholerow-span'); if (!sp) return;
        var a = li.querySelector(':scope > a'); if (!a) return;
        var r = a.getBoundingClientRect(); sp.style.top = (r.top - base) + 'px'; sp.style.height = r.height + 'px';
      });
    });
  }
  window.addEventListener('load', function () { setTimeout(fix, 150); setTimeout(fix, 800); });
})();
</script>
</body>
</html>
`;

const outDir = path.join(here, 'fixtures');
writeFileSync(path.join(outDir, `${name}.html`), html);
console.log(`OK  test/fixtures/${name}.html  (${(html.length / 1024).toFixed(0)} Ko, ${Object.keys(urlMap).length} ressources)`);
