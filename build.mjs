// Build : Tailwind CLI -> CSS minifié, polices -> data-URI, assemblage de l'extension Edge (dist/extension)
// Usage : npm run build
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync(path.join(here, 'package.json'), 'utf8'));
mkdirSync(path.join(here, 'dist'), { recursive: true });

// 0. Icônes : src/icons.mjs -> src/icons.generated.css (importé par theme.css)
import { buildIconsCss } from './src/icons.mjs';
writeFileSync(path.join(here, 'src', 'icons.generated.css'), buildIconsCss());

// 0 bis. Style « Arobase » (v3, aligné sur Webgest) : src/css/99-webgest.css est écrit avec le préfixe html[data-rgx] ; on le
//        restreint ici au style actif (html[data-rgx-style="arobase"]) pour que le style « RG System revisité » (v2) reste intact.
writeFileSync(path.join(here, 'src', 'css', '99-webgest.generated.css'),
  readFileSync(path.join(here, 'src', 'css', '99-webgest.css'), 'utf8').replaceAll('html[data-rgx]', 'html[data-rgx][data-rgx-style="arobase"]'));

// 1. Tailwind -> dist/theme.css (minifié) et dist/theme.dev.css (lisible, pour le dev)
const tw = path.join(here, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
const run = (out, extra = []) =>
  execFileSync(process.execPath, [tw, '-i', 'src/theme.css', '-o', out, ...extra], { cwd: here, stdio: 'inherit' });
run('dist/theme.dev.css');
run('dist/theme.css', ['--minify']);

// 2. Polices locales (subset latin) -> @font-face en data-URI.
//    Aucun appel à Google Fonts à l'exécution : conforme à la CSP et plus rapide.
const FONTS = [
  ['Inter', '@fontsource/inter', 'inter', [400, 500, 600]],
  ['Space Grotesk', '@fontsource/space-grotesk', 'space-grotesk', [500, 600]],
  ['JetBrains Mono', '@fontsource/jetbrains-mono', 'jetbrains-mono', [400]],
];
let fonts = '';
for (const [family, mod, file, weights] of FONTS) {
  const dir = path.dirname(require.resolve(`${mod}/package.json`));
  for (const w of weights) {
    const b64 = readFileSync(path.join(dir, 'files', `${file}-latin-${w}-normal.woff2`)).toString('base64');
    fonts += `@font-face{font-family:"${family}";font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
    // Alias : plusieurs composants de RG imposent « Roboto » avec une spécificité que le thème ne peut pas battre sans !important.
    // Une @font-face « Roboto » qui pointe sur Inter règle le cas partout, sans toucher aux sélecteurs.
    if (family === 'Inter' && (w === 400 || w === 600)) {
      fonts += `@font-face{font-family:"Roboto";font-style:normal;font-weight:${w === 400 ? '100 500' : '600 900'};font-display:swap;src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
    }
  }
}
writeFileSync(path.join(here, 'dist', 'fonts.css'), fonts);

// 3. Extension Edge/Chrome : dist/extension/, à charger en mode développeur (edge://extensions).
//    Le CSS est injecté par le navigateur lui-même (content_scripts.css), avant le premier rendu.
const css = readFileSync(path.join(here, 'dist', 'theme.css'), 'utf8').trim();
const ext = path.join(here, 'dist', 'extension');
rmSync(ext, { recursive: true, force: true });
mkdirSync(ext, { recursive: true });
const manifest = readFileSync(path.join(here, 'src', 'extension', 'manifest.template.json'), 'utf8').replaceAll('__VERSION__', pkg.version);
JSON.parse(manifest); // échoue ici si le JSON est invalide
writeFileSync(path.join(ext, 'manifest.json'), manifest);
copyFileSync(path.join(here, 'src', 'extension', 'content.js'), path.join(ext, 'content.js'));
for (const f of ['popup.html', 'popup.css', 'popup.js', 'background.js']) copyFileSync(path.join(here, 'src', 'extension', f), path.join(ext, f));
for (const f of readdirSync(path.join(here, 'src', 'extension', 'icons'))) {
  mkdirSync(path.join(ext, 'icons'), { recursive: true });
  copyFileSync(path.join(here, 'src', 'extension', 'icons', f), path.join(ext, 'icons', f));
}
if (existsSync(path.join(here, 'THIRD-PARTY-NOTICES.md'))) copyFileSync(path.join(here, 'THIRD-PARTY-NOTICES.md'), path.join(ext, 'THIRD-PARTY-NOTICES.md'));
writeFileSync(path.join(ext, 'theme.css'), css);
writeFileSync(path.join(ext, 'fonts.css'), fonts);

console.log(`OK  dist/extension/  (CSS ${(css.length / 1024).toFixed(1)} Ko, polices ${(fonts.length / 1024).toFixed(0)} Ko)`);
