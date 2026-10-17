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
  heartPulse: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  hardDrive: '<path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><path d="M6 16h.01M10 16h.01"/>',
  arrowDownUp: '<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/>',
  memoryStick: '<path d="M6 19v-3M10 19v-3M14 19v-3M18 19v-3M8 11V9M16 11V9M12 11V9M2 15h20"/><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"/>',
  cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
  bug: '<path d="m8 2 1.88 1.88M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
  wifi: '<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0M8.5 16.429a5 5 0 0 1 7 0"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>',
  activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  server: '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/>',
  terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
  clipboardList: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  puzzle: '<path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/>',
  messageSquare: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  shieldCheck: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  shieldInfo: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  shieldAlert: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  shieldX: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m14.5 9.5-5 5"/><path d="m9.5 9.5 5 5"/>',
  shieldPower: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M14.8 10a3.5 3.5 0 1 1-5.6 0"/>',
  shieldPause: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M10 9v6"/><path d="M14 9v6"/>',
  shieldHelp: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><path d="M12 16h.01"/>',
  shieldOff: '<path d="m2 2 20 20"/><path d="M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71"/><path d="M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronsRight: '<path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/>',
  chevronsLeft: '<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  ellipsisVertical: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  square: '<rect width="14" height="14" x="5" y="5" rx="2"/>',
  thumbsUp: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
  list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  arrowDownAZ: '<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M20 8h-5"/><path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10"/><path d="M15 14h5l-5 6h5"/>',
  arrowDownWideNarrow: '<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/>',
  shuffle: '<path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/>',
  power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6.001 6.001 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
  thermometer: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
  windows: '<rect x="3" y="3" width="8" height="8" rx="1" fill="black"/><rect x="13" y="3" width="8" height="8" rx="1" fill="black"/><rect x="3" y="13" width="8" height="8" rx="1" fill="black"/><rect x="13" y="13" width="8" height="8" rx="1" fill="black"/>',
  apple: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
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

// Icônes des plugins (sprites « sprite-plugin-* » de RG) -> icônes du thème.
export const PLUGINS = {
  heartbeat: 'heartPulse', disk: 'hardDrive', 'disk-io': 'arrowDownUp', memory: 'memoryStick', processor: 'cpu',
  antivirus: 'bug', network: 'wifi', event: 'bell', service: 'settings', backup: 'archive', process: 'activity',
  userticket: 'ticket', 'net-action': 'network', exchange: 'mail', replica: 'copy', hardware: 'server',
  script: 'terminal', inventory: 'clipboardList',
};

// États Windows Update (sprites « sprite-wu-* » : bouclier coloré + pastille) -> [icône du thème, couleur].
export const WU = {
  updated: ['shieldCheck', 'var(--rgx-ok)'],
  optional: ['shieldInfo', 'var(--rgx-info)'],
  critical: ['shieldAlert', 'var(--rgx-warn)'],
  reboot: ['shieldPower', 'var(--rgx-crit)'],
  suspended: ['shieldPause', 'var(--rgx-warn)'],
  unknown: ['shieldHelp', 'var(--rgx-muted)'],
  disabled: ['shieldOff', 'var(--rgx-muted)'],
  'disabled-monitoring': ['shieldOff', 'var(--rgx-muted)'],
};

// Sprites « sprite-icon-* » hors menu (fenêtre d'agent, panneau d'actions de la fiche agent, pastilles d'état) -> icône du thème.
export const SPRITES = {
  lumiere: 'headset', command: 'terminal', maintenance: 'wrench', calendar: 'calendar', flag: 'flag',
  appmanager: 'package', asynchronous: 'refresh', security: 'shield', backup: 'database', thermometer: 'thermometer',
};

