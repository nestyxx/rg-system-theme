// Icônes du thème (style « Lucide » : trait 2 px, extrémités arrondies, grille 24×24).
// Source unique : le build (build.mjs) en génère src/icons.generated.css, importé par theme.css.
// Les icônes sont appliquées en CSS (mask-image) : aucune requête réseau, couleur = currentColor,
// donc elles suivent automatiquement le thème clair/sombre et les états de survol.
//
// Pour ajouter une icône : 1) l'ajouter dans ICONS, 2) l'associer à un sélecteur dans MENU ou GLYPHS.

export const ICONS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="black"/>',
  idcard: '<rect width="18" height="16" x="3" y="4" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M6 16c.6-1.6 5.4-1.6 6 0"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>',
  play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  filter: '<path d="M3 6h18M7 12h10M10 18h4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronUp: '<path d="m18 15-6-6-6 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  calendar: '<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  arrowUp: '<circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/>',
  arrowDown: '<circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
  fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
  listTree: '<path d="M21 12h-8M21 6H8M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  circleCheck: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  triangleAlert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  circleAlert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
};

// Entrées du menu latéral (id du <li> RG System -> icône)
export const MENU = {
  'search-menu': 'search',
  'menu-views': 'grid',
  'menu-tickets': 'tag',
  'menu-pedigree': 'idcard',
  'menu-data': 'chart',
  'menu-network': 'network',
  'menu-actions': 'play',
  'menu-configuration': 'settings',
  'menu-backup-parent': 'database',
  'menu-security': 'shield',
  'menu-management': 'users',
  'menu-downloads': 'download',
};

// Glyphicons Bootstrap 3 (police d'icônes d'origine) -> icônes du thème.
// Les glyphicons non listés gardent leur dessin d'origine.
export const GLYPHS = {
  'glyphicon-plus': 'plus',
  'glyphicon-remove': 'x',
  'glyphicon-ok': 'check',
  'glyphicon-search': 'search',
  'glyphicon-refresh': 'refresh',
  'glyphicon-filter': 'filter',
  'glyphicon-share': 'upload',
  'glyphicon-trash': 'trash',
  'glyphicon-pencil': 'pencil',
  'glyphicon-chevron-down': 'chevronDown',
  'glyphicon-chevron-up': 'chevronUp',
  'glyphicon-menu-hamburger': 'menu',
  'glyphicon-question-sign': 'help',
  'glyphicon-time': 'clock',
  'glyphicon-calendar': 'calendar',
  'glyphicon-flag': 'flag',
  'glyphicon-circle-arrow-up': 'arrowUp',
  'glyphicon-circle-arrow-down': 'arrowDown',
  'glyphicon-download-alt': 'download',
  'glyphicon-cog': 'settings',
};

// Encodage minimal d'un SVG en data-URI (les guillemets doubles passent en simples).
const uri = (inner) =>
  'url("data:image/svg+xml,' +
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E') +
  '")';

// Chaque icône est déclarée UNE fois, dans une variable CSS ; les règles ne font que la référencer.
const mask = (name) => {
  if (!ICONS[name]) throw new Error(`Icône inconnue : ${name}`);
  return `-webkit-mask:var(--rgx-ic-${name}) center/contain no-repeat;mask:var(--rgx-ic-${name}) center/contain no-repeat;`;
};

// Génère le CSS : une classe utilitaire par icône + menu + glyphicons.
export function buildIconsCss() {
  const out = ['/* GÉNÉRÉ par build.mjs à partir de src/icons.mjs : ne pas éditer à la main. */'];
  out.push('html[data-rgx]{' + Object.entries(ICONS).map(([n, i]) => `--rgx-ic-${n}:${uri(i)}`).join(';') + '}');

  // Icône générique réutilisable : <i class="rgx-i rgx-i-moon">
  for (const name of Object.keys(ICONS)) {
    out.push(`.rgx-i-${name}{${mask(name)}}`);
  }
  out.push('.rgx-i{display:inline-block;width:1.1em;height:1.1em;background-color:currentColor;vertical-align:-0.2em;flex:none}');

  // Menu latéral : on garde l'encombrement du sprite RG (svg.icon-menu 22×22) mais on masque son
  // dessin (<use>) et on peint l'icône du thème avec background + mask sur le <svg> lui-même.
  out.push('html[data-rgx] #menu-details li.menu-lvl-0 > a svg.icon-menu use{visibility:hidden}');
  out.push('html[data-rgx] #menu-details li.menu-lvl-0 > a svg.icon-menu{background-color:currentColor;opacity:.9}');
  for (const [id, name] of Object.entries(MENU)) {
    out.push(`html[data-rgx] #menu-details li#${id} > a svg.icon-menu{${mask(name).replaceAll('center/contain', 'center/18px 18px')}}`);
  }

  // Glyphicons
  const classes = Object.keys(GLYPHS);
  out.push(
    classes.map((c) => `html[data-rgx] .${c}`).join(',') +
      '{width:1.15em;height:1.15em;top:0;vertical-align:-0.2em}'
  );
  for (const [cls, name] of Object.entries(GLYPHS)) {
    out.push(`html[data-rgx] .${cls}::before{content:"";display:block;width:100%;height:100%;background-color:currentColor;${mask(name)}}`);
  }
  return out.join('\n') + '\n';
}
