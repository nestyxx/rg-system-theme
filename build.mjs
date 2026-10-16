// Build : Tailwind CLI -> CSS minifié, polices -> data-URI, assemblage du .user.js
// Usage : npm run build
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync(path.join(here, 'package.json'), 'utf8'));
mkdirSync(path.join(here, 'dist'), { recursive: true });

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
  }
}
writeFileSync(path.join(here, 'dist', 'fonts.css'), fonts);

// 3. Assemblage du userscript
const css = readFileSync(path.join(here, 'dist', 'theme.css'), 'utf8').trim();
let js = readFileSync(path.join(here, 'src', 'userscript.template.js'), 'utf8');
js = js
  .replaceAll('__VERSION__', pkg.version)
  .replace("/*__CSS_FONTS__*/''", () => JSON.stringify(fonts))
  .replace("/*__CSS_THEME__*/''", () => JSON.stringify(css));
writeFileSync(path.join(here, 'dist', 'rg-system-theme.user.js'), js);
console.log(`OK  dist/rg-system-theme.user.js  (${(js.length / 1024).toFixed(0)} Ko, CSS ${(css.length / 1024).toFixed(1)} Ko)`);