// Sous-menus du menu latéral (li.menu-lvl-1, par id) -> icônes du thème.
export const SUBMENU = {
  'menu-overview': 'grid', 'menu-sum-servers': 'server', 'menu-sum-workstations': 'monitor', 'menu-sum-devices': 'network',
  'menu-sum-stats': 'chart', 'menu-asynchronous-operations': 'refresh',
  'menu-charts': 'chart', 'menu-listings': 'clipboardList',
  btnNetworkNeighborhood: 'network',
  'menu-actions-lumiere': 'headset', 'menu-actions-system': 'terminal', 'menu-actions-customscripts': 'terminal',
  'menu-actions-windowsupdate': 'download', 'menu-actions-disquette': 'package', 'menu-actions-appmanager': 'package',
  'menu-actions-services': 'settings', 'menu-actions-messages': 'mail',
  'menu-plugins': 'puzzle', 'menu-alerts': 'bell', 'menu-communication': 'messageSquare', 'menu-reactengine': 'zap',
  'menu-library': 'fileText', 'menu-pools': 'copy', 'menu-templates': 'fileText',
  'menu-configuration-report-custom': 'chart', 'menu-configuration-report-supervision': 'chart', 'menu-configuration-hypervisor': 'server',
  'menu-jobs': 'play', 'menu-backup': 'archive', 'menu-vbo': 'cloud', 'menu-reports-backup': 'fileText',
  'menu-security-cybersecurity': 'shield', 'menu-security-antivirus': 'bug', 'menu-security-vulnerabilities': 'triangleAlert',
  'menu-users': 'users', 'menu-ai-billing': 'sparkles', 'menu-quotas': 'gauge', 'menu-profile': 'idcard',
  'menu-downloads-deploymentkit': 'download', 'menu-downloads-agent': 'download', 'menu-downloads-agent-mac': 'download', 'menu-downloads-agent-linux': 'download',
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
  'glyphicon-edit': 'pencil',
  'glyphicon-chevron-right': 'chevronRight',
  'glyphicon-chevron-left': 'chevronLeft',
  'glyphicon-bell': 'bell',
  'glyphicon-forward': 'chevronsRight',
  'glyphicon-backward': 'chevronsLeft',
  'glyphicon-book': 'book',
  'glyphicon-retweet': 'repeat',
  'glyphicon-warning-sign': 'triangleAlert',
  'glyphicon-option-vertical': 'ellipsisVertical',
  'glyphicon-sort': 'arrowDownUp',
  'glyphicon-info-sign': 'info',
  'glyphicon-triangle-bottom': 'chevronDown',
  'glyphicon-share-alt': 'upload',
  'glyphicon-play': 'play',
  'glyphicon-stop': 'square',
  'glyphicon-thumbs-up': 'thumbsUp',
  'glyphicon-th-list': 'list',
  'glyphicon-sort-by-order': 'arrowDownWideNarrow',
  'glyphicon-sort-by-alphabet': 'arrowDownAZ',
  'glyphicon-random': 'shuffle',
  'glyphicon-off': 'power',
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
  out.push('html[data-rgx] #menu-details li.menu-lvl-0 svg.icon-menu use{visibility:hidden}');
  out.push('html[data-rgx] #menu-details li.menu-lvl-0 svg.icon-menu{background-color:currentColor;opacity:.9}');
  for (const [id, name] of Object.entries(MENU)) {
    out.push(`html[data-rgx] #menu-details li#${id} svg.icon-menu{${mask(name).replaceAll('center/contain', 'center/18px 18px')}}`);
  }

  // Sous-menus : icône devant le libellé (menu étendu)
  for (const [id, name] of Object.entries(SUBMENU)) {
    out.push(`html[data-rgx] #block-dashboard:not(.left-menu-shrink) #menu-details li.menu-lvl-1#${id} > a::before{${mask(name)}}`);
  }

  // Plugins (en-têtes des tableaux de synthèse, listes de plugins…) : le dessin d'origine est masqué, l'icône du thème peinte à la place
  out.push('html[data-rgx] svg:has(> use[href*="#sprite-plugin-"]){background-color:currentColor}');
  out.push('html[data-rgx] svg:has(> use[href*="#sprite-plugin-"]) use{visibility:hidden}');
  for (const [id, name] of Object.entries(PLUGINS)) {
    out.push(`html[data-rgx] svg:has(> use[href$="#sprite-plugin-${id}"]){${mask(name)}}`);
  }

  // Statut Windows Update : bouclier du thème, couleur = état (le sprite d'origine mélange 3 couleurs et une pastille)
  out.push('html[data-rgx] svg:has(> use[href*="#sprite-wu-"]) use{visibility:hidden}');
  for (const [id, [name, color]] of Object.entries(WU)) {
    out.push(`html[data-rgx] svg:has(> use[href$="#sprite-wu-${id}"]){background-color:${color};${mask(name)}}`);
  }
  // Assist (sprite « lumiere », fenêtre d'agent) : casque du thème
  for (const [id, name] of Object.entries(SPRITES)) {
    out.push(`html[data-rgx] svg:not(.icon-menu):has(> use[href$="#sprite-icon-${id}"]) use{visibility:hidden}`);
    out.push(`html[data-rgx] svg:not(.icon-menu):has(> use[href$="#sprite-icon-${id}"]){background-color:currentColor;${mask(name)}}`);
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
